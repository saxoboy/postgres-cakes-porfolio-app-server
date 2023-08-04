import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthRegisterInput } from '../auth/dto/inputs/auth.register.input';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(authRegisterInput: AuthRegisterInput): Promise<User> {
    if (authRegisterInput.password.length <= 5) {
      this.handleErrosDb({
        code: 'error-password-length',
        detail: 'password must be at least 6 characters',
      });
    }
    try {
      const newUser = this.userRepository.create({
        ...authRegisterInput,
        password: await bcrypt.hash(authRegisterInput.password, 10),
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleErrosDb(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    // si se envia roles vacio, se retornan todos los usuarios
    if (roles.length === 0) {
      return await this.userRepository.find();
    }

    return this.userRepository
      .createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleErrosDb({
        ...error,
        code: 'error-login-email',
        detail: 'email or password not found',
      });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleErrosDb({
        ...error,
        code: 'error-login-id',
        detail: 'id not found',
      });
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    updateBy: User,
  ): Promise<User> {
    try {
      const userToUpdate = await this.userRepository.preload({
        ...updateUserInput,
        id,
      });

      if (!userToUpdate) {
        throw new BadRequestException('User not found');
      }

      userToUpdate._updatedAt = new Date();
      userToUpdate._updatedById = updateBy.id;

      return await this.userRepository.save(userToUpdate);
    } catch (error) {
      this.handleErrosDb(error);
    }
  }

  async updateLastLogin(id: string, lastLogin: { lastLogin: Date }) {
    try {
      const userToUpdate = await this.userRepository.preload({
        ...lastLogin,
        id,
      });

      if (!userToUpdate) {
        throw new BadRequestException('User not found');
      }

      return await this.userRepository.save(userToUpdate);
    } catch (error) {
      this.handleErrosDb(error);
    }
  }

  async remove(id: string, adminUser: User): Promise<User> {
    const userToRemove = await this.userRepository.findOneBy({ id });

    if (!userToRemove) {
      throw new BadRequestException('User not found');
    }

    userToRemove.isActive = false;
    userToRemove._updatedAt = new Date();
    userToRemove._updatedById = adminUser.id;

    return await this.userRepository.save(userToRemove);
  }

  private logger = new Logger(UsersService.name);

  private handleErrosDb(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key ', 'Field'));
    }

    if (error.code === 'error-login-email') {
      throw new BadRequestException(error.detail.replace('Key ', 'Field'));
    }

    if (error.code === 'error-login-id') {
      throw new BadRequestException(error.detail.replace('Key ', 'Field'));
    }

    if (error.code === 'error-password-length') {
      throw new BadRequestException(error.detail.replace('Key ', 'Field'));
    }

    this.logger.error(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}

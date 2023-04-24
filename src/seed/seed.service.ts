import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { SEED_CAKES, SEED_USERS } from './data/seed-data';
import { Cake } from 'src/cakes/entities/cake.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CakesService } from 'src/cakes/cakes.service';

@Injectable()
export class SeedService {
  private isProduction: boolean;

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Cake)
    private readonly cakeRepository: Repository<Cake>,

    private readonly usersService: UsersService,
    private readonly cakesService: CakesService,
  ) {
    this.isProduction = this.configService.get('NODE_ENV') === 'production';
  }

  async seed() {
    if (this.isProduction) {
      throw new UnauthorizedException('Cannot seed production database');
    }
    await this.dropDb();
    const user = await this.seedUsers();
    await this.seedCakes(user);
  }

  async dropDb() {
    if (this.isProduction) {
      throw new UnauthorizedException('Cannot drop production database');
    }
    await this.userRepository.createQueryBuilder().delete().where({}).execute();
    await this.cakeRepository.createQueryBuilder().delete().where({}).execute();
  }

  async seedUsers(): Promise<User> {
    const users = [];

    for (const user of SEED_USERS) {
      users.push(await this.usersService.createUser(user));
    }

    return users[0];
  }

  async seedCakes(user: User): Promise<void> {
    const cakes = [];

    for (const cake of SEED_CAKES) {
      cakes.push(await this.cakesService.create(cake, user));
    }

    await Promise.all(cakes);
  }
}

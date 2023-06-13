import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginInput, AuthRegisterInput } from './dto/inputs';
import { AuthResponse } from './dto/types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async register(authRegisterInput: AuthRegisterInput): Promise<AuthResponse> {
    const user = await this.usersService.createUser(authRegisterInput);
    const token = this.getJwtToken(user.id);
    return { user, token };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;

    const user = await this.usersService.findOneByEmail(email.toLowerCase());

    if (password.length <= 5) {
      throw new Error('Password must be at least 6 characters');
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Email / Password do not match');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }

  async logOut(user: User): Promise<AuthResponse> {
    return {
      user,
      token: null,
    };
  }

  async me(user: User): Promise<User> {
    return user;
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);

    if (!user.isActive) {
      throw new UnauthorizedException(`User is inactive, talk with an admin`);
    }

    delete user.password;

    return user;
  }

  async revaliteToken(user: User): Promise<AuthResponse> {
    const token = this.getJwtToken(user.id);
    return { user, token };
  }
}

import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthRegisterInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.auth.guards';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'AuthRegister' })
  async register(
    @Args('authRegisterInput') authRegisterInput: AuthRegisterInput,
  ): Promise<AuthResponse> {
    return await this.authService.register(authRegisterInput);
  }

  @Mutation(() => AuthResponse, { name: 'AuthLogin' })
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthResponse> {
    return await this.authService.login(loginInput);
  }

  @Mutation(() => AuthResponse, { name: 'AuthLogout' })
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: User): Promise<AuthResponse> {
    return await this.authService.logOut(user);
  }

  @Query(() => AuthResponse, { name: 'AuthRevalite' })
  @UseGuards(JwtAuthGuard)
  async revaliteToken(
    @CurrentUser([ValidRoles.root, ValidRoles.admin, ValidRoles.user])
    user: User,
  ): Promise<AuthResponse> {
    return await this.authService.revaliteToken(user);
  }
}

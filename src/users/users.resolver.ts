import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Int,
  Parent,
} from '@nestjs/graphql';
import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { CakesService } from '../cakes/cakes.service';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { UpdateUserInput } from './dto/update-user.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guards';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly cakesService: CakesService,
  ) {}

  @Query(() => [User], { name: 'UsersFindAll' })
  findAll(
    @Args() validateRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.root, ValidRoles.admin]) user: User,
  ): Promise<User[]> {
    return this.usersService.findAll(validateRoles.roles);
  }

  @Query(() => User, { name: 'UserFindOne' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.root, ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'UserUpdate' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.root, ValidRoles.admin]) user: User,
  ): Promise<User> {
    return await this.usersService.update(
      updateUserInput.id,
      updateUserInput,
      user,
    );
  }

  @Mutation(() => User, { name: 'UserRemove' })
  removeUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.root, ValidRoles.admin]) user: User,
  ) {
    return this.usersService.remove(id, user);
  }

  @ResolveField(() => Int, { name: 'cakeCount' })
  async cakeCount(
    @Parent() user: User,
    @CurrentUser([ValidRoles.root, ValidRoles.admin]) admin: User,
  ): Promise<number> {
    return await this.cakesService.countByUser(user);
  }
}

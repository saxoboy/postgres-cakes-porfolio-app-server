import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CakesService } from './cakes.service';
import { Cake } from './entities/cake.entity';
import { CreateCakeInput, UpdateCakeInput } from './dto/inputs';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guards';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Cake)
@UseGuards(JwtAuthGuard)
export class CakesResolver {
  constructor(private readonly cakesService: CakesService) {}

  @Mutation(() => Cake, { name: 'CakeCreate' })
  async createCake(
    @Args('createCakeInput') createCakeInput: CreateCakeInput,
    @CurrentUser() user: User,
  ): Promise<Cake> {
    return await this.cakesService.create(createCakeInput, user);
  }

  @Query(() => [Cake], { name: 'CakesFindAll' })
  async findAll(@CurrentUser() user: User): Promise<Cake[]> {
    return await this.cakesService.findAll(user);
  }

  @Query(() => Cake, { name: 'CakeFindOne' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Cake> {
    return await this.cakesService.findOne(id, user);
  }

  @Mutation(() => Cake, { name: 'CakeUpdate' })
  async updateCake(
    @Args('updateCakeInput') updateCakeInput: UpdateCakeInput,
    @CurrentUser() user: User,
  ): Promise<Cake> {
    return await this.cakesService.update(
      updateCakeInput.id,
      updateCakeInput,
      user,
    );
  }

  @Mutation(() => Cake, { name: 'CakeRemove' })
  async removeCake(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Cake> {
    return await this.cakesService.remove(id, user);
  }
}

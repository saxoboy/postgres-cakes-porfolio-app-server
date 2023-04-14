import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { CakesService } from './cakes.service';
import { Cake } from './entities/cake.entity';
import { CreateCakeInput, UpdateCakeInput } from './dto/inputs';

@Resolver(() => Cake)
export class CakesResolver {
  constructor(private readonly cakesService: CakesService) {}

  @Mutation(() => Cake, { name: 'CakeCreate' })
  async createCake(
    @Args('createCakeInput') createCakeInput: CreateCakeInput,
  ): Promise<Cake> {
    return await this.cakesService.create(createCakeInput);
  }

  @Query(() => [Cake], { name: 'CakesFindAll' })
  async findAll(): Promise<Cake[]> {
    return await this.cakesService.findAll();
  }

  @Query(() => Cake, { name: 'CakeOne' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Cake> {
    return await this.cakesService.findOne(id);
  }

  @Mutation(() => Cake, { name: 'CakeUpdate' })
  async updateCake(
    @Args('updateCakeInput') updateCakeInput: UpdateCakeInput,
  ): Promise<Cake> {
    return await this.cakesService.update(updateCakeInput.id, updateCakeInput);
  }

  @Mutation(() => Cake, { name: 'CakeRemove' })
  async removeCake(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Cake> {
    return await this.cakesService.remove(id);
  }
}

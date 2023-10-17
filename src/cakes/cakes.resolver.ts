import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CakesService } from './cakes.service';
import { User } from 'src/users/entities/user.entity';
import { Cake } from './entities/cake.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { CreateCakeInput, UpdateCakeInput } from './dto/inputs';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guards';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';

@Resolver(() => Cake)
export class CakesResolver {
  constructor(
    private readonly cakesService: CakesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Cake, { name: 'CakeCreate' })
  async createCake(
    @Args('createCakeInput') createCakeInput: CreateCakeInput,
    @CurrentUser() user: User,
  ): Promise<Cake> {
    return await this.cakesService.create(createCakeInput, user);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Cake], { name: 'CakesFindAll' })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Cake[]> {
    return await this.cakesService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => [Cake], { name: 'CakesFindAllPublic' })
  async findAllPublic(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Cake[]> {
    return await this.cakesService.findAllPublic(paginationArgs, searchArgs);
  }

  @Query(() => Cake, { name: 'CakeFindOne' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Cake> {
    return await this.cakesService.findOne(id, user);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Cake, { name: 'CakeDeactivate' })
  async deactivateCake(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Cake> {
    return await this.cakesService.deactivate(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Cake, { name: 'CakeRemove' })
  async removeCake(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Cake> {
    return await this.cakesService.remove(id, user);
  }

  @ResolveField(() => Category, { name: 'category' })
  async getCategory(@Parent() cake: Cake): Promise<Category> {
    return await this.categoriesService.findOneCategory(cake.category.id);
  }
}

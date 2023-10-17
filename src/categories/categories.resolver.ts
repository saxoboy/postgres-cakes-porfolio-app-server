import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guards';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Resolver(() => Category)
@UseGuards(JwtAuthGuard)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => Category, { name: 'CategoryCreate' })
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
    @CurrentUser() user: User,
  ): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryInput, user);
  }

  @Query(() => [Category], { name: 'CategoriesFindAll' })
  findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Category[]> {
    return this.categoriesService.findAllCategory(
      user,
      paginationArgs,
      searchArgs,
    );
  }

  @Query(() => Category, { name: 'category' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.categoriesService.findOneCategory(id);
  }

  // @Mutation(() => Category)
  // updateCategory(
  //   @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  // ) {
  //   return this.categoriesService.updateCategory(
  //     updateCategoryInput.id,
  //     updateCategoryInput,
  //   );
  // }

  // @Mutation(() => Category)
  // removeCategory(@Args('id', { type: () => Int }) id: number) {
  //   return this.categoriesService.removeCategory(id);
  // }
}

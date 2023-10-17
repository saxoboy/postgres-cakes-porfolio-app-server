import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { Category } from './entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
//import { UpdateCategoryInput } from './dto/update-category.input';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async createCategory(
    createCategoryInput: CreateCategoryInput,
    user: User,
  ): Promise<Category> {
    const { name } = createCategoryInput;
    const slug = name.toLowerCase().replace(/ /g, '-');
    const category = await this.categoryRepository.findOne({ where: { slug } });
    if (category) {
      throw new NotFoundException('Category already exists');
    }
    const newCategory = this.categoryRepository.create({
      ...createCategoryInput,
      slug,
    });
    return this.categoryRepository.save(newCategory);
  }

  async findAllCategory(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Category[]> {
    const { offset, limit } = paginationArgs;
    const { search } = searchArgs.search ? searchArgs : { search: '' };

    const query = this.categoryRepository
      .createQueryBuilder('category')
      .where('category.userId = :userId', { userId: user.id })
      .andWhere('category.isActive = :isActive', { isActive: true })
      .take(limit)
      .skip(offset);

    if (search && search.length > 2) {
      query
        .andWhere('category.name ILIKE :search', {
          search: `%${search}%`,
        })
        .orWhere('category.description ILIKE :search', {
          search: `%${search}%`,
        });
    }
    return await query.getMany();
  }

  async findOneCategory(id: string): Promise<Category> {
    try {
      return await this.categoryRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Category not found');
    }
  }

  // async updateCategory(id: number, updateCategoryInput: UpdateCategoryInput) {
  //   return `This action updates a #${id} category`;
  // }

  // async removeCategory(id: number) {
  //   return `This action removes a #${id} category`;
  // }
}

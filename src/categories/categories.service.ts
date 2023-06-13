import { Injectable } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Injectable()
export class CategoriesService {
  async createCategory(createCategoryInput: CreateCategoryInput) {
    return 'This action adds a new category';
  }

  async findAllCategory() {
    return `This action returns all categories`;
  }

  async findOneCategory(id: number) {
    return `This action returns a #${id} category`;
  }

  async updateCategory(id: number, updateCategoryInput: UpdateCategoryInput) {
    return `This action updates a #${id} category`;
  }

  async removeCategory(id: number) {
    return `This action removes a #${id} category`;
  }
}

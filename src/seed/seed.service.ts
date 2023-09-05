import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { SEED_CAKES, SEED_USERS } from './data/seed-data';
import { Cake } from 'src/cakes/entities/cake.entity';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { UsersService } from 'src/users/users.service';
import { CakesService } from 'src/cakes/cakes.service';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class SeedService {
  private isProduction: boolean;

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cake)
    private readonly cakeRepository: Repository<Cake>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,

    private readonly usersService: UsersService,
    private readonly cakesService: CakesService,
    private readonly categoriesService: CategoriesService,
  ) {
    this.isProduction = this.configService.get('STATE') === 'production';
  }

  async seed() {
    if (this.isProduction) {
      throw new UnauthorizedException('Cannot seed production database');
    }
    await this.dropDb(); // Drop database
    const user = await this.seedUsers(); // Seed users
    await this.seedCakes(user); // Seed cakes
  }

  async dropDb() {
    if (this.isProduction) {
      throw new UnauthorizedException('Cannot drop production database');
    }
    // Delete all data from Cake table
    await this.cakeRepository.createQueryBuilder().delete().where({}).execute();

    // Delete all data from Category table
    await this.categoriesRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // Delete all data from User table
    await this.userRepository.createQueryBuilder().delete().where({}).execute();
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

import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { CakesModule } from 'src/cakes/cakes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), CakesModule],
  providers: [CategoriesResolver, CategoriesService],
  exports: [CategoriesService, TypeOrmModule],
})
export class CategoriesModule {}

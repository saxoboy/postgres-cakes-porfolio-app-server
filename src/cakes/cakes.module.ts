import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CakesService } from './cakes.service';
import { CakesResolver } from './cakes.resolver';
import { Cake } from './entities/cake.entity';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cake]), CategoriesModule],
  providers: [CakesResolver, CakesService],
  exports: [CakesService, TypeOrmModule],
})
export class CakesModule {}

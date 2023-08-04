import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { UsersModule } from 'src/users/users.module';
import { CakesModule } from 'src/cakes/cakes.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [ConfigModule, UsersModule, CakesModule, CategoriesModule],
})
export class SeedModule {}

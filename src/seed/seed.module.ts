import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { UsersModule } from 'src/users/users.module';
import { CakesModule } from 'src/cakes/cakes.module';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [ConfigModule, UsersModule, CakesModule],
})
export class SeedModule {}

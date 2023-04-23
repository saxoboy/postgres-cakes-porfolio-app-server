import { Module } from '@nestjs/common';
import { CakesService } from './cakes.service';
import { CakesResolver } from './cakes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cake } from './entities/cake.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cake])],
  providers: [CakesResolver, CakesService],
  exports: [CakesService, TypeOrmModule],
})
export class CakesModule {}

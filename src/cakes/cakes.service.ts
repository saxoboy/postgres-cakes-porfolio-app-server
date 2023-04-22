import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCakeInput, UpdateCakeInput } from './dto/inputs';
import { Cake } from './entities/cake.entity';

@Injectable()
export class CakesService {
  constructor(
    @InjectRepository(Cake)
    private readonly cakeRepository: Repository<Cake>,
  ) {}

  async create(createCakeInput: CreateCakeInput): Promise<Cake> {
    const newCake = this.cakeRepository.create(createCakeInput);
    return await this.cakeRepository.save(newCake);
  }

  async findAll(): Promise<Cake[]> {
    return await this.cakeRepository.find();
  }

  async findOne(id: string): Promise<Cake> {
    const cake = await this.cakeRepository.findOneBy({ id });
    if (!cake) {
      throw new NotFoundException('Cake not found');
    }
    return cake;
  }

  async update(id: string, updateCakeInput: UpdateCakeInput): Promise<Cake> {
    const cake = await this.cakeRepository.preload(updateCakeInput);
    if (!cake) {
      throw new NotFoundException('Cake not found');
    }
    return await this.cakeRepository.save(cake);
  }

  async remove(id: string) {
    const cake = await this.findOne(id);
    await this.cakeRepository.remove(cake);
    return { ...cake, id };
  }
}

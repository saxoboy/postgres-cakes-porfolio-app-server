import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCakeInput, UpdateCakeInput } from './dto/inputs';
import { Cake } from './entities/cake.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CakesService {
  constructor(
    @InjectRepository(Cake)
    private readonly cakeRepository: Repository<Cake>,
  ) {}

  async create(createCakeInput: CreateCakeInput, user: User): Promise<Cake> {
    const newCake = this.cakeRepository.create({ ...createCakeInput, user });
    return await this.cakeRepository.save(newCake);
  }

  async findAll(user: User): Promise<Cake[]> {
    return await this.cakeRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
      relations: ['user'],
    });
  }

  async findOne(id: string, user: User): Promise<Cake> {
    const cake = await this.cakeRepository.findOneBy({
      id,
      user: { id: user.id },
    });

    if (!cake) {
      throw new NotFoundException('Cake not found');
    }
    return cake;
  }

  async update(
    id: string,
    updateCakeInput: UpdateCakeInput,
    user: User,
  ): Promise<Cake> {
    await this.findOne(id, user);
    const cake = await this.cakeRepository.preload(updateCakeInput);
    if (!cake) {
      throw new NotFoundException('Cake not found');
    }
    return await this.cakeRepository.save(cake);
  }

  async remove(id: string, user: User): Promise<Cake> {
    const cake = await this.findOne(id, user);
    await this.cakeRepository.remove(cake);
    return { ...cake, id };
  }

  async countByUser(user: User): Promise<number> {
    return await this.cakeRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}

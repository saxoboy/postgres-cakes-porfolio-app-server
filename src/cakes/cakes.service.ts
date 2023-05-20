import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCakeInput, UpdateCakeInput } from './dto/inputs';
import { Cake } from './entities/cake.entity';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Injectable()
export class CakesService {
  constructor(
    @InjectRepository(Cake)
    private readonly cakeRepository: Repository<Cake>,
  ) {}

  async create(createCakeInput: CreateCakeInput, user: User): Promise<Cake> {
    const { name } = createCakeInput;
    const slug = name.toLowerCase().replace(/ /g, '-');
    const cake = await this.cakeRepository.findOneBy({ slug });
    if (cake) {
      throw new NotFoundException('Cake already exists');
    }
    const newCake = this.cakeRepository.create({
      ...createCakeInput,
      slug,
      user,
      _createdById: user.id,
      _updatedById: user.id,
    });
    return await this.cakeRepository.save(newCake);
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Cake[]> {
    const { offset, limit } = paginationArgs;
    const { search } = searchArgs.search ? searchArgs : { search: '' };

    const query = this.cakeRepository
      .createQueryBuilder('cake')
      .take(limit)
      .skip(offset)
      .where('cake.userId = :userId', { userId: user.id });

    if (search) {
      query
        .andWhere('unaccent(lower(cake.name)) ILIKE unaccent(lower(:search))', {
          search: `%${search}%`,
        })
        .orWhere(
          'unaccent(lower(cake.description)) ILIKE unaccent(lower(:search))',
          { search: `%${search}%` },
        );
    }

    return await query.getMany();
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
    cake._updatedById = user.id;
    return await this.cakeRepository.save(cake);
  }

  async deactivate(id: string, user: User): Promise<Cake> {
    const cake = await this.findOne(id, user);
    cake.isActive = false;
    cake._updatedById = user.id;
    cake._updatedAt = new Date();
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

// return await this.cakeRepository.find({
//   take: limit,
//   skip: offset,
//   where: {
//     user: {
//       id: user.id,
//     },
//   },
//   relations: ['user'],
// });

import { Column, Entity, OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Base } from 'src/base/base.entity';
import { Cake } from 'src/cakes/entities/cake.entity';
import { IsOptional, IsUrl } from 'class-validator';

@Entity({ name: 'categoryCakes' })
@ObjectType()
export class Category extends Base {
  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @IsOptional()
  slug: string;

  @Field(() => String, { nullable: true })
  @Column()
  description: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @IsUrl()
  imageUrl?: string;

  @Field(() => [Cake])
  @OneToMany(() => Cake, (cake) => cake.category, {
    nullable: true,
    lazy: true,
  })
  cakes?: Cake[];

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}

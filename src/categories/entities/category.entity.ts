import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsOptional, IsUrl } from 'class-validator';
import { Base } from 'src/base/base.entity';
import { Cake } from 'src/cakes/entities/cake.entity';

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

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Cake, (cake) => cake.category, {
    nullable: true,
    lazy: true,
  })
  @Field(() => [Cake])
  cakes?: Cake[];
}

import { ObjectType, Field } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from 'src/base/base.entity';
import { Cake } from 'src/cakes/entities/cake.entity';

@Entity({ name: 'users' })
@ObjectType()
export class User extends Base {
  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  lastname: string;

  @Column({ unique: true })
  @Field(() => String)
  @IsEmail()
  email: string;

  @Column()
  @MinLength(6)
  password: string;

  @Column({ type: 'text', array: true, default: ['user'] })
  @Field(() => [String])
  roles: string[];

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  isActive: boolean;

  @OneToMany(() => Cake, (cake) => cake.user, { nullable: true, lazy: true })
  @Field(() => [Cake])
  cakes?: Cake[];
}

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { Base } from 'src/base/base.entity';

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
}

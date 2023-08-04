import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class AuthResponse {
  @Field(() => String, { nullable: true })
  @IsString()
  token?: string;

  @Field(() => User, { nullable: true })
  user: User;
}

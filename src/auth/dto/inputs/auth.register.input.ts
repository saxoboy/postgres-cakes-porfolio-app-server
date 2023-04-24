import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@InputType()
export class AuthRegisterInput {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String)
  @IsString()
  lastname: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  password: string;

  @Field(() => [ValidRoles], { nullable: true })
  @IsArray()
  @IsOptional()
  roles?: ValidRoles[];
}

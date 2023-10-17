import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  slug?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  imageUrl?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isActive?: boolean;
}

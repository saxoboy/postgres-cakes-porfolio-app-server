import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';

@InputType()
export class CreateCakeInput {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  slug?: string;

  @Field(() => String)
  @IsString()
  description: string;

  @Field(() => String, { nullable: true })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  photos?: string[];

  @Field(() => Category, { nullable: true })
  @IsString()
  @IsOptional()
  category?: Category;
}

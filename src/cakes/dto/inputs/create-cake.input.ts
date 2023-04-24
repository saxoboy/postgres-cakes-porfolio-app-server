import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl } from 'class-validator';

@InputType()
export class CreateCakeInput {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String)
  @IsString()
  slug: string;

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
}

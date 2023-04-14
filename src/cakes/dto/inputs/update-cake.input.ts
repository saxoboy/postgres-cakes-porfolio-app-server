import { IsString, IsUUID } from 'class-validator';
import { CreateCakeInput } from './create-cake.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateCakeInput extends PartialType(CreateCakeInput) {
  @Field(() => ID)
  @IsString()
  @IsUUID()
  id: string;
}

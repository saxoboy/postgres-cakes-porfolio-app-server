import { Field, ID, InterfaceType } from '@nestjs/graphql';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@InterfaceType()
export class Base {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  @IsUUID(4)
  id: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @IsDateString()
  _createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @IsDateString()
  _updatedAt: Date;

  @Field(() => ID, { nullable: true })
  @Column({ nullable: true })
  @IsOptional()
  _createdById?: string;

  @Field(() => ID, { nullable: true })
  @Column({ nullable: true })
  @IsOptional()
  _updatedById?: string;
}

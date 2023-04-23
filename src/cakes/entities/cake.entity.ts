import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Base } from 'src/base/base.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'cakes' })
@ObjectType()
export class Cake extends Base {
  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.cakes, { nullable: true, lazy: true })
  @Index('user_id')
  user?: User;
}

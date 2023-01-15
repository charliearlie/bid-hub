import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { User } from './User';

@Entity()
@ObjectType()
export class UserReview {
  @Field(() => ID)
  @PrimaryKey()
  id!: number;

  @Field(() => User)
  @ManyToOne(() => User)
  reviewedUser: User;

  @Field(() => User)
  @ManyToOne(() => User)
  reviewer: User;

  @Field(() => String)
  @Property()
  feedback: String;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt? = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt? = new Date();
}

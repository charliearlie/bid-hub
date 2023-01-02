import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { User } from './User';

@ObjectType()
@Entity()
export class Address {
  @Field(() => ID)
  @PrimaryKey()
  id!: number;

  @Field(() => User)
  @ManyToOne(() => User)
  user: User;

  @Field(() => String)
  @Property()
  firstLine!: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  secondLine?: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  thirdLine?: string;

  @Field(() => String)
  @Property()
  cityOrTown: string;

  @Field()
  @Property()
  postCode: string; // We'll keep it UK focussed for now

  @Field(() => String)
  @Property()
  addressName: string;
}

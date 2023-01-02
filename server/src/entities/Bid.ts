import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { Item } from './Item';
import { User } from './User';

export enum BidStatus {
  WINNING = 'winning',
  LOSING = 'losing',
  PENDING = 'pending',
}

@Entity()
@ObjectType()
export class Bid {
  @Field(() => ID)
  @PrimaryKey()
  id!: number;

  @Field(() => Item)
  @ManyToOne({ entity: () => Item })
  item: Item;

  @Field(() => User)
  @ManyToOne()
  user!: User;

  @Field()
  @Property()
  amount: number;

  @Field(() => String)
  @Property({ default: BidStatus.PENDING, type: 'text' })
  status?: BidStatus;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt? = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt? = new Date();
}

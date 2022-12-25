import {
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { Bid } from './Bid';
import { Category } from './Category';
import { User } from './User';

export enum Condition {
  NEW = 'New',
  USED = 'Used',
  REFURBISHED = 'Refurbished',
  DAMAGED = 'Damaged',
}

@ObjectType()
@Entity()
@Unique({ properties: ['slug'] })
export class Item {
  @Field(() => ID)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  name!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  imageUrl?: string;

  @Field()
  @Property({ nullable: true })
  buyItNowPrice?: number;

  @Field({ nullable: true })
  @Property({ nullable: true })
  startingPrice?: number;

  @Field({ nullable: true })
  @Property({ nullable: true })
  winningBid?: number;

  @Field(() => String)
  @Property({ type: 'date', nullable: true })
  createdAt? = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt? = new Date();

  @Field(() => String)
  @Property()
  slug: string;

  @Field(() => String)
  @Property({ default: Condition.NEW, type: 'text' })
  condition: Condition;

  @Field(() => User)
  @ManyToOne()
  seller: User;

  @Field(() => [Category])
  @ManyToMany(() => Category)
  categories?: Category[];

  @Field(() => [Bid])
  @OneToMany(() => Bid, (bid) => bid.item)
  bids?: Bid[];
}

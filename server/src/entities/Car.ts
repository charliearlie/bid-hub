import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import formatPrice from '../utils/format-price';
import { Field, ID, ObjectType } from 'type-graphql';
import { Bid } from './Bid';
import { User } from './User';

export enum Condition {
  NEW = 'Factory delivered',
  USED = 'Used vehicle',
  DAMAGED = 'Parts only',
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

  @Field({ nullable: true })
  @Property({ nullable: true })
  buyItNowPrice?: number;

  @Field(() => String)
  formattedBuyItNowPrice() {
    return formatPrice(this.buyItNowPrice);
  }

  @Field({ nullable: true })
  @Property({ nullable: true })
  startingPrice?: number;

  @Field(() => String)
  formattedStartingPrice() {
    return formatPrice(this.startingPrice);
  }

  @Field({ nullable: true })
  @Property({ nullable: true })
  winningBid?: number;

  @Field(() => String)
  formattedWinningBid() {
    return formatPrice(this.winningBid);
  }

  @Field(() => Boolean)
  hasBiddingEnabled() {
    return !!this.startingPrice;
  }

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

  @Field(() => [Bid])
  @OneToMany(() => Bid, (bid) => bid.item)
  bids? = new Collection<Bid>(this);

  @Field(() => Number)
  bidCount() {
    if (this.bids?.isInitialized()) {
      return this.bids.count();
    }
    return 0;
  }
}

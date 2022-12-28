import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { Address } from './Address';
import { User } from './User';

enum PaymentType {
  AMEX = 'American Express',
  MASTERCARD = 'Mastercard',
  VISA = 'Visa',
}

@ObjectType()
@Entity()
export class Payment {
  @Field(() => ID)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property()
  cardName!: string;

  @Field(() => String)
  @Property()
  type: PaymentType;

  @Field(() => String)
  @Property()
  cardNumber: string; // Will be encrypted

  @Field(() => String)
  @Property()
  lastFourDigits: string;

  @Field(() => Address)
  @Property()
  billingAddress: Address;

  @Field({ nullable: true })
  @Property({ nullable: true })
  avatarUrl?: string;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt? = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt? = new Date();

  @Field(() => User)
  @ManyToOne(() => User)
  user: User;
}

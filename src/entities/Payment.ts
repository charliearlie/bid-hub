import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { Address } from './Address';
import { User } from './User';

export enum PaymentType {
  AMEX = 'American Express',
  MASTERCARD = 'Mastercard',
  VISA = 'Visa',
}

@ObjectType()
@Entity()
export class PaymentMethod {
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

  @Field(() => String)
  @Property()
  expiryDate: string;

  @Field(() => Address)
  @Property({ nullable: true })
  billingAddress?: Address;

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

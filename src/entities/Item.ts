import {
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { Category } from './Category';
import { User } from './User';

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
  @Property()
  price!: number;

  @Field(() => String)
  @Property({ type: 'date', nullable: true })
  createdAt? = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt? = new Date();

  @Field(() => String)
  @Property()
  slug: string;

  @Field(() => User)
  @ManyToOne()
  seller: User;

  @Field(() => [Category])
  @ManyToMany(() => Category)
  categories?: Category[];
}

import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Item {
  @Field(() => ID)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  title!: string;

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
  @Property({ defaultRaw: 'now' })
  createdAt?: Date = new Date();

  @Field(() => String)
  @Property({ defaultRaw: 'now', onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}

import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class Category {
  @Field(() => ID)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  title: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  description?: string;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt? = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt? = new Date();
}

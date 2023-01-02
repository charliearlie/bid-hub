import { Entity, Property } from '@mikro-orm/core';
import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@Entity()
@InputType()
class CategoryValidator {
  @Field()
  @IsString()
  @Property()
  title: string;

  @Field({ nullable: true })
  @IsString()
  @Property({ nullable: true })
  description?: string;
}

export default CategoryValidator;

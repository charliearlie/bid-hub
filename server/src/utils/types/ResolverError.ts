import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class ResolverError {
  @Field(() => String)
  field: string;

  @Field(() => String)
  message: string;
}

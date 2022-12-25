import { Field, ObjectType } from 'type-graphql';
import { ResolverError } from '../../utils';

@ObjectType()
export default class BidHubResponse {
  @Field(() => [ResolverError], { nullable: true })
  errors?: ResolverError[];

  @Field(() => Boolean)
  success: boolean;
}

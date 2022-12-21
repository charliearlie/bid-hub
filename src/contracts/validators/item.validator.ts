import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Condition } from '../../entities/Item';
import { Field, ID, InputType } from 'type-graphql';

@InputType()
class ItemValidator {
  @Field()
  @IsString()
  public name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public description: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public imageUrl: string;

  @Field()
  @IsNumber()
  public price: number;

  @Field()
  @IsString()
  public condition: Condition;

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @IsOptional()
  public categories: number[];
}

export default ItemValidator;

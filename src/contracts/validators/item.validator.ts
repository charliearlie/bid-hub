import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Condition } from '../../entities/Item';
import { Field, InputType } from 'type-graphql';
import { CategoryValidator as Category } from '../../contracts/validators/category.validator';

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
  public conditon: Condition;

  @Field(() => [Category])
  @IsArray()
  @IsObject({ each: true })
  public categories: Category[];
}

export default ItemValidator;

// We can find ways to use the same validator for both but currently we will do it with two separate
import { IsOptional, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
class EditUserValidator {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public username: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public email: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public firstName: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public lastName: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public password: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public avatarUrl: string;
}

export default EditUserValidator;

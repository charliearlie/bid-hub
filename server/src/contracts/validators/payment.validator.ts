import { IsNumberString, IsString, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { PaymentType } from '../../entities/Payment';

@InputType()
class PaymentMethodValidator {
  @Field()
  @IsString()
  public cardName: string;

  @Field()
  @IsString()
  public type: PaymentType;

  @Field()
  @IsNumberString()
  @Length(16, 16)
  public cardNumber: string;

  @Field()
  @IsString()
  @Length(5, 5)
  public expiryDate: string;
}

export default PaymentMethodValidator;

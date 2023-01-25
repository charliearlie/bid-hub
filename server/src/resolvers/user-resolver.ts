import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { MyContext } from 'types';
import UserValidator from '../contracts/validators/user.validator';
import { Address, PaymentMethod, User } from '../entities';
import { validateUserRegistration } from './helpers/validate-user';
import { sendEmail } from '../utils';
import {
  FORGOT_PASSWORD_PREFIX,
  MAGIC_LINK_PREFIX,
  SESSION_COOKIE,
} from '../constants';
import resetPasswordEmailTemplate from './helpers/email/reset-password-email';
import magicLinkEmailTemplate from './helpers/email/magic-link-email';
import BidHubResponse from './helpers/Response';
import PaymentMethodValidator from '../contracts/validators/payment.validator';
import EditUserValidator from '../contracts/validators/user/edit-user.validator';

@ObjectType()
class UserResponse extends BidHubResponse {
  @Field(() => User, { nullable: true })
  user?: User;
  @Field(() => String, { nullable: true })
  token?: string;
}

@Resolver()
class UserResolver {
  @Query(() => [User])
  async getUsers(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Query(() => UserResponse)
  async me(@Ctx() { em, req }: MyContext): Promise<UserResponse> {
    const id = req.session.userId;
    if (id) {
      return { user: await em.findOneOrFail(User, { id }), success: true };
    }

    return {
      errors: [
        {
          field: 'user',
          message: 'No user found',
        },
      ],
      success: false,
    };
  }

  @Mutation(() => UserResponse)
  async register(
    @Ctx() { em }: MyContext,
    @Arg('userInput') userInput: UserValidator
  ): Promise<UserResponse> {
    const validateUserResponse = validateUserRegistration(userInput);
    if (!validateUserResponse.success) {
      return { errors: validateUserResponse.errors, success: false };
    }

    const hashedPassword = await bcrypt.hash(userInput.password, 10);
    const newUser = em.create(User, {
      ...userInput,
      password: hashedPassword,
      active: 'true',
      feedbackScore: 0,
    });
    await em.persistAndFlush(newUser);

    const token = sign(
      { email: newUser.email, username: newUser.username, id: newUser.id },
      process.env.JWT_SECRET
    );

    return { user: newUser, success: true, token };
  }

  @Mutation(() => UserResponse)
  async login(
    @Ctx() { em, req, res }: MyContext,
    @Arg('emailOrUsername') emailOrUsername: string,
    @Arg('password') password: string
  ): Promise<UserResponse> {
    try {
      const user = await em.findOneOrFail(User, {
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
      });

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return {
          errors: [
            {
              field: 'email | password',
              message: 'Invalid email or password',
            },
          ],
          success: false,
        };
      }

      const token = sign(
        { email: user.email, username: user.username, id: user.id },
        process.env.JWT_SECRET
      );
      res.cookie('user', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });

      req.session.userId = user.id;

      return { user, success: true, token };
    } catch (error) {
      return {
        errors: [
          {
            field: 'email | password',
            message: 'Invalid email or password',
          },
        ],
        success: false,
      };
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    res.clearCookie('user');
    res.clearCookie(SESSION_COOKIE);
    return new Promise((resolve) => {
      req.session.destroy((error) => {
        if (error) {
          console.error(error);
        }
      });
      resolve(true);
    });
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Ctx() { em, redis }: MyContext,
    @Arg('email') email: string
  ): Promise<boolean> {
    const user = await em.findOneOrFail(User, { email });

    if (!user) {
      return false;
    }

    const token = uuidv4();
    await redis.set(FORGOT_PASSWORD_PREFIX + token, user.id, 'EX', 60 * 60);

    const html = resetPasswordEmailTemplate(token);
    await sendEmail(user.email, 'Reset your password', html);

    return true;
  }

  @Mutation(() => UserResponse)
  async resetPassword(
    @Ctx() { em, redis }: MyContext,
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string
  ): Promise<UserResponse> {
    const userId = await redis.get(FORGOT_PASSWORD_PREFIX + token);
    if (!userId) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Invalid token or token has expired',
          },
        ],
        success: false,
      };
    }

    const id = Number(userId);
    const user = await em.findOneOrFail(User, { id });

    if (!user) {
      return {
        errors: [
          {
            field: 'user',
            message: 'Token is no longer valid',
          },
        ],
        success: false,
      };
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await em.persistAndFlush(user);

    const tokenForCookie = sign(
      { email: user.email, username: user.username, id: user.id },
      process.env.JWT_SECRET
    );

    return { user, success: true, token: tokenForCookie };
  }

  @Mutation(() => UserResponse)
  async addAddress(
    @Ctx() { em, req }: MyContext,
    @Arg('addressLine1') addressLine1: string,
    @Arg('addressLine2') addressLine2: string,
    @Arg('city') city: string,
    @Arg('postCode') postCode: string
  ): Promise<UserResponse> {
    if (req.session.userId) {
      const user = await em.findOneOrFail(User, req.session.userId);
      if (user) {
        const newAddress = await em.create(Address, {
          addressName: 'Home',
          firstLine: addressLine1,
          secondLine: addressLine2,
          thirdLine: '',
          cityOrTown: city,
          postCode,
          user,
        });

        user.addresses = user.addresses
          ? [...user.addresses, newAddress]
          : undefined;
        await em.persistAndFlush(user);

        return { user, success: true };
      }

      return {
        errors: [
          {
            field: 'user',
            message: 'User not found',
          },
        ],
        success: false,
      };
    }

    return {
      errors: [
        {
          field: 'user',
          message: 'User not logged in',
        },
      ],
      success: false,
    };
  }

  @Mutation(() => Boolean)
  async emailMagiclink(
    @Ctx() { em, redis }: MyContext,
    @Arg('email') email: string
  ): Promise<boolean> {
    const user = await em.findOneOrFail(User, { email });

    if (!user) {
      return false;
    }

    const token = uuidv4();
    await redis.set(MAGIC_LINK_PREFIX + token, user.id, 'EX', 60 * 60);

    const html = magicLinkEmailTemplate(token);
    await sendEmail(user.email, 'Log in to Bid Hub', html);

    return true;
  }

  @Mutation(() => Boolean)
  async handleMagicEmailLogin(
    @Ctx() { em, req, res, redis }: MyContext,
    @Arg('loginToken') loginToken: string
  ): Promise<boolean> {
    const userId = await redis.get(MAGIC_LINK_PREFIX + loginToken);
    if (!userId) {
      return false;
    }

    const id = Number(userId);
    const user = await em.findOneOrFail(User, { id });

    if (!user) {
      return false;
    }

    req.session.userId = id;

    const token = sign(
      { email: user.email, username: user.username, id: user.id },
      process.env.JWT_SECRET
    );

    res.cookie('user', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    return true;
  }

  @Mutation(() => UserResponse)
  async addPaymentMethod(
    @Ctx() { em, req }: MyContext,
    @Arg('cardDetails') cardDetails: PaymentMethodValidator
  ): Promise<UserResponse> {
    if (req.session.userId) {
      const { cardName, cardNumber, expiryDate, type } = cardDetails;
      const user = await em.findOneOrFail(User, req.session.userId);
      if (user) {
        const hashedCardNumber = await bcrypt.hash(cardNumber, 10);
        const lastFourDigits = cardNumber.slice(-4);

        const newPaymentMethod = await em.create(PaymentMethod, {
          cardNumber: hashedCardNumber,
          lastFourDigits,
          cardName: cardName || '',
          type,
          expiryDate,
          user,
        });

        user.paymentCards = user.paymentCards
          ? [...user.paymentCards, newPaymentMethod]
          : undefined;
        await em.persistAndFlush(user);

        return { user, success: true };
      }

      return {
        errors: [
          {
            field: 'user',
            message: 'User not found',
          },
        ],
        success: false,
      };
    }

    return {
      errors: [
        {
          field: 'user',
          message: 'User not logged in',
        },
      ],
      success: false,
    };
  }

  @Mutation(() => UserResponse)
  async editUser(
    @Ctx() { em, req }: MyContext,
    @Arg('editedUserDetails') editedUserDetails: EditUserValidator
  ): Promise<UserResponse> {
    try {
      const { avatarUrl, firstName, lastName, password } = editedUserDetails;

      const user = await em.findOneOrFail(User, req.session.userId);
      user.password = password || user.password;
      user.avatarUrl = avatarUrl || user.avatarUrl;
      user.firstName = firstName || user.firstName;

      await em.persistAndFlush(user);

      const updatedUser = await em.findOne(User, req.session.userId);

      return { user: updatedUser || user, success: true };
    } catch (error: unknown) {
      console.log(error);
      return {
        errors: [
          {
            field: 'user',
            message: 'Something went wrong',
          },
        ],
        success: false,
      };
    }
  }
}

export default UserResolver;

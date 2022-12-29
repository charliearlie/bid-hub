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
import { MyContext } from 'types';
import UserValidator from '../contracts/validators/user.validator';
import { User } from '../entities/User';
import { Address } from '../entities/Address';
import { sendEmail } from '../utils';
import { validateUserRegistration } from './helpers/validate-user';
import { v4 as uuidv4 } from 'uuid';
import {
  FORGOT_PASSWORD_PREFIX,
  MAGIC_LINK_PREFIX,
  SESSION_COOKIE,
} from '../constants';
import resetPasswordEmailTemplate from './helpers/email/reset-password-email';
import magicLinkEmailTemplate from './helpers/email/magic-link-email';
import BidHubResponse from './helpers/Response';

@ObjectType()
class UserResponse extends BidHubResponse {
  @Field(() => User, { nullable: true })
  user?: User;
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
    @Ctx() { em, req, res }: MyContext,
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
    });
    await em.persistAndFlush(newUser);

    console.log({ newUser });

    const token = sign(
      { email: newUser.email, username: newUser.username, id: newUser.id },
      process.env.JWT_SECRET
    );
    res.cookie('user', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    req.session.userId = newUser.id;

    return { user: newUser, success: true };
  }

  @Mutation(() => UserResponse)
  async login(
    @Ctx() { em, req, res }: MyContext,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<UserResponse> {
    // TODO: Email log in for now but we will change to have both username and email
    const user = await em.findOneOrFail(User, { email });

    if (!user) {
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

    return { user, success: true };
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
    @Ctx() { em, redis, req }: MyContext,
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
    req.session.userId = user.id;

    return { user, success: true };
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
}

export default UserResolver;

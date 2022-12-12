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
import { ResolverError } from '../utils';
import { validateUserRegistration } from './helpers/validate-user';

@ObjectType()
class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [ResolverError], { nullable: true })
  errors?: ResolverError[];
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async getUsers(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Query(() => UserResponse)
  async me(@Ctx() { em, req }: MyContext): Promise<UserResponse> {
    const id = req.session.userId;
    if (id) {
      return { user: await em.findOneOrFail(User, { id }) };
    }

    return {
      errors: [
        {
          field: 'user',
          message: 'No user found',
        },
      ],
    };
  }

  @Mutation(() => UserResponse)
  async register(
    @Ctx() { em, req, res }: MyContext,
    @Arg('userInput') userInput: UserValidator
  ): Promise<UserResponse> {
    const validateUserResponse = validateUserRegistration(userInput);
    if (!validateUserResponse.success) {
      return { errors: validateUserResponse.errors };
    }

    const hashedPassword = await bcrypt.hash(userInput.password, 10);

    const newUser = em.create(User, {
      ...userInput,
      password: hashedPassword,
    });
    em.persistAndFlush(newUser);

    const token = sign(
      { email: newUser.email, username: newUser.username, id: newUser.id },
      process.env.JWT_SECRET
    );
    res.setHeader(
      'Set-Cookie',
      `user=${token}; HttpOnly; Max-Age=${1000 * 60 * 60 * 24 * 7}`
    );
    req.session.userId = newUser.id;

    return { user: newUser };
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
      };
    }

    const token = sign(
      { email: user.email, username: user.username, id: user.id },
      process.env.JWT_SECRET
    );
    res.setHeader(
      'Set-Cookie',
      `user=${token}; HttpOnly; Max-Age=${1000 * 60 * 60 * 24 * 7}`
    );

    console.log('user', user);

    req.session.userId = user.id;

    return { user };
  }
}

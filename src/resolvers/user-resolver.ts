import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { MyContext } from 'types';
import UserValidator from '../contracts/validators/user.validator';
import { User } from '../entities/User';

type ResolverError = {
  field: string;
  message: string;
};

type ValidateUserOutput = {
  success: boolean;
  errors: ResolverError[];
};

const validateUserInput = (userInput: Partial<User>): ValidateUserOutput => {
  const errors: ResolverError[] = [];
  const { email, password, username } = userInput;
  if (!username || username.length < 2) {
    errors.push({
      field: 'username',
      message: 'Username must be at least 2 characters long',
    });
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push({
      field: 'email',
      message: 'Not a valid email address',
    });
  }

  if (!password || password.length < 6) {
    errors.push({
      field: 'password',
      message: 'Passwords must be at least 6 characters long',
    });
  }

  return {
    success: errors.length === 0,
    errors: errors,
  };
};

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async getUsers(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Mutation(() => User)
  async register(
    @Ctx() { em, req, res }: MyContext,
    @Arg('userInput') userInput: UserValidator
  ): Promise<User | ResolverError[]> {
    const validateUserResponse = validateUserInput(userInput);
    if (!validateUserResponse.success) {
      return validateUserResponse.errors;
    }

    const hashedPassword = await bcrypt.hash(userInput.password, 10);

    const newUser = em.create(User, {
      ...userInput,
      password: hashedPassword,
    });
    em.persistAndFlush(newUser);

    const token = sign({ newUser }, process.env.JWT_SECRET);
    res.setHeader(
      'Set-Cookie',
      `user=${token}; HttpOnly; Max-Age=${1000 * 60 * 60 * 24 * 7}`
    );
    req.session.userId = newUser.id;

    return newUser;
  }
}

import { User } from 'src/entities/User';
import { ResolverError } from 'src/utils';

type ValidateUserOutput = {
  success: boolean;
  errors: ResolverError[];
};

export const validateUserRegistration = (
  userInput: Partial<User>
): ValidateUserOutput => {
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

// app/utils/user.server.ts
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { json } from "@remix-run/node";

import { prisma } from "./prisma.server";
import type {
  EditUserForm,
  LoginForm,
  RegisterForm,
  RegisterResponse,
} from "~/util/types";
import { createUserSession } from "~/services/session.server";
import sendEmail from "~/services/email.server";

import resetPasswordEmailTemplate from "~/util/helpers/email/reset-password-email";
import magicLinkEmailTemplate from "~/util/helpers/email/magic-link-email";

// Important note: these functions are mapped one to one to their old mutations/queries
// I can better structure them soon - such as magic link and forgot password sharing lots of code

export const register = async (user: RegisterForm) => {
  const exists = await prisma.user.count({ where: { email: user.email } });
  if (exists) {
    return json<RegisterResponse>({
      success: false,
      errors: { server: `User already exists with that email` },
    });
  }

  const newUser = await createUser(user);

  if (!newUser) {
    return json<RegisterResponse>({
      success: false,
      errors: { server: `Something went wrong trying to create a new user.` },
    });
  }

  return createUserSession(newUser.id);
};

export const login = async (
  { email, password }: LoginForm,
  redirectTo?: string
) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return json({ error: `Incorrect login`, success: false }, { status: 400 });

  return createUserSession(user.id, redirectTo);
};

export const forgotPassword = async (email: string) => {
  const exists = await prisma.user.count({ where: { email } });
  if (!exists) {
    return json({ error: `No user with that email exists`, success: false });
  }

  const token = uuidv4();
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + 1);
  await prisma.forgotPassword.create({
    data: {
      email,
      token,
      expiration,
    },
  });

  const html = resetPasswordEmailTemplate(token);
  await sendEmail(email, "Reset your password", html);

  return json({ success: true, error: null });
};

export const resetPassword = async (password: string, token: string) => {
  const forgotPassword = await prisma.forgotPassword.findUnique({
    where: {
      token,
    },
  });

  if (!forgotPassword || forgotPassword.expiration < new Date()) {
    return json({ success: false, errors: ["Token is invalid"] });
  }

  const updatedUser = await prisma.user.update({
    where: {
      email: forgotPassword.email,
    },
    data: {
      password: await bcrypt.hash(password, 10),
    },
  });
  await prisma.forgotPassword.delete({
    where: {
      token,
    },
  });

  return createUserSession(updatedUser.id);
};

export const generateMagicLink = async (email: string) => {
  const exists = await prisma.user.count({ where: { email } });
  if (!exists) {
    return json(
      { error: `No user with that email exists`, success: false },
      { status: 400 }
    );
  }

  const token = uuidv4();
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + 1);
  await prisma.magicLogin.create({
    data: {
      email,
      token,
      expiration,
    },
  });

  const html = magicLinkEmailTemplate(token);
  const emailData = await sendEmail(email, "Here's your login link", html);

  return json({ success: !!emailData.id, error: "" });
};

export const handleMagicLinkLogin = async (token: string) => {
  const userLogin = await prisma.magicLogin.findUnique({ where: { token } });
  if (userLogin) {
    const user = await prisma.user.findUnique({
      where: { email: userLogin.email },
    });

    await prisma.magicLogin.delete({
      where: {
        token,
      },
    });

    // Non-null expression as a user with the magicLogin email has to exist for a magicLogin to be created
    return createUserSession(user!.id!);
  }

  return json({ error: "Token not found" });
};

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      username: user.username,
    },
  });
  return { id: newUser.id, email: newUser.email };
};

export const editUser = async (userId: string, edited: EditUserForm) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl: edited.avatarUrl,
        personalDetails: {
          upsert: {
            update: {
              firstName: edited.firstName || "",
              lastName: edited.lastName || "",
            },
            set: {
              firstName: edited.firstName || "",
              lastName: edited.lastName || "",
            },
          },
        },
      },
    });
    return json({ error: null, updatedUser });
  } catch (e) {
    return json({ updatedUser: null, error: "Couldn't update lad" });
  }
};

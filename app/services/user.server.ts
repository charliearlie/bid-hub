import { ForgotPassword } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { json } from "@remix-run/node";

import { prisma } from "./prisma.server";
import type { EditUserForm, LoginForm, RegisterForm } from "~/util/types";
import { createUserSession, getUserId } from "~/services/session.server";
import sendEmail from "~/services/email.server";

import resetPasswordEmailTemplate from "~/util/helpers/email/reset-password-email";
import magicLinkEmailTemplate from "~/util/helpers/email/magic-link-email";

export const checkAvailability = async (email: string, username: string) => {
  const emailUsages = await prisma.user.count({ where: { email } });
  const usernameUsages = await prisma.user.count({ where: { username } });

  const isEmailAvailable = emailUsages === 0;
  const isUsernameAvailable = usernameUsages === 0;

  // This will stink if the number of properties grows, but okay for now
  return {
    available: isEmailAvailable && isUsernameAvailable,
    properties: { email: isEmailAvailable, username: isUsernameAvailable },
  };
};

export const login = async ({ emailOrUsername, password }: LoginForm) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: emailOrUsername }, { username: emailOrUsername }] },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) return null;

  return user;
};

/**
 *
 * @param email
 * @returns null if email fails to send, otherwise returns a json response
 */
export const forgotPassword = async (
  email: string
): Promise<{ error: string | null; success: boolean }> => {
  const exists = await prisma.user.count({ where: { email } });
  if (!exists) {
    return { error: `No user with that email exists`, success: false };
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

  return { error: null, success: true };
};

export const getUserResetTokenData = async (token: string) => {
  return await prisma.forgotPassword.findUnique({
    where: {
      token,
    },
  });
};

export const isTokenValid = async (token: string, expiration: Date) => {
  if (!token || expiration < new Date()) {
    return false;
  }
  return true;
};

export const resetForgottenPassword = async (
  { email, token }: ForgotPassword,
  password: string
) => {
  const updatedUser = await prisma.user.update({
    where: {
      email: email,
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

export const generateMagicLink = async (usernameOrEmail: string) => {
  const user = await getUserByUsernameOrEmail(usernameOrEmail);
  if (!user) {
    return null;
  }

  const { email } = user;

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

  return { success: !!emailData.id, error: "", email };
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

export async function getUserByUsernameOrEmail(usernameOrEmail: string) {
  return await prisma.user.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    },
  });
}

// This has a request param. Does it belong in this file? I'm doubting it
export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

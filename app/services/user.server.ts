import type { ForgotPassword } from "@prisma/client";
import { json } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import type { z } from "zod";

import sendEmail from "~/services/email.server";
import { createUserSession, getUserId } from "~/services/session.server";

import type { LoginForm, RegisterForm } from "~/types";

import magicLinkEmailTemplate from "~/util/helpers/email/magic-link-email";
import resetPasswordEmailTemplate from "~/util/helpers/email/reset-password-email";

import { prisma } from "../util/prisma.server";
import type {
  AddressFieldsetSchema,
  PersonalDetailsFieldsetSchema,
} from "./zod-schemas";

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
      personalDetails: {
        create: {
          firstName: "",
          lastName: "",
        },
      },
    },
  });
  return { id: newUser.id, email: newUser.email };
};

export async function updateUserAvatar(avatarUrl: string, userId: string) {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      avatarUrl,
    },
  });
}

export async function updateUserAddresses(
  addresses: z.infer<typeof AddressFieldsetSchema>[],
  userId: string
) {
  // Would rather use upsert here but it's behaving weird
  const updatedAddresses = await Promise.all(
    addresses.map(async (address) => {
      const { addressLine1, addressLine2, cityOrTown, id, name, postcode } =
        address;

      if (id) {
        const updatedAddress = await prisma.address.update({
          where: { id: address.id },
          data: address,
        });

        return updatedAddress;
      } else {
        const createdAddress = await prisma.address.create({
          data: {
            addressLine1,
            addressLine2,
            cityOrTown,
            name,
            postcode,
            user: { connect: { id: userId } },
          },
        });

        return createdAddress;
      }
    })
  );

  return updatedAddresses;
}

export async function updateUserPersonalDetails(
  personalDetails: z.infer<typeof PersonalDetailsFieldsetSchema>,
  userId: string
) {
  const updatedPersonalDetails = await prisma.userPersonalDetails.update({
    where: {
      userId,
    },
    data: personalDetails,
  });

  return updatedPersonalDetails;
}

export async function getUserByUsernameOrEmail(usernameOrEmail: string) {
  return await prisma.user.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    },
    include: {
      feedbackReceived: {
        select: {
          rating: true,
          comment: true,
          createdAt: true,
          buyer: {
            select: {
              avatarUrl: true,
              username: true,
            },
          },
          listing: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      },
    },
  });
}

export async function getUserById(userId: string) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
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
    include: {
      personalDetails: true,
      addresses: true,
    },
  });
}

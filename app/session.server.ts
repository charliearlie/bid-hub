import { createCookieSessionStorage, Headers, redirect } from "@remix-run/node";
import { prisma } from "./services/prisma.server";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";

export async function createUserSession(
  userId: string,
  redirectTo: string = "/"
) {
  const session = await sessionStorage.getSession();
  session.set(USER_SESSION_KEY, userId);

  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    await sessionStorage.commitSession(session, {
      maxAge: 60 * 60 * 24 * 7, // 7 days,
    })
  );

  return redirect(redirectTo, {
    headers,
  });
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export function getUserSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true },
    });
    console.log("we have a user", user);
    return user;
  } catch {
    console.log("in dee catch of get user");
    throw logout(request);
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

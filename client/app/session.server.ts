import { createCookieSessionStorage, Headers, redirect } from "@remix-run/node";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["elaerilthbblaesaaseeizlire"],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";

export async function createUserSession({
  request,
  userId,
  jwt,
}: {
  request: Request;
  userId: string;
  jwt?: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);

  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    await sessionStorage.commitSession(session, {
      maxAge: 60 * 60 * 24 * 7, // 7 days,
    })
  );

  if (jwt) {
    headers.append("Set-Cookie", `jwt=${jwt}`);
  }

  return redirect("/", {
    headers,
  });
}

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserIdFromSession(request: Request) {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);

  return userId;
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

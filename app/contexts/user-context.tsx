import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ReactNode} from "react";
import { createContext, useContext } from "react";

import { getUser } from "~/services/session.server";
import { useLoaderData } from "@remix-run/react";

type UserContextType = {
  userId: number | null;
};

type UserProviderProps = {
  children: ReactNode;
};

const UserContext = createContext<UserContextType | null>(null);

// Maybe we'll consider calling the me query and get the users username, email, etc.
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) {
    return json<string>(user.id);
  }
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const userId = useLoaderData();

  return (
    <UserContext.Provider value={{ userId }}>{children}</UserContext.Provider>
  );
};

export const useUserId = (): number | null => {
  const { userId } = useContext(UserContext) as UserContextType;
  return userId;
};

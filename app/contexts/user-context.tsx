import type { DataFunctionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import { getUser } from "~/services/user.server";
import { useLoaderData } from "@remix-run/react";

type UserContextType = {
  userId: string | null;
};

type UserProviderProps = {
  children: ReactNode;
};

const UserContext = createContext<UserContextType | null>(null);

export const loader = async ({ request }: DataFunctionArgs) => {
  const user = await getUser(request);
  if (user) {
    return json(user.id);
  }
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const userId = useLoaderData<typeof loader>();

  return (
    <UserContext.Provider value={{ userId }}>{children}</UserContext.Provider>
  );
};

export const useUserId = () => {
  const { userId } = useContext(UserContext) as UserContextType;
  return userId;
};

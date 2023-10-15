import type { LoaderArgs } from "@remix-run/node";
import { logout } from "~/services/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  return await logout(request);
};

export default function LogoutRoute() {
  return <h1>Logging you out</h1>;
}

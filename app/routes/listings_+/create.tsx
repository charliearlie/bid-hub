import { type DataFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireUserId } from "~/services/session.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  await requireUserId(request);

  return json({ loggedIn: true });
};

export default function AddListingRoute() {
  return (
    <main className="container mx-auto max-w-3xl p-4">
      <h1 className="flex justify-center p-4 text-4xl font-bold">
        Sell your item on Bidhub
      </h1>
      <div>
        <Outlet />
      </div>
    </main>
  );
}

import { Outlet } from "@remix-run/react";

export default function ItemsRoute() {
  return (
    <div>
      <h1>Items</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

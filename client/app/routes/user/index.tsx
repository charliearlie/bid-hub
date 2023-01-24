import { Outlet } from "@remix-run/react";

export default function UserRoute() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

import { Outlet } from "@remix-run/react";

export default function LoginRoute() {
  return (
    <div>
      <h2 className="pt-4 pb-4 text-center text-3xl font-bold">
        Log in to Brake Neck
      </h2>
      <Outlet />
    </div>
  );
}

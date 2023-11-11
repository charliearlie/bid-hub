import { Outlet } from "@remix-run/react";

export default function UserRoute() {
  return (
    <div>
      <main className="container mx-auto max-w-3xl p-4">
        <h1 className="flex justify-center p-4">Edit user details</h1>
        <Outlet />
      </main>
    </div>
  );
}

import { Outlet } from "@remix-run/react";

export default function AuthRoute() {
  return (
    <main className="flex h-screen flex-col flex-wrap content-center justify-center gap-4 bg-gray-800 sm:bg-gray-700">
      <h1 className="hidden p-2 text-2xl font-bold md:block">
        Access Brake Neck to purchase the greatest cars on the planet (this is
        just here to demo nested routing)
      </h1>
      <div className="mb-4 w-full max-w-md self-center px-8 pt-6 pb-10 sm:border-2 sm:border-solid sm:border-gray-700 sm:bg-gray-800">
        <Outlet />
      </div>
    </main>
  );
}

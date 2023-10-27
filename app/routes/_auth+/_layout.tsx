import { Outlet } from "@remix-run/react";

export default function AuthRoute() {
  return (
    <main className="flex h-[calc(100vh-84px)] flex-col flex-wrap content-center justify-center gap-4 bg-accent dark:bg-background">
      <div className="mb-4 w-full max-w-md self-center bg-card px-8 pt-6 pb-10 text-card-foreground shadow-sm sm:rounded-md sm:border sm:border-solid sm:border-accent">
        <Outlet />
      </div>
    </main>
  );
}

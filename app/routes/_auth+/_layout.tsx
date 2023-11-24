import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { HoneypotProvider } from "remix-utils/honeypot/react";

import { honeypot } from "~/util/honeypot.server";

export const loader = async () => {
  return json({ honeypotProps: honeypot.getInputProps() });
};

export default function AuthRoute() {
  const { honeypotProps } = useLoaderData<typeof loader>();

  return (
    <main className="flex h-[calc(100vh-84px)] flex-col flex-wrap content-center justify-center gap-4 bg-accent dark:bg-background">
      <div className="mb-4 w-full max-w-md self-center bg-card px-8 pt-6 pb-10 text-card-foreground shadow-sm sm:rounded-md sm:border sm:border-solid sm:border-accent">
        <HoneypotProvider {...honeypotProps}>
          <Outlet />
        </HoneypotProvider>
      </div>
    </main>
  );
}

import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { HoneypotProvider } from "remix-utils/honeypot/react";

import { Card } from "~/components/common/ui/card/card";
import CardContent from "~/components/common/ui/card/card-content";
import { Separator } from "~/components/common/ui/separator";
import { TabNavLink } from "~/components/navigation/tab-nav-link";

import { honeypot } from "~/util/honeypot.server";

export const loader = async () => {
  return json({ honeypotProps: honeypot.getInputProps() });
};

export default function LoginRegisterRoute() {
  const { honeypotProps } = useLoaderData<typeof loader>();
  return (
    <main className="-mt-8 flex h-[calc(100vh-84px)] flex-col flex-wrap content-center justify-center gap-4 bg-accent pt-16 dark:bg-background sm:mt-0 sm:pt-0">
      <HoneypotProvider {...honeypotProps}>
        <div className="w-full max-w-md px-2 sm:px-0">
          <Card className="min-h-[480px] border-none shadow-none sm:border sm:border-solid sm:shadow-sm">
            <div className="grid grid-cols-2 items-center rounded-md border sm:border-none">
              <TabNavLink to="/login" className="text-center font-semibold">
                Log in
              </TabNavLink>
              <TabNavLink to="/register" className="text-center font-semibold">
                Sign up
              </TabNavLink>
            </div>
            <Separator className="hidden sm:block" />
            <CardContent className="p-8">
              <Outlet />
            </CardContent>
          </Card>
        </div>
      </HoneypotProvider>
    </main>
  );
}

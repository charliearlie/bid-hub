import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { AlertOctagon } from "lucide-react";
import styles from "~/styles/app.css";
import fontStylesheet from "~/styles/font.css";

import "./styles/app.css";
import { ErrorBoundaryComponent } from "~/components/error-boundary";
import { SharedHeader } from "~/components/header/shared-header";

import { logout } from "~/services/session.server";
import { getUser } from "~/services/user.server";

import { getEnv } from "~/util/env.server";

import { UserProvider } from "./contexts/user-context";

export const meta: MetaFunction = () => {
  return [
    { title: "Bidhub" },
    {
      name: "description",
      content: "A marketplace for buying and selling items",
    },
  ];
};

export function links() {
  return [
    { rel: "stylesheet", href: fontStylesheet },
    {
      rel: "icon",
      href: "https://fav.farm/👨🏻‍⚖️",
    },
  ];
}

export const action = async ({ request }: ActionFunctionArgs) => {
  return await logout(request);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  return json({ user, ENV: getEnv() });
};

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charSet="utf-8" />
        <Links />
      </head>
      <body className="bg-accent text-foreground dark:bg-background">
        {children}
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { ENV, user } = useLoaderData<typeof loader>();
  return (
    <Document>
      <div className="flex gap-2 p-4">
        <AlertOctagon /> Listing data is auto generated so will not match the
        images, categories and description shown
      </div>
      <UserProvider username={user?.username} userId={user?.id}>
        <SharedHeader user={user} />
        <Outlet />
      </UserProvider>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(ENV)}`,
        }}
      />
    </Document>
  );
}

export function ErrorBoundary() {
  return (
    <Document>
      <div className="flex-1">
        <ErrorBoundaryComponent />
      </div>
    </Document>
  );
}

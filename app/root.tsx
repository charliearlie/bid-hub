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

import { ErrorBoundaryComponent } from "./components/error-boundary";
import { SharedHeader } from "./components/header/shared-header";
import { logout } from "./services/session.server";
import { getUser } from "./services/user.server";
import styles from "./styles/app.css";
import { getEnv } from "./util/env.server";

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
    { rel: "stylesheet", href: styles },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap",
    },
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
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  const { ENV, user } = useLoaderData<typeof loader>();
  return (
    <Document>
      <SharedHeader user={user} />
      <Outlet />
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

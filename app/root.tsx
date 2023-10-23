import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
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

import SharedHeader from "./components/header/shared-header";
import { getUser, logout } from "./services/session.server";
import styles from "./styles/app.css";
import favicon from "./assets/img/favicon.svg";
import { getEnv } from "./util/env.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Brake Neck" },
    {
      name: "description",
      content: "A website to browse and bid on rare luxurious cars",
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
  ];
}

export const action = async ({ request }: ActionFunctionArgs) => {
  return await logout(request);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ user: await getUser(request), ENV: getEnv() });
};

export default function App() {
  // todo: Put user in a context
  const { ENV, user } = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <Meta />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="icon" type="image/svg+xml" href={favicon} />
        <Links />
      </head>
      <body className="bg-gray-700 text-gray-300">
        <SharedHeader user={user} />
        <Outlet />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

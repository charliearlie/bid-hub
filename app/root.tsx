import {
  ActionArgs,
  json,
  LoaderArgs,
  MetaFunction,
  redirect,
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
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import SharedHeader from "./components/header/shared-header";
import { getUser, logout } from "./services/session.server";
import styles from "./styles/app.css";

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

export const action = async ({ request }: ActionArgs) => {
  return await logout(request);
};

export const loader = async ({ request }: LoaderArgs) => {
  return typedjson({ user: await getUser(request), ENV: process.env });
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Brake Neck - Cars at break neck speed",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const { ENV, user } = useTypedLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-700 text-gray-300">
        <SharedHeader user={user} />
        <Outlet />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.process = ${JSON.stringify({
              env: ENV,
            })}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

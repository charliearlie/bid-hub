import { parseWithZod } from "@conform-to/zod";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
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
  useLocation,
} from "@remix-run/react";
import { AlertOctagon } from "lucide-react";
import { z } from "zod";
import styles from "~/styles/app.css";
import fontStylesheet from "~/styles/font.css";

import { ErrorBoundaryComponent } from "~/components/error-boundary";
import { SharedHeader } from "~/components/header/shared-header";

import { logout } from "~/services/session.server";
import { getUser } from "~/services/user.server";

import { getEnv } from "~/util/env.server";

import { UserProvider } from "./contexts/user-context";
import { getHomepageCategories } from "./services/category.server";

const SearchSchema = z.object({
  intent: z.string(),
  search: z.string({
    required_error: "Search is required",
  }),
});

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
    { rel: "stylesheet", href: fontStylesheet },
    {
      rel: "icon",
      href: "https://fav.farm/👨🏻‍⚖️",
    },
  ];
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: SearchSchema });

  if (submission.status !== "success") {
    return json(submission.reply(), {
      status: submission.status === "error" ? 400 : 200,
    });
  }

  const { intent, search } = submission.value;

  if (intent === "search" && submission.value.search) {
    return redirect(`/search?query=${search}`);
  } else if (intent === "logout") {
    return await logout(request);
  }

  return null;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  console.log("DATABASE_URL", process.env.DATABASE_URL);
  const categories = await getHomepageCategories();
  return json({ user, categories, ENV: getEnv() });
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
  const { ENV, user, categories } = useLoaderData<typeof loader>();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <Document>
      <div className="flex gap-2 p-4">
        <AlertOctagon /> Listing data is auto generated so will not match the
        images, categories and description shown
      </div>
      <UserProvider username={user?.username} userId={user?.id}>
        <SharedHeader
          user={user}
          isHomepage={isHomePage}
          categories={categories}
        />
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

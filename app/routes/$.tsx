import { Link, useLocation } from "@remix-run/react";

import { ErrorBoundaryComponent } from "~/components/error-boundary";

export async function loader() {
  throw new Response("Not found", { status: 404 });
}

export default function NotFound() {
  return <ErrorBoundary />;
}

export function ErrorBoundary() {
  const location = useLocation();
  return (
    <ErrorBoundaryComponent
      statusHandlers={{
        404: () => (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-bold">
                It seems you have taken a wrong turn
              </h1>
              <pre className="text-body-lg whitespace-pre-wrap break-all">
                {location.pathname} does not exist
              </pre>
            </div>
            <Link to="/" className="text-body-md underline">
              Go back home
            </Link>
          </div>
        ),
      }}
    />
  );
}

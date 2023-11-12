import { DataFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getUserId } from "~/services/session.server";
import { getUserByUsernameOrEmail } from "~/services/user.server";

import { Button } from "~/components/common/ui/button";
import Card from "~/components/common/ui/card/card";
import CardContent from "~/components/common/ui/card/card-content";
import { ErrorBoundaryComponent } from "~/components/error-boundary";

import { invariantResponse } from "~/util/utils";

export const loader = async ({ params, request }: DataFunctionArgs) => {
  invariantResponse(params.username, "No username provided");

  const user = await getUserByUsernameOrEmail(params.username);
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  const loggedInUserId = await getUserId(request);

  const canEdit = loggedInUserId === user.id;

  const { username, role, avatarUrl, createdAt } = user;

  return json({ avatarUrl, username, role, createdAt, canEdit } as const);
};

export default function UserProfileRoute() {
  const { avatarUrl, username, role, createdAt, canEdit } =
    useLoaderData<typeof loader>();
  return (
    <main className="container mx-auto max-w-5xl p-4">
      <Card>
        <CardContent>
          <div className="flex gap-8">
            <img
              className="h-48 w-48 rounded-lg border-2 border-border"
              src={avatarUrl || "https://picsum.photos/200"}
            />
            <div className="flex flex-col gap-2">
              <h1>{username}</h1>
              <p>Role: {role}</p>
              <p>Joined: {new Date(createdAt).toLocaleDateString()}</p>
              {canEdit && (
                <Button asChild variant="outline">
                  <Link to="/user/manage">Edit your profile</Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export function ErrorBoundary() {
  return (
    <ErrorBoundaryComponent
      statusHandlers={{
        404: ({ params }) => (
          <div className="p-4">
            <h2 className="text-3xl font-semibold">
              No user found with username {params.username}
            </h2>
            <Link to="/">Go back home</Link>
          </div>
        ),
      }}
    />
  );
}

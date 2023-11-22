import { DataFunctionArgs, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { RatingStars } from "~/components/common/star-rating/star-rating";
import { Button } from "~/components/common/ui/button";
import Card from "~/components/common/ui/card/card";
import CardContent from "~/components/common/ui/card/card-content";
import { Separator } from "~/components/common/ui/separator";
import { ErrorBoundaryComponent } from "~/components/error-boundary";
import { TabNavLink } from "~/components/navigation/tab-nav-link";

import { getUserId } from "~/services/session.server";
import { getUserByUsernameOrEmail } from "~/services/user.server";

import { invariantResponse } from "~/util/utils";

export const loader = async ({ params, request }: DataFunctionArgs) => {
  invariantResponse(params.username, "No username provided");

  const user = await getUserByUsernameOrEmail(params.username);
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  const loggedInUserId = await getUserId(request);

  const isLoggedInUser = loggedInUserId === user.id;

  const {
    username,
    role,
    avatarUrl,
    createdAt,
    feedbackScore,
    feedbackReceived,
  } = user;

  return json({
    avatarUrl,
    username,
    role,
    createdAt,
    isLoggedInUser,
    feedbackScore,
    feedbackReceived,
  } as const);
};

export default function UserProfileRoute() {
  const {
    avatarUrl,
    username,
    role,
    createdAt,
    isLoggedInUser,
    feedbackScore,
  } = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto max-w-5xl p-4">
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex gap-8">
              <img
                className="h-48 w-48 rounded-lg border-2 border-border"
                src={avatarUrl || "https://picsum.photos/200"}
              />
              <div className="flex flex-col gap-2">
                <h1>{username}</h1>
                <RatingStars rating={feedbackScore} />
                <p>Role: {role}</p>
                <p>Joined: {new Date(createdAt).toLocaleDateString()}</p>
                {isLoggedInUser && (
                  <Button asChild variant="secondary">
                    <Link to="/user/manage">Edit your profile</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Card>
              <div className="grid grid-cols-3">
                <TabNavLink to="./details">Details</TabNavLink>
                <TabNavLink to={`./reviews`}>Reviews</TabNavLink>
                <TabNavLink to={`./listings`}>Listings</TabNavLink>
              </div>
              <Separator />
              <div className="px-4">
                <Outlet />
              </div>
            </Card>
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

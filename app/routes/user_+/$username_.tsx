import type { DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";

import { RatingStars } from "~/components/common/star-rating/star-rating";
import { Button } from "~/components/common/ui/button";
import { Card } from "~/components/common/ui/card/card";
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
            <div className="flex w-full flex-col gap-8 sm:flex-row">
              <img
                className="rounded-lg border-2 border-border sm:h-48 sm:w-48"
                alt="user avatar"
                src={avatarUrl || "https://picsum.photos/200"}
              />
              <div className="flex w-full flex-col gap-2">
                <h1>{username}</h1>
                <RatingStars rating={feedbackScore} />
                <p>Role: {role}</p>
                <p>Member since: {format(new Date(createdAt), "MMMM yyyy")}</p>
                {isLoggedInUser && (
                  <Button asChild variant="secondary">
                    <Link to={`/user/manage`}>Edit your profile</Link>
                  </Button>
                )}
                {!isLoggedInUser && (
                  <div className="flex items-center gap-2 sm:justify-between">
                    <Button asChild variant="default">
                      <Link to="/user/messages">Send a message</Link>
                    </Button>
                    <Button asChild variant="destructive">
                      <Link to={`/user/${username}/report`}>Report</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div>
              <div className="grid grid-cols-2 overflow-hidden rounded-t-lg">
                <TabNavLink to="./reviews">Reviews</TabNavLink>
                <TabNavLink to="./listings">Listings</TabNavLink>
              </div>
              <Separator />
              <div>
                <Outlet />
              </div>
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

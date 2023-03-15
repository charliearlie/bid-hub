import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { handleMagicLinkLogin } from "~/services/user.server";
import invariant from "tiny-invariant";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ params, request }: LoaderArgs) => {
  if (request.headers.get("user-agent")?.includes("WhatsApp")) {
    return typedjson({
      error: "Fuck off WhatsApp preview, lad",
    });
  }
  invariant(params.loginToken, "Token required");
  return await handleMagicLinkLogin(params.loginToken);
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    charset: "utf-8",
    title: data.error || "Brake Neck - Cars at break neck speed",
    viewport: "width=device-width,initial-scale=1",
  };
};

export default function LoginTokenRoute() {
  const loaderData = useTypedLoaderData<typeof loader>();
  if (loaderData.error) {
    return (
      <main>
        <h1>{loaderData.error}</h1>
      </main>
    );
  }
  return <p>Logging you in</p>;
}

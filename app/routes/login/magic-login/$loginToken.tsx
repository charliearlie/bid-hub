import { LoaderArgs } from "@remix-run/node";
import { handleMagicLinkLogin } from "~/services/user.server";
import invariant from "tiny-invariant";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ params, request }: LoaderArgs) => {
  if (request.headers.get("user-agent")?.includes("WhatsApp")) {
    return typedjson({
      error: "WhatsApp is not allowed to use your magic login token",
    });
  }
  invariant(params.loginToken, "Token required");
  return await handleMagicLinkLogin(params.loginToken);
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

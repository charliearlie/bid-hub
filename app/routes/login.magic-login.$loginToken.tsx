import type { LoaderArgs } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react/dist/routeModules";
import { handleMagicLinkLogin } from "~/services/user.server";
import invariant from "tiny-invariant";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ params, request }: LoaderArgs) => {
  if (request.headers.get("user-agent")?.includes("WhatsApp")) {
    return typedjson({
      error: "Block whatsapp preview",
    });
  }
  invariant(params.loginToken, "Token required");
  return await handleMagicLinkLogin(params.loginToken);
};

export const meta: V2_MetaFunction = () => {
  return [{ title: "Logging you in" }, { name: "description", content: "" }];
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

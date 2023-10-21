import { DataFunctionArgs, json } from "@remix-run/node";
import { handleMagicLinkLogin } from "~/services/user.server";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params, request }: DataFunctionArgs) => {
  if (request.headers.get("user-agent")?.includes("WhatsApp")) {
    return json({
      error: "Block whatsapp preview",
    });
  }
  invariant(params.loginToken, "Token required");
  return await handleMagicLinkLogin(params.loginToken);
};

export const meta = () => {
  return [{ title: "Logging you in" }, { name: "description", content: "" }];
};

export default function LoginTokenRoute() {
  const loaderData = useLoaderData<typeof loader>();
  if (loaderData.error) {
    return (
      <main>
        <h1>{loaderData.error}</h1>
      </main>
    );
  }
  return <p>Logging you in</p>;
}

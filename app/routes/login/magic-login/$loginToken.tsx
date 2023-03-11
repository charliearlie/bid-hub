import { useActionData, useTransition } from "@remix-run/react";
import { DataFunctionArgs, json, LoaderFunction } from "@remix-run/node";
import Alert, { AlertType } from "~/components/alert";
import Form from "~/components/form/form";
import FormField from "~/components/form/form-field";
import Spinner from "~/components/spinner";
import Button from "~/components/button";
import { handleMagicLinkLogin } from "~/services/user.server";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({ params }: DataFunctionArgs) => {
  invariant(params.loginToken, "Token required");
  return await handleMagicLinkLogin(params.loginToken);
};

export default function LoginTokenRoute() {
  return <p>Logging you in</p>;
}

import { DataFunctionArgs, json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { requireUserId } from "~/services/session.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  await requireUserId(request);

  return json({ loggedIn: true });
};

export default function AddCarRoute() {
  return (
    <Form method="post">
      <label>
        Manufacturer
        <input type="text" name="manufacturer" />
      </label>
    </Form>
  );
}

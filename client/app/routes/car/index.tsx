import React, { useRef } from "react";
import { Link, useActionData, useTransition } from "@remix-run/react";
import {
  ActionArgs,
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import Button from "~/components/button";
import { addCar, addManufacturer } from "~/services/cars.server";

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
};

export default function CarRoute() {
  const actionData = useActionData();
  return (
    <main>
      <form method="post">
        <Button>Add manufacturers</Button>
      </form>
      {JSON.stringify(actionData)}
    </main>
  );
}

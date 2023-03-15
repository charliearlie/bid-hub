import React, { useRef } from "react";
import { Link, useActionData, useTransition } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import Button from "~/components/common/button";
import { addCar, addManufacturer, editCar } from "~/services/cars.server";
import { typedjson, useTypedActionData } from "remix-typedjson";

export default function CarRoute() {
  const actionData = useTypedActionData<typeof action>();
  return (
    <main>
      <form method="post">
        <Button>Add manufacturers</Button>
      </form>
      {JSON.stringify(actionData)}
    </main>
  );
}

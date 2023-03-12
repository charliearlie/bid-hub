import { ActionArgs, json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Button from "~/components/button";
import { getAllCars } from "~/services/cars.server";
import { logout } from "~/services/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  return getAllCars();
};

export default function Index() {
  const loaderData = useLoaderData();

  return (
    <div>
      {JSON.stringify(loaderData)}
      <form method="post">
        <Button variant="danger">Log out lad</Button>
      </form>
    </div>
  );
}

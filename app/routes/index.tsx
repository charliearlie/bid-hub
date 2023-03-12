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
    <main>
      <img
        className="h-[32rem] w-full object-cover"
        src="https://amsc-prod-cd.azureedge.net/-/media/aston-martin/images/default-source/models/valkyrie/new/valkyrie-amr-pro_01_169.jpg?mw=1080&rev=f37a903f4262431b9f10de6856c54e7e&hash=D8AC1ACA8BD5C7AA1DA79678F4803581"
        alt="Aston Martin Valkyrie"
      />
      {JSON.stringify(loaderData)}
      <form method="post">
        <Button variant="danger">Log out lad</Button>
      </form>
    </main>
  );
}

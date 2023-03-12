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
        src="https://amsc-prod-cd.azureedge.net/-/media/aston-martin/images/default-source/models/valkyrie/new/valkyrie-amr-pro_08_169.jpg?mw=1920&rev=80d4e84324974e87b721dc51509e9634&hash=0A925977E6EB8E1F2CE9131047F1CF70"
        alt="Aston Martin Valkyrie"
      />
      {JSON.stringify(loaderData)}
      <form method="post">
        <Button variant="danger">Log out lad</Button>
      </form>
    </main>
  );
}

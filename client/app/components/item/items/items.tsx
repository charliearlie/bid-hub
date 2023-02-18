import { useLoaderData } from "@remix-run/react";
import type { ItemsLoaderData } from "~/types/loader-data";
import Divider from "../../divider";
import ItemPreview from "../item-preview/item-preview";

export default function Items() {
  const { items } = useLoaderData<ItemsLoaderData>();

  return (
    <ul className="grid grid-cols-1 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <ItemPreview item={item} />
          <Divider />
        </li>
      ))}
    </ul>
  );
}

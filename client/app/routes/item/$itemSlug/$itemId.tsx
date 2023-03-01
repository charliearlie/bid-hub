import { useLoaderData } from "@remix-run/react";
import {
  ActionArgs,
  ActionFunction,
  DataFunctionArgs,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import {
  requestClient,
  requestWithCredentials,
} from "~/gql/util/gql-request.server";
import { ITEM_BY_ID_QUERY } from "~/gql/queries";
import { Item, ItemResponse, MutationPlaceBidArgs } from "~/gql/graphql";
import Button from "~/components/button";
import Bid from "~/components/bid/bid";
import { PLACE_BID } from "~/gql/mutations/place-bid";

export const loader: LoaderFunction = async ({ params }: DataFunctionArgs) => {
  try {
    const response = await requestClient.request(ITEM_BY_ID_QUERY, {
      itemId: Number(params.itemId),
    });

    return json<ItemResponse>(response.getItemById);
  } catch (error) {
    return redirect("/items");
  }
};

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "bid") {
    const bidAmount = formData.get("bidAmount");
    const itemId = formData.get("itemId");

    const variables: MutationPlaceBidArgs = {
      amount: Number(bidAmount),
      itemId: Number(itemId),
    };

    const response = await requestWithCredentials(PLACE_BID, request, {
      ...variables,
    });
    if (response.placeBid) {
      return json(response.placeBid.success);
    }
  }
  return null;
};

export default function ItemRoute() {
  const { item, success, errors } = useLoaderData<ItemResponse>();
  if (item) {
    const resolvedItem: Item = { ...item }; // This removes the Maybe<>
    const {
      bidCount,
      buyItNowPrice,
      categories,
      condition,
      description,
      formattedBuyItNowPrice,
      imageUrl,
      name,
      seller,
      startingPrice,
    } = resolvedItem;

    console.log(categories);

    const isBiddingEnabled = !!startingPrice;

    return (
      <main className="p-4 md:p-12">
        <div className="flex flex-col gap-8 md:flex-row">
          <img src={imageUrl as string} />
          <div>
            <h1 className="text-2xl font-black md:text-4xl">{name}</h1>
            <p>{description}</p>
            <ul className="flex gap-2">
              {categories.map((category) => (
                <span>{category.title}</span>
              ))}
            </ul>
            <p>{condition}</p>
            <h3 className="text-2xl font-black">
              {formattedBuyItNowPrice}
              <span className="pl-1 text-green-600">(Buy it now)</span>
            </h3>
            <p>{bidCount} bids</p>
            <Button variant="primary">Buy now</Button>
            {isBiddingEnabled && <Bid item={resolvedItem} />}
          </div>
        </div>
      </main>
    );
  }
}

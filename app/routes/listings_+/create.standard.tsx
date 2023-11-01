import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { Item } from "@prisma/client";
import { SelectValue } from "@radix-ui/react-select";
import { DataFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { PoundSterlingIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { SwitchWithLabel } from "~/components/common/switch-with-label";
import Card from "~/components/common/ui/card/card";
import CardContent from "~/components/common/ui/card/card-content";
import { Label } from "~/components/common/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/common/ui/select";
import FormField from "~/components/form/form-field";
import FormFieldTextArea from "~/components/form/form-field-text-area";
import { SubmitButton } from "~/components/form/submit-button";
import { createItem, getItemById } from "~/services/item.server";
import {
  addListing,
  getCategoryDropdownOptions,
} from "~/services/listings.server";
import { getUserId } from "~/services/session.server";

const CreateListingSchema = z
  .object({
    title: z
      .string({
        required_error: "Please enter a title",
      })
      .max(100),
    description: z
      .string({ required_error: "Please enter a description" })
      .max(1000),
    itemName: z
      .string({ required_error: "Please enter an item name" })
      .max(100),
    categoryId: z.string().max(100),
    quantity: z.number().max(100).default(1),
    buyItNowPrice: z.number().max(10000000).optional(),
    startingBid: z.number().max(100000).optional(),
    reservePrice: z.number().max(100000).optional(),
    minBidIncrement: z.number().max(100).optional(),
    itemId: z.string().optional(),
  })
  .refine(
    (data) => {
      const { buyItNowPrice, startingBid } = data;
      return (
        (buyItNowPrice !== null && startingBid !== null) ||
        buyItNowPrice !== null ||
        startingBid !== null
      );
    },
    {
      message: "Either Buy It Now Price or Starting Price must be specified.",
    }
  );

export const loader = async () => {
  const categoryDropdownOptions = await getCategoryDropdownOptions();

  return json({ categoryDropdownOptions } as const);
};

export const action = async ({ request }: DataFunctionArgs) => {
  const formData = await request.formData();

  const submission = await parse(formData, { schema: CreateListingSchema });

  if (submission.intent !== "submit" || !submission.value) {
    return json({ status: "idle", submission } as const);
  }

  let newItem: Item | null;

  if (submission.value.itemId) {
    newItem = await getItemById(submission.value.itemId);
  } else {
    newItem = await createItem(submission.value.itemName);
  }

  if (!newItem) {
    submission.error[""] = ["We failed to create your item"];
    return json({ status: "error", submission } as const);
  }

  const { itemId, ...listingData } = submission.value;

  const userId = await getUserId(request);

  if (!userId) {
    submission.error[""] = ["You must be logged in to create a listing"];
    return json({ status: "error", submission } as const);
  }

  const newListing = await addListing(
    {
      title: listingData.title,
      description: listingData.description,
      quantity: listingData.quantity,
      buyItNowPrice: listingData.buyItNowPrice || null,
      startingBid: listingData.startingBid || null,
      minBidIncrement: listingData.minBidIncrement || null,
    },
    newItem,
    [listingData.categoryId],
    userId
  );

  if (!newListing) {
    submission.error[""] = ["We failed to create your listing"];
    return json({ status: "error", submission } as const);
  }

  return json({ status: "success", listing: newListing, submission } as const);
};

export default function CreateListingRoute() {
  const [isAuction, setIsAuction] = useState(false);
  const actionData = useActionData<typeof action>();
  const { categoryDropdownOptions } = useLoaderData<typeof loader>();

  const [form, fields] = useForm({
    id: "create-listing-form",
    lastSubmission: actionData?.submission,
    shouldValidate: "onBlur",
    constraint: getFieldsetConstraint(CreateListingSchema),
    onValidate({ formData }) {
      return parse(formData, { schema: CreateListingSchema });
    },
    defaultValue: { quantity: 1, itemId: "" }, // We will get the item id if it exists
  });

  return (
    <Card>
      <CardContent className="md:p-8">
        <h1 className="md: p-4 text-center text-4xl font-bold md:text-5xl">
          Sell your item on Bidhub
        </h1>
        <Form method="post" {...form}>
          <FormField
            label="Title"
            {...conform.input(fields.title)}
            errors={fields.title.errors} // These should work in the line above so need to fix - todo
          />
          <FormFieldTextArea
            name="description"
            label="Description"
            errors={fields.description.errors}
          />
          {/**
           * itemName will do some magic mapping to existing items
           * if necessary so will likely be a dropdown of some sorts
           * */}
          <FormField
            label="Item name"
            {...conform.input(fields.itemName)}
            errors={fields.itemName.errors}
          />
          {/**
           * Category is single select for now but will be multi select
           * todo: Make this a multi select
           * */}
          <div className="mb-8 flex w-full flex-col gap-1.5">
            <Label className="font-bold" htmlFor="category">
              Category
            </Label>
            <Select name="categoryId">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryDropdownOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <FormField
              label="Quantity"
              {...conform.input(fields.quantity)}
              errors={fields.quantity.errors}
            />
            <FormField
              label="Sale price"
              {...conform.input(fields.buyItNowPrice)}
              errors={fields.buyItNowPrice.errors}
              Icon={PoundSterlingIcon} // Will use a config for the user's currency
            />
          </div>
          <SwitchWithLabel
            label="Auction"
            checked={isAuction}
            onCheckedChange={() => setIsAuction(!isAuction)}
          />
          {isAuction && (
            <div>
              <div className="mt-5 flex items-center space-x-2">
                <FormField
                  label="Starting price"
                  {...conform.input(fields.startingBid)}
                  errors={fields.startingBid.errors}
                  Icon={PoundSterlingIcon}
                />
                <FormField
                  label="Reserve price"
                  {...conform.input(fields.reservePrice)}
                  errors={fields.reservePrice.errors}
                  Icon={PoundSterlingIcon}
                />
              </div>
              <div className="mt-5 flex items-center space-x-2">
                <FormField
                  label="Smallest bid"
                  {...conform.input(fields.minBidIncrement)}
                  errors={fields.minBidIncrement.errors}
                  Icon={PoundSterlingIcon}
                />
                <FormField
                  name="endDate"
                  type="date"
                  label="End date"
                  errors={[]}
                />
              </div>
            </div>
          )}
          <div className="mt-4 flex md:justify-end">
            <SubmitButton className="w-full md:w-48" variant="default">
              Create listing
            </SubmitButton>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}

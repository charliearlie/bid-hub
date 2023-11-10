import {
  conform,
  list,
  useFieldList,
  useFieldset,
  useForm,
} from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import Card from "~/components/common/ui/card/card";
import CardContent from "~/components/common/ui/card/card-content";
import {
  AddressFieldsetSchema,
  FileSchema,
  PersonalDetailsFieldsetSchema,
} from "~/services/schemas.server";
import {
  getUser,
  updateUserAddresses,
  updateUserPersonalDetails,
} from "~/services/user.server";
import { UPLOAD_PRESET_ENUM, uploadImages } from "~/util/cloudinary.server";
import { invariantResponse } from "~/util/utils";
import { AddressFieldset } from "./form/address-fieldset";
import { UserDetailsFieldset } from "./form/user-details-fieldset";
import { Separator } from "~/components/common/ui/separator";
import { SubmitButton } from "~/components/form/submit-button";
import { Button } from "~/components/common/ui/button";
import FormField from "~/components/form/form-field";

const ManageUserFormSchema = z.object({
  personalDetails: PersonalDetailsFieldsetSchema,
  addresses: z.array(AddressFieldsetSchema),
  email: z.string().email(),
  avatarImage: FileSchema,
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parse(formData, { schema: ManageUserFormSchema });

  if (submission.intent !== "submit" || !submission.value) {
    return json({ status: "idle", submission } as const);
  }

  const image = submission.value?.avatarImage
    ? await uploadImages(
        submission.value.avatarImage,
        UPLOAD_PRESET_ENUM.bidhubAvatar
      )
    : null;

  const user = await getUser(request);
  if (!user) {
    throw new Response("User not logged in", { status: 404 });
  }

  const updatedUserAddresses = await updateUserAddresses(
    submission.value.addresses,
    user.id
  );

  const updatedUser = await updateUserPersonalDetails(
    submission.value.personalDetails,
    user.id
  );

  // todo: add good error/success messages
  return json({
    status: updatedUserAddresses && updatedUser ? "success" : "error",
    image,
    submission,
  } as const);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);

  invariantResponse(user, "User not logged in", { status: 404 });
  user.password = "";
  return json({ user });
};

export default function ManageUserRoute() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    id: "manage-user-form",
    constraint: getFieldsetConstraint(ManageUserFormSchema),
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: ManageUserFormSchema });
    },
    shouldValidate: "onBlur",
    defaultValue: {
      email: user.email,
      personalDetails: {
        firstName: user.personalDetails?.firstName || "",
        lastName: user.personalDetails?.lastName || "",
      },
      addresses: user.addresses.length ? user.addresses : [{}],
    },
  });

  const userData = useFieldset(form.ref, fields.personalDetails);
  const addresses = useFieldList(form.ref, fields.addresses);

  const hasAddressStored = user.addresses.length > 0;
  if (user) {
    return (
      <Card>
        <CardContent className="md:p-8">
          <Form method="post" {...form.props}>
            <FormField
              label="Email"
              {...conform.input(fields.email, { type: "email" })}
              disabled
              helperText="Contact support to change your email address"
            />
            <UserDetailsFieldset user={userData} />
            <Separator />
            <h3 className="py-4 text-lg font-semibold">Addresses</h3>
            {addresses.map((address, index) => (
              <>
                {index > 0 && <Separator />}
                <AddressFieldset key={address.id} address={address} />
              </>
            ))}
            <div className="flex justify-center py-2">
              {hasAddressStored && (
                <Button
                  variant="outline"
                  {...list.insert(fields.addresses.name, {})}
                >
                  Add address
                </Button>
              )}
            </div>
            <SubmitButton>Save changes</SubmitButton>
          </Form>
        </CardContent>
      </Card>
    );
  }
}

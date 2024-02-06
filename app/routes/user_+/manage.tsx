import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";

import { Button } from "~/components/common/ui/button";
import { Card } from "~/components/common/ui/card/card";
import CardContent from "~/components/common/ui/card/card-content";
import { Separator } from "~/components/common/ui/separator";
import { FormField } from "~/components/form/form-field";
import { ImageUploadAvatar } from "~/components/form/image-upload-avatar";
import { SubmitButton } from "~/components/form/submit-button";

import {
  getUser,
  updateUserAddresses,
  updateUserAvatar,
  updateUserPersonalDetails,
} from "~/services/user.server";
import {
  AddressFieldsetSchema,
  FileSchema,
  PersonalDetailsFieldsetSchema,
} from "~/services/zod-schemas";

import { UPLOAD_PRESET_ENUM, uploadImages } from "~/util/cloudinary.server";
import { invariantResponse } from "~/util/utils";

const ManageUserFormSchema = z.object({
  personalDetails: PersonalDetailsFieldsetSchema,
  addresses: z.array(AddressFieldsetSchema),
  email: z.string().email(),
  password: z
    .string({
      required_error: "Please enter your password to update your profile",
    })
    .min(8),
  avatarImage: FileSchema.optional(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: ManageUserFormSchema });

  if (submission.status !== "success") {
    return json(
      { result: submission.reply(), status: submission.status } as const,
      {
        status: submission.status === "error" ? 400 : 200,
      }
    );
  }

  const [avatarImage] = submission.value?.avatarImage
    ? await uploadImages(
        submission.value.avatarImage,
        UPLOAD_PRESET_ENUM.bidhubAvatar
      )
    : [];

  const user = await getUser(request);
  if (!user) {
    return json({
      result: submission.reply({
        formErrors: ["You must be logged in to manage your profile"],
      }),
      status: "error",
    } as const);
  }

  if (typeof avatarImage?.imageUrl === "string") {
    await updateUserAvatar(avatarImage.imageUrl, user.id);
  }

  const updatedUserAddresses = await updateUserAddresses(
    submission.value.addresses,
    user.id
  );

  if (!updatedUserAddresses) {
    return json({
      result: submission.reply({
        formErrors: ["Your address wasn't updated. Please try again."],
      }),
      status: "error",
    } as const);
  }

  const updatedUser = await updateUserPersonalDetails(
    submission.value.personalDetails,
    user.id
  );

  if (!updatedUser) {
    return json({
      result: submission.reply({
        formErrors: ["Something went wrong. Please try again."],
      }),
      status: "error",
    } as const);
  }

  return json({ result: submission.reply(), status: "success" });
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
    constraint: getZodConstraint(ManageUserFormSchema),
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ManageUserFormSchema });
    },
    shouldValidate: "onBlur",
    defaultValue: {
      email: user.email,
      personalDetails: {
        firstName: user.personalDetails?.firstName || "",
        lastName: user.personalDetails?.lastName || "",
      },
      addresses: user.addresses.length ? user.addresses : [],
    },
  });

  const userData = fields.personalDetails.getFieldset();
  const addresses = fields.addresses.getFieldList();

  if (user) {
    return (
      <main className="container mx-auto max-w-3xl p-4">
        <Card>
          <CardContent className="md:p-8">
            <Form
              method="post"
              encType="multipart/form-data"
              {...getFormProps(form)}
            >
              <div className="flex flex-col items-center justify-between gap-4 lg:flex-row lg:items-start lg:gap-8">
                <ImageUploadAvatar
                  className="h-[172px] w-[172px] basis-1/4 rounded-lg"
                  src={user.avatarUrl || undefined}
                  fieldProps={{
                    ...getInputProps(fields.avatarImage, { type: "file" }),
                  }}
                />
                <div className="flex w-full flex-col gap-0.5 lg:basis-3/4">
                  <FormField
                    label="Email"
                    {...getInputProps(fields.email, { type: "email" })}
                    helperText="Contact support to change your email address"
                  />
                  <FormField
                    label="Password"
                    {...getInputProps(fields.password, { type: "password" })}
                    errors={fields.password.errors}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="py-4 font-semibold">Personal details</h3>
                <div className="flex justify-evenly gap-1.5">
                  <FormField
                    label="First Name"
                    {...getInputProps(userData.firstName, { type: "text" })}
                  />
                  <FormField
                    label="Last Name"
                    {...getInputProps(userData.lastName, { type: "text" })}
                  />
                </div>
                <FormField
                  label="Phone number"
                  {...getInputProps(userData.phoneNumber, { type: "tel" })}
                />
              </div>
              <Separator />
              <h3 className="py-4 text-lg font-semibold">Addresses</h3>
              {addresses.map((address, index) => {
                const {
                  addressLine1,
                  addressLine2,
                  addressLine3,
                  cityOrTown,
                  id,
                  name,
                  postcode,
                } = address.getFieldset();
                return (
                  <div key={address.id}>
                    {index > 0 && <Separator />}
                    <fieldset className="flex flex-col py-4">
                      <FormField
                        label="Address name"
                        {...getInputProps(name, { type: "text" })}
                        errors={name.errors}
                      />
                      <FormField
                        label="Address Line 1"
                        {...getInputProps(addressLine1, { type: "text" })}
                        errors={addressLine1.errors}
                      />
                      <FormField
                        label="Address Line 2"
                        {...getInputProps(addressLine2, { type: "text" })}
                      />
                      <FormField
                        label="Address Line 3"
                        {...getInputProps(addressLine3, { type: "text" })}
                      />
                      <div className="flex gap-1.5">
                        <div className="basis-2/3">
                          <FormField
                            label="City or Town"
                            {...getInputProps(cityOrTown, { type: "text" })}
                            errors={cityOrTown.errors}
                          />
                        </div>
                        <div className="basis-1/3">
                          <FormField
                            label="Postcode"
                            {...getInputProps(postcode, { type: "text" })}
                            errors={postcode.errors}
                          />
                        </div>
                      </div>
                      {id && (
                        <input {...getInputProps(id, { type: "hidden" })} />
                      )}
                    </fieldset>
                  </div>
                );
              })}
              <div className="flex justify-center py-2">
                <Button
                  variant="outline"
                  {...form.insert.getButtonProps({
                    name: fields.addresses.name,
                  })}
                >
                  Add address
                </Button>
              </div>
              <SubmitButton>Save changes</SubmitButton>
            </Form>
          </CardContent>
        </Card>
      </main>
    );
  }
}

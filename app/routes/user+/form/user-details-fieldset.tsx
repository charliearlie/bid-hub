import { Fieldset, conform } from "@conform-to/react";
import { z } from "zod";
import FormField from "~/components/form/form-field";
import { PersonalDetailsFieldsetSchema } from "~/services/schemas.server";

type Props = {
  user: Fieldset<z.infer<typeof PersonalDetailsFieldsetSchema>>;
};

export function UserDetailsFieldset({ user }: Props) {
  const { firstName, lastName, phoneNumber } = user;
  return (
    <div className="flex flex-col">
      <h3 className="py-4 font-semibold">Personal details</h3>
      <div className="flex justify-evenly gap-1.5">
        <FormField label="First Name" {...conform.input(firstName)} />
        <FormField label="Last Name" {...conform.input(lastName)} />
      </div>
      <FormField
        label="Phone number"
        {...conform.input(phoneNumber, { type: "tel" })}
      />
    </div>
  );
}

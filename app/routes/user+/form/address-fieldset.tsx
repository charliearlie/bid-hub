import { FieldConfig, conform, useFieldset } from "@conform-to/react";
import { useRef } from "react";
import { z } from "zod";
import FormField from "~/components/form/form-field";
import { AddressFieldsetSchema } from "~/services/schemas.server";

type Props = {
  address: FieldConfig<z.infer<typeof AddressFieldsetSchema>>;
};

export function AddressFieldset({ address }: Props) {
  const ref = useRef<HTMLFieldSetElement>(null);
  const {
    addressLine1,
    addressLine2,
    addressLine3,
    cityOrTown,
    id,
    name,
    postcode,
  } = useFieldset(ref, address);

  return (
    <fieldset ref={ref} className="flex flex-col py-4">
      <FormField label="Address name" {...conform.input(name)} />
      <FormField label="Address Line 1" {...conform.input(addressLine1)} />
      <FormField label="Address Line 2" {...conform.input(addressLine2)} />
      <FormField label="Address Line 3" {...conform.input(addressLine3)} />
      <div className="flex gap-1.5">
        <div className="basis-2/3">
          <FormField label="City or Town" {...conform.input(cityOrTown)} />
        </div>
        <div className="basis-1/3">
          <FormField label="Postcode" {...conform.input(postcode)} />
        </div>
      </div>
      {id && <input type="hidden" {...conform.input(id)} />}
    </fieldset>
  );
}

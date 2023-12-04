import { $Enums, FulfilmentOption } from "@prisma/client";

import { AtLeast } from "~/services/types.server";

// This might be doing nothing so do some tests to ensure it is
type FulfilmentOptionPartial = AtLeast<
  FulfilmentOption,
  "method" | "minDays" | "maxDays" | "price"
>;

type Props = {
  options: FulfilmentOptionPartial[];
};

export const FulfilmentOptions = ({ options }: Props) => {
  return (
    <section aria-labelledby="Delivery options">
      <ul>
        {options.map((option) => (
          <li key={option.method}>
            <Option {...option} />
          </li>
        ))}
      </ul>
    </section>
  );
};

type OptionsProps = Pick<
  FulfilmentOptionPartial,
  "method" | "minDays" | "maxDays" | "price"
>;

const Option = ({ method, minDays, maxDays, price }: OptionsProps) => {
  const option = {
    [$Enums.PostageType.STANDARD]: {
      heading: "Standard delivery",
      description: `Usually delivered within ${minDays} - ${maxDays} days.`,
    },
    [$Enums.PostageType.NEXT_DAY]: {
      heading: "Next day delivery",
      description: `Delivered tomorrow if ordered before 9pm.`,
    },
    [$Enums.PostageType.COURIER]: {
      heading: "Courier delivery",
      description: `DPD delivery. Delivered within ${minDays} - ${maxDays} days.`,
    },
    [$Enums.PostageType.SIGNED_FOR]: {
      heading: "Signed for delivery",
      description: `Ensure your item is actually delivered.`,
    },
  }[method];

  return (
    <div className="flex flex-col py-2">
      <h3 className="font-bold">{option.heading}</h3>
      <p className="text-sm">{option.description}</p>
      <p>£{price}</p>
    </div>
  );
};

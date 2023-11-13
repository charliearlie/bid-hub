import type { SwitchProps } from "@radix-ui/react-switch";
import { useId } from "react";

import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

type Props = {
  id?: string;
  label: string;
} & SwitchProps;

export function SwitchWithLabel({ id, label, ...props }: Props) {
  const generatedId = useId();
  return (
    <div className="flex items-center space-x-2">
      <Switch id={id || generatedId} {...props} />
      <Label className="font-bold" htmlFor={id || generatedId}>
        {label}
      </Label>
    </div>
  );
}

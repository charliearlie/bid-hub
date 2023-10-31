import { type ReactElement, forwardRef, useId } from "react";
import { Label } from "../common/ui/label";
import { Input } from "../common/ui/input";
import InputErrors from "./input-errors";
import { type LucideIcon } from "lucide-react";
import { cn } from "~/util/utils";

export type FormFieldProps = {
  errors?: Array<string> | null;
  Icon?: LucideIcon;
  label: string;
  name: string;
};

type Props = FormFieldProps & React.HTMLProps<HTMLInputElement>;

const FormField = forwardRef<HTMLInputElement, Props>(
  ({ errors, Icon, label, name, ...props }, ref): ReactElement => {
    const id = useId();
    const inputId = `${id}-${name}`;
    const inputErrorsId = `${id}-${name}-errors`;

    const hasErrors = !!errors?.length;
    return (
      <div className="flex w-full flex-col gap-1.5">
        <Label className="font-bold" htmlFor={inputId}>
          {label}
        </Label>
        <span className="flex items-center">
          <Input
            name={name}
            className={cn(
              hasErrors && "ring-2 ring-destructive ring-offset-1",
              Icon && "pl-8"
            )}
            id={inputId}
            {...props}
            ref={ref}
            aria-invalid={hasErrors || undefined}
            aria-describedby={hasErrors ? inputErrorsId : undefined}
          />
          {Icon && <Icon className="absolute" size={16} />}
        </span>
        <div className="min-h-[24px]">
          <InputErrors id={inputErrorsId} errors={errors} />
        </div>
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;

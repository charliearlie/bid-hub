import { type ReactElement, forwardRef, useId } from "react";
import { Label } from "../common/ui/label";
import { Input } from "../common/ui/input";
import InputErrors from "./input-errors";
import { type LucideIcon } from "lucide-react";
import { cn } from "~/util/utils";

export type FormFieldProps = {
  errors?: Array<string> | null;
  helperText?: string;
  Icon?: LucideIcon;
  label: string;
};

type Props = FormFieldProps & React.HTMLProps<HTMLInputElement>;

const FormField = forwardRef<HTMLInputElement, Props>(
  (
    { errors, helperText, Icon, label, name, type, ...props },
    ref
  ): ReactElement => {
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
              Icon && "pl-5",
              type === "file" &&
                "file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-background file:px-3 file:py-[0.32rem] file:text-foreground file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-secondary-foreground"
            )}
            id={inputId}
            type={type}
            {...props}
            ref={ref}
            aria-invalid={hasErrors || undefined}
            aria-describedby={hasErrors ? inputErrorsId : undefined}
          />
          {Icon && <Icon className="absolute" strokeWidth={3} size={16} />}
        </span>
        {helperText && <span className="text-sm font-light">{helperText}</span>}
        <div className="flex min-h-[18px] items-start">
          <InputErrors id={inputErrorsId} errors={errors} />
        </div>
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;

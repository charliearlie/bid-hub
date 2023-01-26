import { forwardRef, ReactElement } from "react";

export type FormFieldProps = {
  label: string;
  labelLeft?: boolean;
};

type Props = FormFieldProps & React.HTMLProps<HTMLInputElement>;

const FormField = forwardRef<HTMLInputElement, Props>(
  ({ label, labelLeft, ...props }, ref): ReactElement => {
    return (
      <div
        className={`mb-4 flex ${
          labelLeft ? "flex-row items-center justify-between" : "flex-col"
        }`}
      >
        <label className="block font-bold">{label}</label>
        <input
          className="focus:shadow-outline rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3
        py-2 text-lg autofill:first-line:text-lg"
          {...props}
          ref={ref}
        />
      </div>
    );
  }
);

export default FormField;

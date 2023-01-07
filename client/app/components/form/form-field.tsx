import { ChangeEvent } from "react";

export type FormFieldProps = {
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  label: string;
};

type Props = FormFieldProps & React.HTMLProps<HTMLInputElement>;

export default function FormField({
  handleChange,
  label,
  ...props
}: Props): React.ReactElement {
  return (
    <div className="mb-4 flex flex-col">
      <label className="block font-bold">{label}</label>
      <input
        className="focus:shadow-outline rounded px-3 py-2 text-lg autofill:first-line:text-lg"
        onChange={handleChange}
        {...props}
      />
    </div>
  );
}

import { ChangeEvent } from "react";

type Props = {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label: string;
};

type FormFieldProps = Props & React.HTMLProps<HTMLInputElement>;

export default function FormField({
  handleChange,
  label,
  ...props
}: FormFieldProps): React.ReactElement {
  return (
    <div className="mb-4 flex flex-col">
      <label className="block font-bold">{label}</label>
      <input
        className="focus:shadow-outline rounded px-3 py-2 text-lg"
        onChange={handleChange}
        {...props}
      />
    </div>
  );
}

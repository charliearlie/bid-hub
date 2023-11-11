import type { FormProps as RemixFormProps } from "@remix-run/react";
import { Form as RemixForm } from "@remix-run/react";
import type { ChangeEvent, ReactNode } from "react";
import React, { useState } from "react";

import type { FormFieldProps } from "./form-field";
import FormField from "./form-field";

export type FormData = Record<string, string | number>;

type Props = {
  children: ReactNode;
  css?: string;
  initialFormValues: FormData;
  handleSubmit?: (values: FormData) => void;
  overrideStyles?: boolean;
};

type FormProps = RemixFormProps & Props;

export default function Form({
  css,
  children,
  initialFormValues,
  overrideStyles,
  handleSubmit,
  ...props
}: FormProps) {
  type FormKeys = keyof FormData;
  type FormState = Record<FormKeys, FormData[FormKeys]>;
  const [formState, setFormState] = useState<FormState>(initialFormValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <RemixForm {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === FormField) {
          const props: Partial<FormFieldProps> = {
            ...child.props,
            onChange: handleChange,
            defaultValue:
              child.props.defaultValue || formState[child.props.name],
          };
          return React.cloneElement(child, props);
        }
        return child;
      })}
    </RemixForm>
  );
}

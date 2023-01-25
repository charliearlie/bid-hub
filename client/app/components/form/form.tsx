import React, { ChangeEvent, ReactNode, useState } from "react";
import {
  Form as RemixForm,
  FormProps as RemixFormProps,
} from "@remix-run/react";
import FormField, { FormFieldProps } from "./form-field";
import { InputMaybe } from "~/gql/graphql";

export type FormData = Record<string, string | number | InputMaybe<string>>;

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

  console.log(formState);
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  //TODO: Got to correctly bind the form state to the form so it's displayed on page load

  return (
    <RemixForm {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === FormField) {
          const props: Partial<FormFieldProps> = {
            ...child.props,
            handleChange,
            value: formState[child.props.name],
          };
          return React.cloneElement(child, props);
        }
        return child;
      })}
    </RemixForm>
  );
}

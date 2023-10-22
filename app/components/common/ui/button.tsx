import type { HTMLProps, ReactNode } from "react";
import classNames from "classnames";

type ButtonProps = {
  children: ReactNode;
  type?: "button" | "submit" | "reset" | undefined; // No idea why HTMLProps<HTMLButtonElement> doesn't cover this correctly
  variant?: "primary" | "secondary" | "danger";
};
type Props = ButtonProps & HTMLProps<HTMLButtonElement>;

export default function Button({
  children,
  className,
  type,
  variant = "primary",
  ...props
}: Props) {
  const variantClass = classNames(
    "button",
    {
      "button-primary": variant === "primary",
      "button-secondary": variant === "secondary",
      "button-danger": variant === "danger",
    },
    className
  );
  return (
    <button className={variantClass} type={type} {...props}>
      {children}
    </button>
  );
}

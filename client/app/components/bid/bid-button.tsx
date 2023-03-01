import classNames from "classnames";
import { MouseEvent } from "react";

export type BidButtonProps = {
  disabled: boolean;
  handleButtonClick: (event: MouseEvent<HTMLButtonElement>) => void;
  type: "increase" | "decrease";
};
export default function BidButton({
  disabled,
  handleButtonClick,
  type,
}: BidButtonProps) {
  const className = classNames("h-10 w-12 text-white text-lg font-semibold", {
    "bg-green-500": type === "increase",
    "bg-red-500": type === "decrease",
  });
  return (
    <button
      className={className}
      disabled={disabled}
      name={type}
      onClick={handleButtonClick}
    >
      {type === "increase" ? "+" : "-"}
    </button>
  );
}

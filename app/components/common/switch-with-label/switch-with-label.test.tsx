import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SwitchWithLabel } from "./switch-with-label";

describe("SwitchWithLabel", () => {
  it("renders the label text and the switch in an unchecked state", () => {
    const { getByRole, getByText } = render(
      <SwitchWithLabel label="Test Label" />
    );
    expect(getByText("Test Label")).toBeInTheDocument();
    expect(getByRole("switch")).toHaveAttribute("aria-checked", "false");
    expect(getByRole("switch")).toHaveAttribute("data-state", "unchecked");
  });

  it("calls the onCheckedChange function when the label is clicked", async () => {
    const onCheckedChange = jest.fn();
    const { getByRole } = render(
      <SwitchWithLabel label="Test Label" onCheckedChange={onCheckedChange} />
    );
    const switchElement = getByRole("switch");

    expect(switchElement).toHaveAttribute("data-state", "unchecked");

    await act(async () => {
      await userEvent.click(switchElement);
    });

    expect(switchElement).toHaveAttribute("data-state", "checked");
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
  });

  it("should default to a checked state when the checked prop is true", () => {
    const onCheckedChange = jest.fn();
    const { getByRole } = render(
      <SwitchWithLabel
        label="Test Label"
        defaultChecked={true}
        onCheckedChange={onCheckedChange}
      />
    );
    const switchElement = getByRole("switch");
    expect(switchElement).toHaveAttribute("aria-checked", "true");
    expect(switchElement).toHaveAttribute("data-state", "checked");
  });
});

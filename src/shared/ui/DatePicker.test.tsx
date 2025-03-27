import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DatePicker } from "./DatePicker";
import { render } from "../../test/setup";

describe("DatePicker", () => {
  it("должен отображать календарь", () => {
    render(<DatePicker selectedDate={new Date()} onSelect={() => {}} />);

    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(screen.getByRole("grid")).toHaveAttribute(
      "aria-label",
      expect.stringMatching(/март 2025/),
    );
  });
});

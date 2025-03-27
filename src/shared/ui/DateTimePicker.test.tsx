import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DateTimePicker } from "./DateTimePicker";
import { render } from "../../test/setup";

describe("DateTimePicker", () => {
  it("должен отображать компоненты выбора даты и времени", () => {
    render(
      <DateTimePicker
        value={new Date()}
        onChange={() => {}}
        disabled={false}
      />,
    );

    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Часы" })).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Минуты" }),
    ).toBeInTheDocument();
  });
});

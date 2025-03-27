import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TimeSelect } from "./TimeSelect";
import { render } from "../../test/setup";

describe("TimeSelect", () => {
  it("должен отображать селекты для выбора времени", () => {
    render(
      <TimeSelect
        selectedHour="12"
        selectedMinute="30"
        onHourChange={() => {}}
        onMinuteChange={() => {}}
        disabled={false}
      />,
    );

    expect(screen.getByText("Время:")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Часы" })).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Минуты" }),
    ).toBeInTheDocument();
  });
});

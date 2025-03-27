import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DateTimePicker } from "./DateTimePicker";
import { render } from "../../test/setup";

describe("DateTimePicker", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("должен отображать компоненты выбора даты и времени", () => {
    render(<DateTimePicker value={undefined} onChange={mockOnChange} />);

    expect(screen.getByText("Время:")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Часы" })).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Минуты" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("date-picker")).toBeInTheDocument();
  });

  it("должен корректно отображать начальное значение", () => {
    const initialDate = new Date("2024-03-15T14:30:00");
    render(<DateTimePicker value={initialDate} onChange={mockOnChange} />);

    const hourSelect = screen.getByRole("combobox", { name: "Часы" });
    const minuteSelect = screen.getByRole("combobox", { name: "Минуты" });

    expect(hourSelect).toHaveTextContent("14");
    expect(minuteSelect).toHaveTextContent("30");

    const selectedDay = screen.getByRole("button", { name: /15 марта/ });
    expect(selectedDay).toHaveClass("rdp-day_selected");
  });

  it("должен быть отключен, когда disabled=true", () => {
    render(
      <DateTimePicker value={undefined} onChange={mockOnChange} disabled />,
    );

    const hourSelect = screen.getByRole("combobox", { name: "Часы" });
    const minuteSelect = screen.getByRole("combobox", { name: "Минуты" });
    const datePicker = screen.getByTestId("date-picker");

    expect(hourSelect).toBeDisabled();
    expect(minuteSelect).toBeDisabled();
    expect(datePicker).toHaveAttribute("aria-disabled", "true");
  });

  it("должен вызывать onChange при выборе времени", () => {
    const initialDate = new Date("2024-03-15T00:00:00");
    render(<DateTimePicker value={initialDate} onChange={mockOnChange} />);

    const hourSelect = screen.getByRole("combobox", { name: "Часы" });
    fireEvent.click(hourSelect);
    const hourOption = screen.getByRole("option", { name: "12" });
    fireEvent.click(hourOption);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    const updatedDate = mockOnChange.mock.calls[0][0];
    expect(updatedDate instanceof Date).toBeTruthy();
    expect(updatedDate.getHours()).toBe(12);
  });

  it("должен учитывать minDate при выборе времени", () => {
    const minDate = new Date("2025-03-27T09:09:50.000Z");
    const { container } = render(
      <DateTimePicker
        value={undefined}
        onChange={mockOnChange}
        minDate={minDate}
      />,
    );

    const hourSelect = screen.getByRole("combobox", { name: "Часы" });
    const minuteSelect = screen.getByRole("combobox", { name: "Минуты" });

    expect(hourSelect).toHaveTextContent("16");
    expect(minuteSelect).toHaveTextContent("09");

    const dayBeforeMin = container.querySelector('[data-day="2023-05-15"]');
    console.log(dayBeforeMin);
    expect(dayBeforeMin).toHaveClass("rdp-disabled");
  });

  it("должен корректно отображать значение в инпуте", () => {
    const date = new Date("2025-03-28T00:07:00.000Z");
    render(<DateTimePicker value={date} onChange={mockOnChange} />);

    const hourSelect = screen.getByRole("combobox", { name: "Часы" });
    const minuteSelect = screen.getByRole("combobox", { name: "Минуты" });

    expect(hourSelect).toHaveTextContent("7");
    expect(minuteSelect).toHaveTextContent("07");

    const selectedDay = screen.getByRole("button", { name: /28/ });
    expect(selectedDay).toHaveClass("rdp-day_button");
  });

  it("должен обновлять время при изменении minDate", () => {
    const { rerender } = render(
      <DateTimePicker value={undefined} onChange={mockOnChange} />,
    );

    const hourSelect = screen.getByRole("combobox", { name: "Часы" });
    expect(hourSelect).toHaveTextContent("00");

    const minDate = new Date("2024-03-15T10:30:00");
    rerender(
      <DateTimePicker
        value={undefined}
        onChange={mockOnChange}
        minDate={minDate}
      />,
    );

    expect(hourSelect).toHaveTextContent("10");
    const minuteSelect = screen.getByRole("combobox", { name: "Минуты" });
    expect(minuteSelect).toHaveTextContent("30");
  });
});

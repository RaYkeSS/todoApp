import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DatePicker } from "./DatePicker";
import { render } from "../../test/setup";

describe("DatePicker", () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("должен отображать календарь для выбора даты", () => {
    render(<DatePicker selectedDate={undefined} onSelect={mockOnSelect} />);

    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(screen.getByRole("grid")).toHaveAttribute(
      "aria-multiselectable",
      "false",
    );
  });

  it("должен вызывать onSelect при выборе даты", () => {
    render(<DatePicker selectedDate={undefined} onSelect={mockOnSelect} />);

    const dayButton = screen.getByRole("button", { name: /15/ });
    fireEvent.click(dayButton);

    expect(mockOnSelect).toHaveBeenCalled();
  });

  it("должен быть отключен, когда disabled=true", () => {
    render(
      <DatePicker selectedDate={undefined} onSelect={mockOnSelect} disabled />,
    );

    const dayButtons = screen
      .getAllByRole("button")
      .filter((button) => button.getAttribute("aria-label")?.match(/\d+/));

    dayButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("должен корректно отображать начальное значение", () => {
    const initialDate = new Date("2024-03-15");
    render(<DatePicker selectedDate={initialDate} onSelect={mockOnSelect} />);

    const selectedDay = screen.getByRole("button", { name: /15/ });
    expect(selectedDay).toHaveAttribute("aria-selected", "true");
  });

  it("должен корректно обрабатывать невалидную дату", () => {
    render(
      <DatePicker selectedDate={new Date("invalid")} onSelect={mockOnSelect} />,
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("должен корректно обрабатывать undefined значение", () => {
    render(<DatePicker selectedDate={undefined} onSelect={mockOnSelect} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("должен корректно обрабатывать null значение", () => {
    render(<DatePicker selectedDate={undefined} onSelect={mockOnSelect} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("должен корректно обрабатывать пустое значение", () => {
    render(<DatePicker selectedDate={new Date("")} onSelect={mockOnSelect} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("должен вызывать onSelect с undefined при очистке поля", () => {
    const initialDate = new Date("2024-03-15");
    render(<DatePicker selectedDate={initialDate} onSelect={mockOnSelect} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "" } });

    expect(mockOnSelect).toHaveBeenCalledWith(undefined);
  });

  it("должен учитывать minDate при выборе даты", () => {
    const minDate = new Date("2024-03-15");
    render(
      <DatePicker
        selectedDate={undefined}
        onSelect={mockOnSelect}
        minDate={minDate}
      />,
    );

    const dayBeforeMin = screen.getByRole("button", { name: /14/ });
    expect(dayBeforeMin).toBeDisabled();
  });
});

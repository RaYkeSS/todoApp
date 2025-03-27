import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TimeSelect } from "./TimeSelect";
import { render } from "../../test/setup";
import userEvent from "@testing-library/user-event";

describe("TimeSelect", () => {
  const mockOnHourChange = vi.fn();
  const mockOnMinuteChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("должен отображать селекты для выбора времени", () => {
    render(
      <TimeSelect
        selectedHour="00"
        selectedMinute="00"
        onHourChange={mockOnHourChange}
        onMinuteChange={mockOnMinuteChange}
        disabled={false}
      />,
    );

    expect(screen.getByText("Время:")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Часы" })).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Минуты" }),
    ).toBeInTheDocument();
  });

  it("должен отображать все возможные значения времени", async () => {
    const { container } = render(
      <TimeSelect
        selectedHour="00"
        selectedMinute="00"
        onHourChange={mockOnHourChange}
        onMinuteChange={mockOnMinuteChange}
        disabled={false}
      />,
    );
    screen.debug();

    const hourSelect = container.querySelector(
      '[data-part="trigger"][aria-labelledby*="Часы"]',
    );
    await userEvent.click(hourSelect as HTMLElement);

    // Проверяем наличие всех часов (00-23)
    const hourOptions = container.querySelectorAll('[data-part="item"]');
    expect(hourOptions).toHaveLength(24);
  });

  it("должен отображать выбранные значения", () => {
    render(
      <TimeSelect
        selectedHour="12"
        selectedMinute="30"
        onHourChange={mockOnHourChange}
        onMinuteChange={mockOnMinuteChange}
        disabled={false}
      />,
    );

    const hourSelect = screen.getByRole("combobox", { name: "Часы" });
    const minuteSelect = screen.getByRole("combobox", { name: "Минуты" });

    expect(hourSelect).toHaveTextContent("12");
    expect(minuteSelect).toHaveTextContent("30");
  });

  it("должен быть отключен, когда disabled=true", () => {
    render(
      <TimeSelect
        selectedHour="00"
        selectedMinute="00"
        onHourChange={mockOnHourChange}
        onMinuteChange={mockOnMinuteChange}
        disabled={true}
      />,
    );

    const hourSelect = screen.getByRole("combobox", { name: "Часы" });
    const minuteSelect = screen.getByRole("combobox", { name: "Минуты" });

    expect(hourSelect).toHaveAttribute("aria-disabled", "true");
    expect(minuteSelect).toHaveAttribute("aria-disabled", "true");
  });

  it("должен вызывать onHourChange при выборе часа", async () => {
    const user = userEvent.setup();
    render(
      <TimeSelect
        selectedHour="00"
        selectedMinute="00"
        onHourChange={mockOnHourChange}
        onMinuteChange={mockOnMinuteChange}
        disabled={false}
      />,
    );

    const hourSelect = screen.getByRole("combobox", { name: "Часы" });
    await user.click(hourSelect);

    const hourOption = screen.getByRole("option", { name: "12" });
    await user.click(hourOption);

    expect(mockOnHourChange).toHaveBeenCalledWith({
      value: ["12"],
    });
  });

  it("должен вызывать onMinuteChange при выборе минут", async () => {
    const user = userEvent.setup();
    render(
      <TimeSelect
        selectedHour="00"
        selectedMinute="00"
        onHourChange={mockOnHourChange}
        onMinuteChange={mockOnMinuteChange}
        disabled={false}
      />,
    );

    const minuteSelect = screen.getByRole("combobox", { name: "Минуты" });
    await user.click(minuteSelect);

    const minuteOption = screen.getByRole("option", { name: "30" });
    await user.click(minuteOption);

    expect(mockOnMinuteChange).toHaveBeenCalledWith({
      value: ["30"],
    });
  });

  it("должен вызывать onHourChange и onMinuteChange при изменении значений", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <TimeSelect
        selectedHour="12"
        selectedMinute="30"
        onHourChange={mockOnHourChange}
        onMinuteChange={mockOnMinuteChange}
        disabled={false}
      />,
    );
    screen.debug();

    const hourSelect = container.querySelector(
      '[data-part="trigger"][aria-labelledby*="Часы"]',
    );
    const minuteSelect = container.querySelector(
      '[data-part="trigger"][aria-labelledby*="Минуты"]',
    );

    await user.click(hourSelect as HTMLElement);
    const hourOption = container.querySelector(
      '[data-part="item"][data-value="15"]',
    );
    await user.click(hourOption as HTMLElement);

    await user.click(minuteSelect as HTMLElement);
    const minuteOption = container.querySelector(
      '[data-part="item"][data-value="45"]',
    );
    await user.click(minuteOption as HTMLElement);

    expect(mockOnHourChange).toHaveBeenCalledWith({
      value: ["15"],
      items: [{ label: "15", value: "15" }],
    });
    expect(mockOnMinuteChange).toHaveBeenCalledWith({
      value: ["45"],
      items: [{ label: "45", value: "45" }],
    });
  });
});

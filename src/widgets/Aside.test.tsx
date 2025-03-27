import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { Aside } from "./Aside";

const system = createSystem(defaultConfig);

describe("Aside", () => {
  it("должен отображать кнопку триггера", () => {
    render(
      <ChakraProvider value={system}>
        <Aside />
      </ChakraProvider>,
    );

    expect(screen.getByRole("button")).toBeDefined();
  });

  it("должен открывать Drawer при клике на кнопку", async () => {
    render(
      <ChakraProvider value={system}>
        <Aside />
      </ChakraProvider>,
    );
    await vi.waitFor(() => {
      const triggerButton = screen.getAllByRole("button");
      fireEvent.click(triggerButton[0]);

      expect(screen.getByText("Дополнительная информация")).toBeDefined();
    });
  });

  it("должен закрывать Drawer при клике на кнопку Close", async () => {
    render(
      <ChakraProvider value={system}>
        <Aside />
      </ChakraProvider>,
    );
    const [triggerButton] = screen.getAllByRole("button");

    fireEvent.click(triggerButton);
    await vi.waitFor(() => {
      expect(
        screen.getByText("Дополнительная информация", { selector: "h2" }),
      ).toBeInTheDocument();
    });
    const closeButton = screen.getByText("Закрыть", { selector: "button" });
    fireEvent.click(closeButton);
    await vi.waitFor(() => {
      expect(
        screen.queryByText("Дополнительная информация", { selector: "h2" }),
      ).not.toBeInTheDocument();
    });
  });

  it("должен отображать список функций", async () => {
    render(
      <ChakraProvider value={system}>
        <Aside />
      </ChakraProvider>,
    );

    const [triggerButton] = screen.getAllByRole("button");

    fireEvent.click(triggerButton);
    await vi.waitFor(() => {
      expect(screen.getByText("Drag n drop")).toBeDefined();
      expect(screen.getByText("Смена темы")).toBeDefined();
      expect(screen.getByText("Persist")).toBeDefined();
      expect(screen.getByText("Добавление подзадач")).toBeDefined();
    });

    // Проверяем наличие всех пунктов списка
  });
});

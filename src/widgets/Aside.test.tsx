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

  it("должен открывать Drawer при клике на кнопку", () => {
    render(
      <ChakraProvider value={system}>
        <Aside />
      </ChakraProvider>,
    );

    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);

    expect(screen.getByText("Дополнительная информация")).toBeDefined();
  });

  it("должен закрывать Drawer при клике на кнопку Close", () => {
    render(
      <ChakraProvider value={system}>
        <Aside />
      </ChakraProvider>,
    );

    // Открываем Drawer
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);

    // Находим и кликаем на кнопку закрытия
    const closeButton = screen.getByText("Закрыть");
    fireEvent.click(closeButton);

    // Проверяем, что Drawer закрылся
    expect(screen.queryByText("Дополнительная информация")).toBeNull();
  });

  it("должен отображать список функций", () => {
    render(
      <ChakraProvider value={system}>
        <Aside />
      </ChakraProvider>,
    );

    // Открываем Drawer
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);

    // Проверяем наличие всех пунктов списка
    expect(screen.getByText("Drag n drop")).toBeDefined();
    expect(screen.getByText("Смена темы")).toBeDefined();
    expect(screen.getByText("Persist")).toBeDefined();
    expect(screen.getByText("Добавление подзадач")).toBeDefined();
  });
});

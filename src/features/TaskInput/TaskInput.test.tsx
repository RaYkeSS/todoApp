import { screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TaskInput } from "./TaskInput";
import { useTaskStore } from "../../entities/task/store";
import { render } from "../../test/setup";
import { toaster } from "../../shared/ui/toaster";
import { act } from "react";
import userEvent from "@testing-library/user-event";

vi.mock("../../entities/task/store", () => ({
  useTaskStore: vi.fn(),
}));

vi.mock("../../shared/ui/toaster", () => ({
  toaster: {
    create: vi.fn(),
  },
}));

describe("TaskInput", () => {
  const mockAddTask = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTaskStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector) => selector({ addTask: mockAddTask }),
    );
  });

  it("должен отображать форму для ввода задачи", () => {
    render(<TaskInput />);

    expect(
      screen.getByPlaceholderText("Введите название задачи"),
    ).toBeInTheDocument();
    expect(screen.getByText("Срок выполнения")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("работа, личное, срочно"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Добавить" }),
    ).toBeInTheDocument();
  });

  it("должен показывать ошибку при пустом названии задачи", () => {
    render(<TaskInput />);

    const submitButton = screen.getByRole("button", { name: "Добавить" });
    fireEvent.click(submitButton);

    expect(toaster.create).toHaveBeenCalledWith({
      title: "Название задачи не может быть пустым",
      type: "error",
    });
    expect(mockAddTask).not.toHaveBeenCalled();
  });

  it("должен показывать ошибку при дате в прошлом", async () => {
    const user = userEvent.setup();
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // вчерашняя дата

    render(<TaskInput />);

    // 1. Заполняем название задачи
    const titleInput = screen.getByPlaceholderText("Название задачи");
    await user.type(titleInput, "Тестовая задача");

    // 2. Выбираем тег
    const tagSelect = screen.getByRole("combobox", { name: "Тег" });
    await user.click(tagSelect);
    const tagOption = screen.getByRole("option", { name: "работа" });
    await user.click(tagOption);

    // 3. Устанавливаем дату в прошлом
    const dateInput = screen.getByLabelText("Срок выполнения");
    fireEvent.change(dateInput, {
      target: { value: pastDate.toISOString().split("T")[0] },
    });

    // 4. Выбираем время
    const hourSelect = screen.getByRole("combobox", { name: "Часы" });
    const minuteSelect = screen.getByRole("combobox", { name: "Минуты" });

    await user.click(hourSelect);
    const hourOption = screen.getByRole("option", { name: "12" });
    await user.click(hourOption);

    await user.click(minuteSelect);
    const minuteOption = screen.getByRole("option", { name: "00" });
    await user.click(minuteOption);

    // 5. Нажимаем кнопку добавления
    const addButton = screen.getByRole("button", { name: "Добавить" });
    await user.click(addButton);

    // 6. Проверяем, что появилось сообщение об ошибке
    expect(toaster.create).toHaveBeenCalledWith({
      title: "Срок выполнения не может быть в прошлом",
      type: "error",
    });

    // 7. Проверяем, что задача не была добавлена
    expect(mockAddTask).not.toHaveBeenCalled();
  });

  it("должен успешно создавать задачу с тегами", () => {
    render(<TaskInput />);

    const titleInput = screen.getByPlaceholderText("Введите название задачи");
    const tagsInput = screen.getByPlaceholderText("работа, личное, срочно");

    fireEvent.change(titleInput, { target: { value: "Тестовая задача" } });
    fireEvent.change(tagsInput, { target: { value: "работа, срочно" } });

    const submitButton = screen.getByRole("button", { name: "Добавить" });
    fireEvent.click(submitButton);

    expect(mockAddTask).toHaveBeenCalledWith("Тестовая задача", undefined, [
      "работа",
      "срочно",
    ]);

    expect(toaster.create).toHaveBeenCalledWith({
      title: "Задача успешно добавлена",
      type: "success",
    });

    // Проверяем очистку формы
    expect(titleInput).toHaveValue("");
    expect(tagsInput).toHaveValue("");
  });

  it("должен корректно обрабатывать пустые теги", () => {
    render(<TaskInput />);

    const titleInput = screen.getByPlaceholderText("Введите название задачи");
    const tagsInput = screen.getByPlaceholderText("работа, личное, срочно");

    fireEvent.change(titleInput, { target: { value: "Тестовая задача" } });
    fireEvent.change(tagsInput, { target: { value: "  ,  ,  " } });

    const submitButton = screen.getByRole("button", { name: "Добавить" });
    fireEvent.click(submitButton);

    expect(mockAddTask).toHaveBeenCalledWith("Тестовая задача", undefined, []);
  });
});

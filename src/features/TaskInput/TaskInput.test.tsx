import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TaskInput } from "./TaskInput";
import { useTaskStore } from "../../entities/task/store";
import { render } from "../../test/setup";
import { toaster } from "../../shared/ui/toaster";

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

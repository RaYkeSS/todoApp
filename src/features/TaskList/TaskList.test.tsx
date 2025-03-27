import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TaskList } from "./TaskList";
import { render } from "../../test/setup";
import userEvent from "@testing-library/user-event";
import { useTaskStore } from "../../entities/task/store";

vi.mock("../../entities/task/store", () => ({
  useTaskStore: vi.fn(),
}));

describe("TaskList", () => {
  const mockOnToggleTask = vi.fn();
  const mockOnDeleteTask = vi.fn();
  const mockOnAddSubtask = vi.fn();
  const mockOnToggleSubtask = vi.fn();

  const tasks = [
    {
      id: "1",
      title: "Тестовая задача 1",
      completed: false,
      createdAt: new Date("2025-03-27T19:39:00.000Z"),
      deadline: new Date("2025-03-27T19:39:00.000Z"),
      tags: ["работа"],
      subtasks: [],
      order: 1,
    },
    {
      id: "2",
      title: "Тестовая задача 2",
      completed: false,
      createdAt: new Date("2025-03-27T19:39:00.000Z"),
      deadline: new Date("2025-03-27T19:39:00.000Z"),
      tags: ["личное"],
      subtasks: [],
      order: 2,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useTaskStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector) =>
        selector({
          toggleTask: mockOnToggleTask,
          deleteTask: mockOnDeleteTask,
          addSubtask: mockOnAddSubtask,
          toggleSubtask: mockOnToggleSubtask,
        }),
    );
  });

  it("должен отображать список задач с заголовком", () => {
    render(<TaskList tasks={tasks} title="Активные задачи" type="active" />);

    expect(screen.getByText("Активные задачи (2)")).toBeInTheDocument();
    expect(screen.getByText("Тестовая задача 1")).toBeInTheDocument();
    expect(screen.getByText("Тестовая задача 2")).toBeInTheDocument();
  });

  it("должен отображать кнопку сворачивания/разворачивания", () => {
    render(<TaskList tasks={tasks} title="Активные задачи" type="active" />);

    const toggleButton = screen.getByLabelText("Свернуть");
    expect(toggleButton).toBeInTheDocument();
  });

  it("должен сворачивать/разворачивать список при нажатии на кнопку", async () => {
    const user = userEvent.setup();

    render(<TaskList tasks={tasks} title="Активные задачи" type="active" />);

    // Проверяем, что изначально список свернут
    const taskElements = screen.queryAllByText(/Тестовая задача/);
    expect(taskElements).toHaveLength(0);

    // Разворачиваем список
    const toggleButton = screen.getByLabelText("Развернуть");
    await user.click(toggleButton);

    // Проверяем, что задачи отображаются
    const task1 = screen.getByText("Тестовая задача 1");
    const task2 = screen.getByText("Тестовая задача 2");
    expect(task1).toBeInTheDocument();
    expect(task2).toBeInTheDocument();

    // Сворачиваем список
    const collapseButton = screen.getByLabelText("Свернуть");
    await user.click(collapseButton);

    // Проверяем, что задачи скрыты
    expect(screen.queryByText("Тестовая задача 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Тестовая задача 2")).not.toBeInTheDocument();
  });

  it("должен вызывать toggleTask при нажатии на чекбокс", () => {
    render(<TaskList tasks={tasks} title="Активные задачи" type="active" />);

    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);

    expect(mockOnToggleTask).toHaveBeenCalledWith("1");
  });

  it("должен вызывать deleteTask и показывать уведомление при удалении задачи", () => {
    render(<TaskList tasks={tasks} title="Активные задачи" type="active" />);

    const deleteButton = screen.getAllByRole("button", { name: /удалить/i })[0];
    fireEvent.click(deleteButton);

    expect(mockOnDeleteTask).toHaveBeenCalledWith("1");
  });

  it("должен добавлять подзадачу", async () => {
    const user = userEvent.setup();

    render(<TaskList tasks={tasks} title="Активные задачи" type="active" />);

    // Разворачиваем список
    const toggleButton = screen.getByLabelText("Развернуть");
    await user.click(toggleButton);

    // Показываем подзадачи
    const showSubtasksButton = screen.getAllByText("Показать подзадачи")[0];
    await user.click(showSubtasksButton);

    // Добавляем подзадачу
    const subtaskInput = screen.getByPlaceholderText("Введите подзадачу");
    await user.type(subtaskInput, "Новая подзадача");

    const addSubtaskButton = screen.getByRole("button", { name: "Добавить" });
    await user.click(addSubtaskButton);

    expect(mockOnAddSubtask).toHaveBeenCalledWith("1", "Новая подзадача");
  });

  it("должен фильтровать удаленные задачи", () => {
    const tasksWithDeleted = [
      ...tasks,
      {
        id: "3",
        title: "Удаленная задача",
        completed: false,
        deleted: true,
        deadline: new Date(),
        tags: [],
        subtasks: [],
        createdAt: new Date(),
        order: 3,
      },
    ];

    render(
      <TaskList
        tasks={tasksWithDeleted}
        title="Активные задачи"
        type="active"
      />,
    );

    expect(screen.getByText("Активные задачи (2)")).toBeInTheDocument();
    expect(screen.queryByText("Удаленная задача")).not.toBeInTheDocument();
  });

  it("должен отображать теги задачи", () => {
    render(<TaskList tasks={tasks} title="Активные задачи" type="active" />);

    expect(screen.getByText("работа")).toBeInTheDocument();
    expect(screen.getByText("личное")).toBeInTheDocument();
  });
});

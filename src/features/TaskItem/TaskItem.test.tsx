import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SortableTaskItem } from "./TaskItem";
import { render } from "../../test/setup";

const mockTask = {
  id: "1",
  title: "Тестовая задача",
  completed: false,
  deleted: false,
  deadline: new Date(),
  tags: ["работа", "срочно"],
  subtasks: [
    { id: "1", title: "Подзадача 1", completed: false },
    { id: "2", title: "Подзадача 2", completed: true },
  ],
  createdAt: new Date(),
  order: 1,
};

describe("SortableTaskItem", () => {
  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnToggleSubtask = vi.fn();
  const mockOnAddSubtask = vi.fn();
  const mockSetNewSubtask = vi.fn();
  const mockFormatDate = vi.fn().mockReturnValue("01.01.2024 12:00");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("должен отображать информацию о задаче", () => {
    render(
      <SortableTaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onToggleSubtask={mockOnToggleSubtask}
        onAddSubtask={mockOnAddSubtask}
        newSubtask=""
        setNewSubtask={mockSetNewSubtask}
        activeTaskId={null}
        setActiveTaskId={vi.fn()}
        formatDate={mockFormatDate}
      />,
    );

    expect(screen.getByText("Тестовая задача")).toBeInTheDocument();
    expect(screen.getByText("работа")).toBeInTheDocument();
    expect(screen.getByText("срочно")).toBeInTheDocument();
    expect(
      screen.getByText(/Дата создания: 01\.01\.2024 12:00/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Срок выполнения: 01\.01\.2024 12:00/),
    ).toBeInTheDocument();
  });

  it("должен отображать подзадачи только когда задача активна", () => {
    const { rerender } = render(
      <SortableTaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onToggleSubtask={mockOnToggleSubtask}
        onAddSubtask={mockOnAddSubtask}
        newSubtask=""
        setNewSubtask={mockSetNewSubtask}
        activeTaskId={null}
        setActiveTaskId={vi.fn()}
        formatDate={mockFormatDate}
      />,
    );

    expect(screen.queryByText("Подзадача 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Подзадача 2")).not.toBeInTheDocument();

    rerender(
      <SortableTaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onToggleSubtask={mockOnToggleSubtask}
        onAddSubtask={mockOnAddSubtask}
        newSubtask=""
        setNewSubtask={mockSetNewSubtask}
        activeTaskId={mockTask.id}
        setActiveTaskId={vi.fn()}
        formatDate={mockFormatDate}
      />,
    );

    expect(screen.getByText("Подзадача 1")).toBeInTheDocument();
    expect(screen.getByText("Подзадача 2")).toBeInTheDocument();
  });

  it("должен вызывать onToggle при нажатии на чекбокс", () => {
    render(
      <SortableTaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onToggleSubtask={mockOnToggleSubtask}
        onAddSubtask={mockOnAddSubtask}
        newSubtask=""
        setNewSubtask={mockSetNewSubtask}
        activeTaskId={null}
        setActiveTaskId={vi.fn()}
        formatDate={mockFormatDate}
      />,
    );

    const checkbox = screen.getByLabelText(mockTask.title);
    fireEvent.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledWith("1");
  });

  it("должен вызывать onDelete при нажатии на кнопку удаления", () => {
    render(
      <SortableTaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onToggleSubtask={mockOnToggleSubtask}
        onAddSubtask={mockOnAddSubtask}
        newSubtask=""
        setNewSubtask={mockSetNewSubtask}
        activeTaskId={null}
        setActiveTaskId={vi.fn()}
        formatDate={mockFormatDate}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: /удалить/i });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });

  it("должен вызывать onToggleSubtask при нажатии на чекбокс подзадачи", () => {
    render(
      <SortableTaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onToggleSubtask={mockOnToggleSubtask}
        onAddSubtask={mockOnAddSubtask}
        newSubtask=""
        setNewSubtask={mockSetNewSubtask}
        activeTaskId={mockTask.id}
        setActiveTaskId={vi.fn()}
        formatDate={mockFormatDate}
      />,
    );

    const subtaskText = screen.getByText("Подзадача 1");
    const subtaskCheckbox = subtaskText.closest("label");
    expect(subtaskCheckbox).not.toBeNull();
    fireEvent.click(subtaskCheckbox!);

    expect(mockOnToggleSubtask).toHaveBeenCalledWith("1", "1");
  });

  it("должен добавлять новую подзадачу", () => {
    render(
      <SortableTaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onToggleSubtask={mockOnToggleSubtask}
        onAddSubtask={mockOnAddSubtask}
        newSubtask="Новая подзадача"
        setNewSubtask={mockSetNewSubtask}
        activeTaskId={mockTask.id}
        setActiveTaskId={vi.fn()}
        formatDate={mockFormatDate}
      />,
    );

    const addButton = screen.getByRole("button", { name: "Добавить" });
    fireEvent.click(addButton);

    expect(mockOnAddSubtask).toHaveBeenCalledWith("1");
  });

  it("должен отображать кнопку добавления подзадачи только для активной задачи", () => {
    render(
      <SortableTaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onToggleSubtask={mockOnToggleSubtask}
        onAddSubtask={mockOnAddSubtask}
        newSubtask=""
        setNewSubtask={mockSetNewSubtask}
        activeTaskId="1"
        setActiveTaskId={vi.fn()}
        formatDate={mockFormatDate}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Скрыть подзадачи" }),
    ).toBeInTheDocument();

    render(
      <SortableTaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onToggleSubtask={mockOnToggleSubtask}
        onAddSubtask={mockOnAddSubtask}
        newSubtask=""
        setNewSubtask={mockSetNewSubtask}
        activeTaskId="2"
        setActiveTaskId={vi.fn()}
        formatDate={mockFormatDate}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Показать подзадачи" }),
    ).toBeInTheDocument();
  });
});

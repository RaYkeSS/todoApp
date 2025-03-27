import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { VStack } from "@chakra-ui/react";
import { TaskList } from "../features/TaskList/TaskList.tsx";
import { SortableTaskItem } from "../features/TaskItem/TaskItem.tsx";
import { useTaskStore } from "../entities/task/store.ts";
import { useState } from "react";

export const DndTaskList = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const updateTask = useTaskStore((state) => state.updateTask);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newSubtask, setNewSubtask] = useState("");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;
    const isOverCompleted = overId === "completed";
    const isOverActive = overId === "active";

    if (isOverCompleted || isOverActive) {
      const newCompleted = isOverCompleted;
      const targetTasks = tasks.filter(
        (task) => task.completed === newCompleted && !task.deleted,
      );
      const newOrder = targetTasks.length;

      // Обновляем активную задачу
      updateTask(activeTask.id, {
        ...activeTask,
        completed: newCompleted,
        order: newOrder,
      });

      // Обновляем порядок остальных задач
      targetTasks.forEach((task, index) => {
        if (task.id !== activeTask.id) {
          updateTask(task.id, {
            ...task,
            order: index,
          });
        }
      });
    } else {
      // Если задача перетаскивается над другой задачей
      const overTask = tasks.find((task) => task.id === overId);
      if (!overTask) return;

      // Получаем все задачи в текущей категории (активные или выполненные)
      const currentCategoryTasks = tasks
        .filter(
          (task) => task.completed === activeTask.completed && !task.deleted,
        )
        .sort((a, b) => a.order - b.order);

      // Находим индексы в отсортированном массиве
      const oldIndex = currentCategoryTasks.findIndex(
        (task) => task.id === activeTask.id,
      );
      const newIndex = currentCategoryTasks.findIndex(
        (task) => task.id === overTask.id,
      );

      if (oldIndex === -1 || newIndex === -1) return;

      // Создаем новый массив с обновленным порядком
      const updatedTasks = [...currentCategoryTasks];
      const [movedTask] = updatedTasks.splice(oldIndex, 1);
      updatedTasks.splice(newIndex, 0, movedTask);

      // Обновляем порядок только для задач, которые действительно изменили позицию
      updatedTasks.forEach((task, index) => {
        if (task.order !== index) {
          updateTask(task.id, {
            ...task,
            order: index,
          });
        }
      });
    }
  };

  const activeTask = tasks.find(
    (task) => task.id === activeId && !task.deleted,
  );

  const formatDate = (date: Date | undefined) => {
    if (!date) return null;
    return date.toLocaleString();
  };

  const filteredTasks = tasks.filter((task) => !task.deleted);
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <VStack gap={8} align="stretch">
        <TaskList
          type="active"
          title="Активные задачи"
          tasks={filteredTasks
            .filter((task) => !task.completed)
            .sort((a, b) => a.order - b.order)}
        />
        <TaskList
          type="completed"
          title="Выполненные задачи"
          tasks={filteredTasks
            .filter((task) => task.completed)
            .sort((a, b) => a.order - b.order)}
        />
      </VStack>
      <DragOverlay>
        {activeTask && (
          <SortableTaskItem
            task={activeTask}
            onToggle={(id) => {
              const task = tasks.find((t) => t.id === id);
              if (task) {
                updateTask(id, {
                  ...task,
                  completed: !task.completed,
                });
              }
            }}
            onDelete={(id) => {
              const task = tasks.find((t) => t.id === id);
              if (task) {
                updateTask(id, {
                  ...task,
                  deleted: true,
                });
              }
            }}
            onToggleSubtask={(taskId, subtaskId) => {
              const task = tasks.find((t) => t.id === taskId);
              if (task) {
                const subtasks = task.subtasks?.map((subtask) =>
                  subtask.id === subtaskId
                    ? { ...subtask, completed: !subtask.completed }
                    : subtask,
                );
                updateTask(taskId, {
                  ...task,
                  subtasks,
                });
              }
            }}
            onAddSubtask={(taskId) => {
              if (!newSubtask.trim()) return;
              const task = tasks.find((t) => t.id === taskId);
              if (task) {
                const subtasks = [
                  ...(task.subtasks || []),
                  {
                    id: Date.now().toString(),
                    title: newSubtask,
                    completed: false,
                  },
                ];
                updateTask(taskId, {
                  ...task,
                  subtasks,
                });
                setNewSubtask("");
              }
            }}
            newSubtask={newSubtask}
            setNewSubtask={setNewSubtask}
            activeTaskId={activeTaskId}
            setActiveTaskId={setActiveTaskId}
            formatDate={formatDate}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default DndTaskList;

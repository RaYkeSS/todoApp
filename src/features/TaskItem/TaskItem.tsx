import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Badge,
  Button,
  Input,
  Checkbox,
} from "@chakra-ui/react";
import { FiTrash2, FiMenu } from "react-icons/fi";
import { Task } from "../../entities/task/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableTaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string) => void;
  newSubtask: string;
  setNewSubtask: (value: string) => void;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  formatDate: (date: Date | undefined) => string | null;
}

export const SortableTaskItem = ({
  task,
  onToggle,
  onDelete,
  onToggleSubtask,
  onAddSubtask,
  newSubtask,
  setNewSubtask,
  activeTaskId,
  setActiveTaskId,
  formatDate,
}: SortableTaskItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const deadlineDate = task.deadline ? new Date(task.deadline) : undefined;
  const createdAt = task.createdAt ? new Date(task.createdAt) : undefined;
  console.log(task);
  console.log(formatDate(deadlineDate));

  return (
    <Box
      ref={setNodeRef}
      style={style}
      p={4}
      borderWidth={1}
      borderRadius="lg"
      opacity={isDragging ? 0.5 : 1}
      boxShadow={isDragging ? "lg" : "none"}
    >
      <VStack align="stretch" gap={2}>
        <HStack justify="space-between">
          <HStack>
            <Box
              {...attributes}
              {...listeners}
              cursor="grab"
              _active={{ cursor: "grabbing" }}
            >
              <FiMenu />
            </Box>
            <Checkbox.Root
              checked={task.completed}
              onChange={() => onToggle(task.id)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                <Text
                  textDecoration={task.completed ? "line-through" : "none"}
                  color={task.completed ? "gray.500" : "inherit"}
                  // onClick={() => onToggle(task.id)}
                  cursor="pointer"
                >
                  {task.title}
                </Text>
              </Checkbox.Label>
            </Checkbox.Root>
          </HStack>
          <IconButton
            aria-label="Удалить"
            onClick={() => onDelete(task.id)}
            size="xl"
            colorPalette="red"
          >
            <FiTrash2 />
          </IconButton>
        </HStack>

        {createdAt && (
          <Badge colorPalette="purple" variant="surface">
            Дата создания: {formatDate(createdAt)}
          </Badge>
        )}

        {deadlineDate && (
          <Badge colorPalette="blue" variant="surface">
            Срок выполнения: {formatDate(deadlineDate)}
          </Badge>
        )}

        {task.tags.length > 0 && (
          <HStack>
            {task.tags.map((tag) => (
              <Badge colorPalette="yellow" key={tag}>
                {tag}
              </Badge>
            ))}
          </HStack>
        )}

        <Box>
          <Button
            size="sm"
            onClick={() =>
              setActiveTaskId(activeTaskId === task.id ? null : task.id)
            }
          >
            {activeTaskId === task.id
              ? "Скрыть подзадачи"
              : "Показать подзадачи"}
          </Button>

          {activeTaskId === task.id && (
            <VStack mt={2} align="stretch">
              {task.subtasks.map((subtask) => (
                <Checkbox.Root
                  key={subtask.id}
                  checked={subtask.completed}
                  onClick={() => onToggleSubtask(task.id, subtask.id)}
                >
                  <Checkbox.Control />
                  <Checkbox.Label>
                    <Text
                      // key={subtask.id}
                      textDecoration={
                        subtask.completed ? "line-through" : "none"
                      }
                      color={subtask.completed ? "gray.500" : "inherit"}
                      // onClick={() => onToggleSubtask(task.id, subtask.id)}
                      cursor="pointer"
                    >
                      {subtask.title}
                    </Text>
                  </Checkbox.Label>
                </Checkbox.Root>
              ))}

              <HStack>
                <Input
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Новая подзадача"
                />
                <Button size="sm" onClick={() => onAddSubtask(task.id)}>
                  Добавить
                </Button>
              </HStack>
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

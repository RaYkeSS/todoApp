import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Checkbox,
  IconButton,
  Badge,
  useDisclosure,
  Button,
  Input,
} from "@chakra-ui/react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { format, isValid } from "date-fns";
import { ru } from "date-fns/locale";
import { Task } from "../../entities/task/types";
import { useTaskStore } from "../../entities/task/store";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTaskItem } from "../TaskItem/TaskItem";
import { toaster } from "../../shared/ui/toaster";

interface TaskListProps {
  tasks: Task[];
  title: string;
  type: "active" | "completed";
}

export const TaskList = ({ tasks, title, type }: TaskListProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [newSubtask, setNewSubtask] = useState("");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const toggleTask = useTaskStore((state) => state.toggleTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const addSubtask = useTaskStore((state) => state.addSubtask);
  const toggleSubtask = useTaskStore((state) => state.toggleSubtask);

  const handleAddSubtask = (taskId: string) => {
    if (!newSubtask.trim()) return;
    addSubtask(taskId, newSubtask);
    setNewSubtask("");
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    toaster.create({
      title: "Задача успешно удалена",
      type: "warning",
    });
  };

  const formatDate = (date: Date | undefined) => {
    if (!date || !isValid(date)) return null;
    return format(date, "PPp", { locale: ru });
  };

  const filteredTasks = tasks.filter((task) => !task.deleted);
  const items = filteredTasks.map((task) => task.id);

  const Icon = isOpen ? FiChevronUp : FiChevronDown;

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          {title} ({filteredTasks.length})
        </Text>
        <IconButton
          aria-label={isOpen ? "Свернуть" : "Развернуть"}
          as={Icon}
          onClick={() => setIsOpen(!isOpen)}
          size="sm"
        />
      </HStack>

      {isOpen && (
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <VStack gap={2} align="stretch">
            {filteredTasks.map((task) => (
              <SortableTaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={handleDeleteTask}
                onToggleSubtask={toggleSubtask}
                onAddSubtask={handleAddSubtask}
                newSubtask={newSubtask}
                setNewSubtask={setNewSubtask}
                activeTaskId={activeTaskId}
                setActiveTaskId={setActiveTaskId}
                formatDate={formatDate}
              />
            ))}
          </VStack>
        </SortableContext>
      )}
    </Box>
  );
};

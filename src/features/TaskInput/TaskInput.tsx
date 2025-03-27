import { useState } from "react";
import { Box, Input, Button, VStack, Text, HStack } from "@chakra-ui/react";
import { useTaskStore } from "@entities/task/store";
import { format } from "date-fns";
import { toaster } from "@shared/ui/toaster";
import "react-day-picker/style.css";
import { Popover } from "@chakra-ui/react";
import { DateTimePicker } from "@shared/ui/DateTimePicker";

export const TaskInput = () => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState("");
  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toaster.create({
        title: "Название задачи не может быть пустым",
        type: "error",
      });
      return;
    }

    const parsedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const deadlineDate = deadline ? new Date(deadline) : undefined;
    if (deadlineDate && deadlineDate < new Date()) {
      toaster.create({
        title: "Срок выполнения не может быть в прошлом",
        type: "error",
      });
      return;
    }

    addTask(title, deadlineDate, parsedTags);

    setTitle("");
    setDeadline(undefined);
    setTags("");
    toaster.create({
      title: "Задача успешно добавлена",
      type: "success",
    });
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      p={4}
      borderWidth={1}
      borderRadius="lg"
    >
      <VStack gap={4}>
        <Box width="100%">
          <Text mb={2} fontWeight="bold">
            Новая задача
          </Text>
          <HStack>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название задачи"
            />
            <Button h="1.75rem" size="sm" type="submit">
              Добавить
            </Button>
          </HStack>
        </Box>

        <Box width="100%">
          <Text mb={2} fontWeight="bold">
            Срок выполнения
          </Text>

          <Popover.Root>
            <Popover.Trigger>
              <Input
                value={
                  deadline ? format(new Date(deadline), "dd.MM.yyyy HH:mm") : ""
                }
                readOnly
                aria-label="срок выполнения"
              />
            </Popover.Trigger>
            <Popover.Content p={4}>
              <DateTimePicker
                value={deadline}
                onChange={setDeadline}
                minDate={new Date()}
              />
            </Popover.Content>
          </Popover.Root>
        </Box>

        <Box width="100%">
          <Text mb={2} fontWeight="bold">
            Теги (через запятую)
          </Text>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="работа, личное, срочно"
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default TaskInput;

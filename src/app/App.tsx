import { Box, Container, VStack } from "@chakra-ui/react";

import { TaskInput } from "../features/TaskInput/TaskInput";
import { Header } from "../widgets/Header.tsx";
import { DndTaskList } from "../widgets/DndTaskList.tsx";
import { Aside } from "../widgets/Aside.tsx";

export const App = () => {
  return (
    <Box minH="100vh" py={8} pt={16}>
      <Container maxW="container.md">
        <VStack gap={8} align="stretch">
          <Header />
          <Aside />
          <TaskInput />
          <DndTaskList />
        </VStack>
      </Container>
    </Box>
  );
};

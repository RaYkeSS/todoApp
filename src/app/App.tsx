import { Box, Container, VStack } from "@chakra-ui/react";
import { lazy, Suspense } from "react";
import { AppSkeleton } from "./AppSkeleton";

const TaskInput = lazy(() =>
  import("@features/TaskInput/TaskInput").then((module) => ({
    default: module.TaskInput,
  })),
);
const Header = lazy(() =>
  import("@widgets/Header").then((module) => ({ default: module.Header })),
);
const DndTaskList = lazy(() =>
  import("@widgets/DndTaskList").then((module) => ({
    default: module.DndTaskList,
  })),
);
const Aside = lazy(() =>
  import("@widgets/Aside").then((module) => ({ default: module.Aside })),
);

const AppContent = () => (
  <VStack gap={8} align="stretch">
    <Header />
    <Aside />
    <TaskInput />
    <DndTaskList />
  </VStack>
);

export const App = () => {
  return (
    <Box minH="100vh" py={8} pt={16}>
      <Container maxW="container.md">
        <Suspense fallback={<AppSkeleton />}>
          <AppContent />
        </Suspense>
      </Container>
    </Box>
  );
};

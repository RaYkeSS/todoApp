import { Button, Drawer, List } from "@chakra-ui/react";
import { RiExpandLeftLine, RiExpandRightLine } from "react-icons/ri";
import { useState } from "react";
import { LuCircleCheck } from "react-icons/lu";

export const Aside = () => {
  const [open, setOpen] = useState(false);
  return (
    <Drawer.Root size="xs" open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.CloseTrigger />
          <Drawer.Header>
            <Drawer.Title>Дополнительная информация</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <List.Root gap="2" variant="plain" align="center">
              <List.Item>
                <List.Indicator asChild color="green.500">
                  <LuCircleCheck />
                </List.Indicator>
                Drag n drop
              </List.Item>
              <List.Item>
                <List.Indicator asChild color="green.500">
                  <LuCircleCheck />
                </List.Indicator>
                Смена темы
              </List.Item>
              <List.Item>
                <List.Indicator asChild color="green.500">
                  <LuCircleCheck />
                </List.Indicator>
                Persist
              </List.Item>
              <List.Item>
                <List.Indicator asChild color="green.500">
                  <LuCircleCheck />
                </List.Indicator>
                Добавление подзадач
              </List.Item>
            </List.Root>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="outline" size="xl" onClick={() => setOpen(!open)}>
              Закрыть
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
      <Drawer.Trigger asChild>
        <Button
          variant="outline"
          size="xl"
          position="fixed"
          right={open ? "320px" : 0}
          top={0}
          zIndex={2}
          borderRadius={open ? "20px 0 0 20px" : "20px 0 0 20px"}
        >
          {open ? <RiExpandLeftLine /> : <RiExpandRightLine />}
        </Button>
      </Drawer.Trigger>
    </Drawer.Root>
  );
};

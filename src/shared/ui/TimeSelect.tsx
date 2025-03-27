import {
  Box,
  Text,
  Select,
  createListCollection,
  HStack,
} from "@chakra-ui/react";

const generateTimeOptions = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const value = i.toString().padStart(2, "0");
    return { label: value, value };
  });
};

const hourOptions = createListCollection({
  items: generateTimeOptions(24),
});

const minuteOptions = createListCollection({
  items: generateTimeOptions(60),
});

interface TimeSelectProps {
  selectedHour: string;
  selectedMinute: string;
  onHourChange: (details: { value: string[] }) => void;
  onMinuteChange: (details: { value: string[] }) => void;
  disabled: boolean;
}

export const TimeSelect = ({
  selectedHour,
  selectedMinute,
  onHourChange,
  onMinuteChange,
  disabled,
}: TimeSelectProps) => {
  return (
    <Box mb={4}>
      <Text mb={2}>Время:</Text>
      <HStack gap={2}>
        <Box flex={1}>
          <Select.Root
            value={[selectedHour]}
            onValueChange={onHourChange}
            collection={hourOptions}
            disabled={disabled}
            positioning={{
              strategy: "fixed",
              gutter: 4,
              placement: "bottom",
              sameWidth: true,
            }}
          >
            <Select.HiddenSelect />
            <Select.Label>Часы</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="00">
                  {selectedHour}
                </Select.ValueText>
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                {hourOptions.items.map((hour) => (
                  <Select.Item key={hour.value} item={hour}>
                    {hour.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </Box>

        <Text>:</Text>

        <Box flex={1}>
          <Select.Root
            value={[selectedMinute]}
            onValueChange={onMinuteChange}
            collection={minuteOptions}
            disabled={disabled}
            positioning={{
              strategy: "fixed",
              gutter: 4,
              placement: "bottom",
              sameWidth: true,
            }}
          >
            <Select.HiddenSelect />
            <Select.Label>Минуты</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="00">
                  {selectedMinute}
                </Select.ValueText>
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                {minuteOptions.items.map((minute) => (
                  <Select.Item key={minute.value} item={minute}>
                    {minute.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </Box>
      </HStack>
    </Box>
  );
};

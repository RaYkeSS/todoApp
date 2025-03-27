import { Box } from "@chakra-ui/react";
import { DayPicker } from "react-day-picker";
import { ru } from "react-day-picker/locale";
import "react-day-picker/dist/style.css";

interface DatePickerProps {
  selectedDate?: Date;
  onSelect: (date: Date | undefined) => void;
  minDate?: Date;
  disabled?: boolean;
}

export const DatePicker = ({
  selectedDate,
  onSelect,
  minDate,
  disabled,
}: DatePickerProps) => {
  return (
    <Box>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        disabled={disabled || (minDate ? { before: minDate } : undefined)}
        locale={ru}
        data-testid="date-picker"
      />
    </Box>
  );
};

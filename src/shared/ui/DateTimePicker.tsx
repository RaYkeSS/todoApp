import { useState, useEffect } from "react";
import { format, isValid, isBefore } from "date-fns";
import { Box } from "@chakra-ui/react";
import { TimeSelect } from "./TimeSelect";
import { DatePicker } from "./DatePicker";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  minDate?: Date;
}

export const DateTimePicker = ({
  value,
  onChange,
  disabled = false,
  minDate,
}: DateTimePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [selectedHour, setSelectedHour] = useState(
    minDate ? format(minDate, "HH") : "00"
  );
  const [selectedMinute, setSelectedMinute] = useState(
    minDate ? format(minDate, "mm") : "00"
  );

  const updateDateTime = (
    date: Date | undefined,
    hour: string,
    minute: string
  ) => {
    if (!date) {
      onChange?.(undefined);
      return;
    }

    const newDate = new Date(date);
    newDate.setHours(parseInt(hour), parseInt(minute));

    if (minDate && isBefore(newDate, minDate)) {
      const adjustedDate = new Date(minDate);
      setSelectedHour(format(adjustedDate, "HH"));
      setSelectedMinute(format(adjustedDate, "mm"));
      onChange?.(adjustedDate);
    } else {
      onChange?.(newDate);
    }
  };

  const handleDaySelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      updateDateTime(date, selectedHour, selectedMinute);
    } else {
      const newHour = minDate ? format(minDate, "HH") : "00";
      const newMinute = minDate ? format(minDate, "mm") : "00";
      setSelectedHour(newHour);
      setSelectedMinute(newMinute);
      onChange?.(undefined);
    }
  };

  const handleHourChange = (details: { value: string[] }) => {
    const newHour = details.value[0];
    setSelectedHour(newHour);
    if (selectedDate) {
      updateDateTime(selectedDate, newHour, selectedMinute);
    } else if (minDate) {
      const newDate = new Date(minDate);
      newDate.setHours(parseInt(newHour), parseInt(selectedMinute));
      if (!isBefore(newDate, minDate)) {
        onChange?.(newDate);
        setSelectedDate(newDate);
      }
    }
  };

  const handleMinuteChange = (details: { value: string[] }) => {
    const newMinute = details.value[0];
    setSelectedMinute(newMinute);
    if (selectedDate) {
      updateDateTime(selectedDate, selectedHour, newMinute);
    } else if (minDate) {
      const newDate = new Date(minDate);
      newDate.setHours(parseInt(selectedHour), parseInt(newMinute));
      if (!isBefore(newDate, minDate)) {
        onChange?.(newDate);
        setSelectedDate(newDate);
      }
    }
  };

  useEffect(() => {
    if (value && isValid(value)) {
      setSelectedDate(value);
      setSelectedHour(format(value, "HH"));
      setSelectedMinute(format(value, "mm"));
    } else {
      setSelectedDate(undefined);
      setSelectedHour(minDate ? format(minDate, "HH") : "00");
      setSelectedMinute(minDate ? format(minDate, "mm") : "00");
    }
  }, [value, minDate]);

  return (
    <Box width="100%">
      <TimeSelect
        selectedHour={selectedHour}
        selectedMinute={selectedMinute}
        onHourChange={handleHourChange}
        onMinuteChange={handleMinuteChange}
        disabled={disabled}
      />
      <DatePicker
        selectedDate={selectedDate}
        onSelect={handleDaySelect}
        minDate={minDate}
        disabled={disabled}
      />
    </Box>
  );
};

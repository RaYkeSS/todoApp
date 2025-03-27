export const generateTimeOptions = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      label: i.toString().padStart(2, "0"),
      value: i.toString().padStart(2, "0")
    }));
  };
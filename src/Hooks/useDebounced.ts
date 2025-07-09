import { useEffect, useState } from "react";

export const useDebounced = (str: string) => {
  const [debouncedValue, setDebouncedValue] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(str);
    }, 500);

    return () => clearTimeout(timeout);
  }, [str]);

  return debouncedValue;
};

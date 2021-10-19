import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, defaultValue?: T) {
  const [state, setState] = useState<string | undefined>(() => {
    let value: string | undefined;
    try {
      value = JSON.parse(
        window.localStorage.getItem(key) || JSON.stringify(defaultValue)
      );
    } catch (e) {
      if (typeof defaultValue === "undefined") {
        value = defaultValue;
      } else {
        value = JSON.stringify(defaultValue);
      }
    }
    return value;
  });

  useEffect(() => {
    if (!state) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, state);
    }
  }, [key, state]);

  return [state, setState] as const;
}

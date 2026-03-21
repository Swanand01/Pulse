import { useState } from "react";

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (valueOrFn: T | ((val: T) => T)) => void] {
  function getLocalStorageValue(): T {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        return JSON.parse(value) as T;
      }
    } catch (error) {
      console.error(error);
    }

    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }

  const [localStorageValue, setLocalStorageValue] = useState<T>(() => {
    return getLocalStorageValue();
  });

  function setLocalStorageStateValue(valueOrFn: T | ((val: T) => T)): void {
    const newValue =
      typeof valueOrFn === "function"
        ? (valueOrFn as (val: T) => T)(localStorageValue)
        : valueOrFn;

    localStorage.setItem(key, JSON.stringify(newValue));
    setLocalStorageValue(newValue);
  }

  return [localStorageValue, setLocalStorageStateValue];
}

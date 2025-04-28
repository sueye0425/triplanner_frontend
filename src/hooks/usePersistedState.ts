import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export function usePersistedState<T>(
  key: string,
  initialValue: T,
  serialize: (value: T) => string = JSON.stringify,
  deserialize: (value: string) => T = JSON.parse
): [T, Dispatch<SetStateAction<T>>] {
  // Initialize state from localStorage or use initial value
  const [state, setState] = useState<T>(() => {
    const persistedValue = localStorage.getItem(key);
    if (persistedValue !== null) {
      try {
        return deserialize(persistedValue);
      } catch (error) {
        console.error(`Error deserializing state for key "${key}":`, error);
        return initialValue;
      }
    }
    return initialValue;
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      if (state === null || state === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, serialize(state));
      }
    } catch (error) {
      console.error(`Error serializing state for key "${key}":`, error);
    }
  }, [key, state, serialize]);

  return [state, setState];
}
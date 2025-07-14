import { useState } from 'react';

// Hook for boolean toggle states (useState(false))
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = () => setValue(!value);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  
  return { value, setValue, toggle, setTrue, setFalse };
};

// Hook for string input states (useState(''))
export const useInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  
  const reset = () => setValue(initialValue);
  const clear = () => setValue('');
  
  return { value, setValue, reset, clear };
};

// Hook for optional/null states (useState(null))
export const useOptional = <T>(initialValue: T | null = null) => {
  const [value, setValue] = useState<T | null>(initialValue);
  
  const clear = () => setValue(null);
  
  return { value, setValue, clear };
};

// Hook for loading states
export const useLoading = (initialValue = false) => {
  const [isLoading, setIsLoading] = useState(initialValue);
  
  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);
  
  return { isLoading, setIsLoading, startLoading, stopLoading };
}; 
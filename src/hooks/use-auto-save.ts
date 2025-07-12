import { useEffect, useRef } from 'react';
import { useFormStore } from '@/lib/store';

export function useAutoSave() {
  const {
    isDirty,
    autoSaveEnabled,
    saveForm,
    getAutoSaveData,
    loadAutoSaveData,
    fields,
  } = useFormStore();

  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSaveRef = useRef<number>(0);

  // Auto-save effect
  useEffect(() => {
    if (!autoSaveEnabled || !isDirty || fields.length === 0) return;

    // Debounce auto-save to avoid excessive saves
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const now = Date.now();
      // Only save if it's been at least 2 seconds since last save
      if (now - lastSaveRef.current > 2000) {
        saveForm();
        lastSaveRef.current = now;
      }
    }, 1000); // Wait 1 second after last change

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isDirty, autoSaveEnabled, fields, saveForm]);

  // Check for auto-save data on mount
  useEffect(() => {
    const autoSaveData = getAutoSaveData();
    if (autoSaveData && fields.length === 0) {
      // Show recovery dialog
      const shouldRecover = confirm(
        `We found an auto-saved form from ${new Date(autoSaveData.timestamp).toLocaleString()}. Would you like to recover it?`
      );

      if (shouldRecover) {
        loadAutoSaveData(autoSaveData);
      } else {
        // Clear the auto-save data if user doesn't want to recover
        localStorage.removeItem('formkit-autosave');
      }
    }
  }, [getAutoSaveData, loadAutoSaveData, fields.length]);

  // Save before page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && fields.length > 0) {
        saveForm();
        // Show warning if form is dirty
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, fields.length, saveForm]);

  return {
    isDirty,
    autoSaveEnabled,
    saveForm,
    getAutoSaveData,
    loadAutoSaveData,
  };
}

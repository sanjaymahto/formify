import { useEffect, useRef } from 'react';
import { useFormStore } from '@/lib/store';
import { showToast } from '@/lib/utils';

export function useAutoSave() {
  const isDirty = useFormStore(state => state.isDirty);
  const autoSaveEnabled = useFormStore(state => state.autoSaveEnabled);
  const isLoadingForm = useFormStore(state => state.isLoadingForm);
  const saveForm = useFormStore(state => state.saveForm);
  const fields = useFormStore(state => state.fields);

  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastSaveRef = useRef<number>(0);

  // Auto-save effect
  useEffect(() => {
    if (!autoSaveEnabled || !isDirty || fields.length === 0 || isLoadingForm)
      return;

    // Debounce auto-save to avoid excessive saves
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const now = Date.now();
      // Only save if it's been at least 2 seconds since last save
      if (now - lastSaveRef.current > 2000) {
        // Auto-save without a name (will be marked as auto-save)
        saveForm();
        lastSaveRef.current = now;
        showToast('Form auto-saved', 'info');
      }
    }, 1000); // Wait 1 second after last change

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isDirty, autoSaveEnabled, fields, saveForm]);

  // Auto-save data is now handled by the saved forms section in canvas
  // No recovery dialog needed

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
  };
}

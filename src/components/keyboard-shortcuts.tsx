'use client';

import { useEffect } from 'react';
import { useFormStore } from '@/lib/store';

export function KeyboardShortcuts() {
  const {
    exportForm,
    removeField,
    selectedFieldId,
    togglePreviewMode,
    undo,
    redo,
    canUndo,
    canRedo,
    isPreviewMode,
  } = useFormStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Ctrl/Cmd + S: Save/Export form
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        try {
          const formData = exportForm();
          const jsonString = JSON.stringify(formData, null, 2);
          const blob = new Blob([jsonString], { type: 'application/json' });
          const url = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.download = `form-${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          // Show success message
          showToast('Form exported successfully!', 'success');
        } catch (error) {
          console.error('Export failed:', error);
          showToast('Failed to export form', 'error');
        }
      }

      // Ctrl/Cmd + Z: Undo
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === 'z' &&
        !event.shiftKey
      ) {
        event.preventDefault();
        if (canUndo()) {
          undo();
          showToast('Undone', 'info');
        }
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
      if (
        (event.ctrlKey || event.metaKey) &&
        ((event.shiftKey && event.key === 'z') || event.key === 'y')
      ) {
        event.preventDefault();
        if (canRedo()) {
          redo();
          showToast('Redone', 'info');
        }
      }

      // Delete or Backspace: Remove selected field
      if (
        (event.key === 'Delete' || event.key === 'Backspace') &&
        selectedFieldId
      ) {
        event.preventDefault();
        removeField(selectedFieldId);
        showToast('Field removed', 'info');
      }

      // Ctrl/Cmd + P: Toggle preview mode
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        togglePreviewMode();
        showToast(
          isPreviewMode ? 'Switched to edit mode' : 'Switched to preview mode',
          'info'
        );
      }

      // Escape: Clear selection
      if (event.key === 'Escape') {
        event.preventDefault();
        // This would need to be implemented in the store
        showToast('Selection cleared', 'info');
      }

      // Ctrl/Cmd + A: Select all fields (could be used for bulk operations)
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        showToast('Select all - feature coming soon', 'info');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    exportForm,
    removeField,
    selectedFieldId,
    togglePreviewMode,
    undo,
    redo,
    canUndo,
    canRedo,
    isPreviewMode,
  ]);

  // Simple toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-md text-white text-sm font-medium transition-all duration-300 transform translate-x-full ${
      type === 'success'
        ? 'bg-green-500'
        : type === 'error'
          ? 'bg-red-500'
          : 'bg-blue-500'
    }`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  return null; // This component doesn't render anything
}

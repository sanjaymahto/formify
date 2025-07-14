import { Field } from '@/lib/store';

export function setupKeyboardHandlers(
  fields: Field[],
  selectedFieldId: string | null,
  setSelectedField: (id: string | null) => void,
  removeField: (id: string) => void,
  addField: (field: Partial<Field>, index?: number) => void,
  moveField: (fieldId: string, newIndex: number) => void,
  scrollToField: (fieldId: string) => void,
  setShowKeyboardShortcuts: (show: boolean) => void
) {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Don't handle keyboard shortcuts when typing in input fields
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return;
    }

    const currentIndex = selectedFieldId
      ? fields.findIndex(f => f.id === selectedFieldId)
      : -1;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          const prevField = fields[currentIndex - 1];
          setSelectedField(prevField.id);
          scrollToField(prevField.id);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < fields.length - 1) {
          const nextField = fields[currentIndex + 1];
          setSelectedField(nextField.id);
          scrollToField(nextField.id);
        }
        break;

      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        if (selectedFieldId) {
          removeField(selectedFieldId);
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedFieldId) {
          const currentField = fields.find(f => f.id === selectedFieldId);
          if (currentField) {
            const newField: Partial<Field> = {
              type: currentField.type,
              label: `${currentField.label} Copy`,
              placeholder: currentField.placeholder,
              required: false,
              options: currentField.options ? [...currentField.options] : undefined,
            };
            addField(newField, currentIndex + 1);
          }
        }
        break;

      case 'Escape':
        e.preventDefault();
        setSelectedField(null);
        break;

      case 'F1':
        e.preventDefault();
        setShowKeyboardShortcuts(true);
        break;

      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          // Move field up
          if (currentIndex > 0) {
            moveField(selectedFieldId!, currentIndex - 1);
          }
        } else {
          // Move field down
          if (currentIndex < fields.length - 1) {
            moveField(selectedFieldId!, currentIndex + 1);
          }
        }
        break;

      case 'c':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          // Copy field logic could be added here
        }
        break;

      case 'v':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          // Paste field logic could be added here
        }
        break;

      case 'z':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          if (e.shiftKey) {
            // Redo logic
          } else {
            // Undo logic
          }
        }
        break;
    }
  };

  return handleKeyDown;
} 
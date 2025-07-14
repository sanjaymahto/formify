import { Field } from '@/lib/store';
import { FieldType } from '@/types';
import { showToast } from '@/lib/utils';

export interface DragDropState {
  draggedFieldId: string | null;
  dragOverFieldId: string | null;
  isDragOverCanvas: boolean;
  ghostFieldType: string | null;
  ghostInsertIndex: number | null;
}

export function handleDragStart(
  fieldId: string,
  setDraggedFieldId: (id: string | null) => void
) {
  setDraggedFieldId(fieldId);
}

export function handleDragOver(
  e: React.DragEvent,
  targetFieldId: string | undefined,
  setDragOverFieldId: (id: string | null) => void,
  setIsDragOverCanvas: (isDragOver: boolean) => void,
  setGhostFieldType: (type: string | null) => void,
  setGhostInsertIndex: (index: number | null) => void,
  fields: Field[]
) {
  e.preventDefault();
  e.stopPropagation();

  const draggedType = e.dataTransfer.getData('text/plain');
  if (draggedType && draggedType.startsWith('field-type:')) {
    const fieldType = draggedType.replace('field-type:', '');
    setGhostFieldType(fieldType);
    
    if (targetFieldId) {
      setDragOverFieldId(targetFieldId);
      const targetIndex = fields.findIndex(f => f.id === targetFieldId);
      setGhostInsertIndex(targetIndex);
    } else {
      setDragOverFieldId(null);
      setGhostInsertIndex(fields.length);
    }
  } else if (draggedType && draggedType.startsWith('field-id:')) {
    const draggedFieldId = draggedType.replace('field-id:', '');
    if (targetFieldId && targetFieldId !== draggedFieldId) {
      setDragOverFieldId(targetFieldId);
    }
  }
  
  setIsDragOverCanvas(true);
}

export function handleDragEnter(
  e: React.DragEvent,
  setIsDragOverCanvas: (isDragOver: boolean) => void
) {
  e.preventDefault();
  e.stopPropagation();
  setIsDragOverCanvas(true);
}

export function handleDragLeave(
  e: React.DragEvent,
  setIsDragOverCanvas: (isDragOver: boolean) => void
) {
  e.preventDefault();
  e.stopPropagation();
  
  // Only set to false if we're leaving the canvas entirely
  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
    setIsDragOverCanvas(false);
  }
}

export function handleDrop(
  e: React.DragEvent,
  targetFieldId: string | undefined,
  addField: (field: Partial<Field>, index?: number) => void,
  moveField: (fieldId: string, newIndex: number) => void,
  setDraggedFieldId: (id: string | null) => void,
  setDragOverFieldId: (id: string | null) => void,
  setIsDragOverCanvas: (isDragOver: boolean) => void,
  setGhostFieldType: (type: string | null) => void,
  setGhostInsertIndex: (index: number | null) => void,
  fields: Field[]
) {
  e.preventDefault();
  e.stopPropagation();

  const draggedType = e.dataTransfer.getData('text/plain');
  
  if (draggedType && draggedType.startsWith('field-type:')) {
    const fieldType = draggedType.replace('field-type:', '');
    
    // Create new field
    const newField: Partial<Field> = {
      type: fieldType as FieldType,
      label: getDefaultLabel(fieldType),
      placeholder: getDefaultPlaceholder(fieldType),
      required: false,
    };

    // Add options for select fields
    if (['select', 'multi-select', 'radio'].includes(fieldType)) {
      newField.options = ['Option 1', 'Option 2', 'Option 3'];
    }

    // Add default values for specific field types
    if (fieldType === 'checkbox') {
      newField.advanced = { defaultValue: false };
    }
    if (fieldType === 'slider') {
      newField.sliderConfig = {
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 0,
      };
    }

    // Determine insert index
    let insertIndex: number | undefined;
    if (targetFieldId) {
      const targetIndex = fields.findIndex(f => f.id === targetFieldId);
      insertIndex = targetIndex;
    } else {
      insertIndex = fields.length;
    }

    addField(newField, insertIndex);
    showToast(`${getDefaultLabel(fieldType)} added successfully`, 'success');
    
  } else if (draggedType && draggedType.startsWith('field-id:')) {
    const draggedFieldId = draggedType.replace('field-id:', '');
    
    if (targetFieldId && targetFieldId !== draggedFieldId) {
      const draggedIndex = fields.findIndex(f => f.id === draggedFieldId);
      const targetIndex = fields.findIndex(f => f.id === targetFieldId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        moveField(draggedFieldId, targetIndex);
        showToast('Field moved successfully', 'success');
      }
    }
  }

  // Reset drag state
  setDraggedFieldId(null);
  setDragOverFieldId(null);
  setIsDragOverCanvas(false);
  setGhostFieldType(null);
  setGhostInsertIndex(null);
}

function getDefaultLabel(type: string): string {
  switch (type) {
    case 'text':
      return 'Text Input';
    case 'email':
      return 'Email Address';
    case 'password':
      return 'Password';
    case 'phone':
      return 'Phone Number';
    case 'url':
      return 'Website URL';
    case 'number':
      return 'Number Input';
    case 'textarea':
      return 'Text Area';
    case 'select':
      return 'Dropdown Selection';
    case 'multi-select':
      return 'Multiple Choice';
    case 'radio':
      return 'Radio Buttons';
    case 'checkbox':
      return 'Checkbox';
    case 'file':
      return 'File Upload';
    case 'image':
      return 'Image Upload';
    case 'date':
      return 'Date Picker';
    case 'time':
      return 'Time Picker';
    case 'rating':
      return 'Rating';
    case 'slider':
      return 'Slider';
    case 'divider':
      return 'Divider';
    case 'submit':
      return 'Submit Button';
    default:
      return 'Field';
  }
}

function getDefaultPlaceholder(type: string): string {
  switch (type) {
    case 'text':
      return 'Enter text...';
    case 'email':
      return 'Enter your email...';
    case 'password':
      return 'Enter your password...';
    case 'phone':
      return 'Enter phone number...';
    case 'url':
      return 'Enter website URL...';
    case 'number':
      return 'Enter a number...';
    case 'textarea':
      return 'Enter your message...';
    case 'select':
      return 'Select an option...';
    case 'multi-select':
      return 'Select options...';
    case 'radio':
      return 'Choose an option...';
    case 'checkbox':
      return 'Check this option...';
    case 'file':
      return 'Choose a file...';
    case 'image':
      return 'Choose an image...';
    case 'date':
      return 'Select a date...';
    case 'time':
      return 'Select a time...';
    case 'rating':
      return 'Rate this...';
    case 'slider':
      return 'Slide to select...';
    default:
      return 'Enter value...';
  }
} 
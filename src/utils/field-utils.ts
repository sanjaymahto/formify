import { Field, FieldType } from '@/types';
import { DEFAULT_FIELD_LABELS, DEFAULT_FIELD_PLACEHOLDERS } from '@/constants';

export const getDefaultLabel = (type: string): string => {
  return DEFAULT_FIELD_LABELS[type as FieldType] || 'Custom Field';
};

export const getDefaultPlaceholder = (type: string): string => {
  return DEFAULT_FIELD_PLACEHOLDERS[type as FieldType] || 'Enter value...';
};

export const createField = (type: FieldType, id?: string): Field => {
  return {
    id: id || `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    label: getDefaultLabel(type),
    placeholder: getDefaultPlaceholder(type),
    required: false,
  };
};

export const validateField = (field: Field): string[] => {
  const errors: string[] = [];
  
  if (!field.label.trim()) {
    errors.push('Field label is required');
  }
  
  if (field.required && !field.placeholder?.trim()) {
    errors.push('Placeholder is required for required fields');
  }
  
  return errors;
}; 
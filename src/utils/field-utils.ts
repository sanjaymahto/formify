import { Field, FieldType } from '@/types';

export const getDefaultLabel = (type: string): string => {
  const labels: Record<string, string> = {
    text: 'Text Input',
    email: 'Email Address',
    password: 'Password',
    number: 'Number Input',
    textarea: 'Text Area',
    select: 'Dropdown Select',
    radio: 'Radio Buttons',
    checkbox: 'Checkbox',
    file: 'File Upload',
    date: 'Date Picker',
    time: 'Time Picker',
    datetime: 'Date & Time',
    rating: 'Rating',
    slider: 'Slider',
    phone: 'Phone Number',
    url: 'URL Input',
    color: 'Color Picker',
    toggle: 'Toggle Switch',
    divider: 'Divider',
    'multi-select': 'Multi Select',
    tags: 'Tags Input',
    grid: 'Data Grid',
    code: 'Code Editor',
    image: 'Image Upload',
    submit: 'Submit Button',
    other: 'Custom Field',
  };
  return labels[type] || 'Custom Field';
};

export const getDefaultPlaceholder = (type: string): string => {
  const placeholders: Record<string, string> = {
    text: 'Enter text...',
    email: 'Enter your email...',
    password: 'Enter your password...',
    number: 'Enter a number...',
    textarea: 'Enter your message...',
    select: 'Select an option...',
    phone: 'Enter phone number...',
    url: 'Enter URL...',
    color: 'Choose a color...',
    tags: 'Enter tags...',
    code: 'Enter code...',
  };
  return placeholders[type] || 'Enter value...';
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
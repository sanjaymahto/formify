'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useFormStore, FieldType } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Type,
  Mail,
  Lock,
  Hash,
  FileText,
  List,
  CircleDot,
  CheckSquare,
  Upload,
  Calendar,
  Clock,
  Star,
  Sliders,
  Phone,
  Globe,
  Palette,
  ToggleLeft,
  Minus,
  Code,
  Tags,
  Grid3X3,
  Image,
  Send,
} from 'lucide-react';

const fieldCategories = [
  {
    name: 'Basic Fields',
    fields: [
      { type: 'text' as FieldType, label: 'Text Input', icon: Type },
      { type: 'email' as FieldType, label: 'Email', icon: Mail },
      { type: 'password' as FieldType, label: 'Password', icon: Lock },
      { type: 'number' as FieldType, label: 'Number', icon: Hash },
      { type: 'textarea' as FieldType, label: 'Text Area', icon: FileText },
      { type: 'phone' as FieldType, label: 'Phone', icon: Phone },
      { type: 'url' as FieldType, label: 'URL', icon: Globe },
    ],
  },
  {
    name: 'Selection Fields',
    fields: [
      { type: 'select' as FieldType, label: 'Dropdown', icon: List },
      { type: 'radio' as FieldType, label: 'Radio Buttons', icon: CircleDot },
      { type: 'checkbox' as FieldType, label: 'Checkbox', icon: CheckSquare },
      { type: 'multi-select' as FieldType, label: 'Multi-Select', icon: Tags },
      { type: 'toggle' as FieldType, label: 'Toggle', icon: ToggleLeft },
      { type: 'rating' as FieldType, label: 'Rating', icon: Star },
      { type: 'slider' as FieldType, label: 'Slider', icon: Sliders },
      { type: 'color' as FieldType, label: 'Color Picker', icon: Palette },
    ],
  },
  {
    name: 'Date & Time',
    fields: [
      { type: 'date' as FieldType, label: 'Date Picker', icon: Calendar },
      { type: 'time' as FieldType, label: 'Time Picker', icon: Clock },
      { type: 'datetime' as FieldType, label: 'Date & Time', icon: Calendar },
    ],
  },
  {
    name: 'File Upload',
    fields: [
      { type: 'file' as FieldType, label: 'File Upload', icon: Upload },
      { type: 'image' as FieldType, label: 'Image Upload', icon: Image },
    ],
  },

  {
    name: 'Layout & Structure',
    fields: [
      { type: 'divider' as FieldType, label: 'Divider', icon: Minus },
      { type: 'grid' as FieldType, label: 'Grid Table', icon: Grid3X3 },
      { type: 'submit' as FieldType, label: 'Submit Button', icon: Send },
    ],
  },
  {
    name: 'Complex Fields',
    fields: [
      { type: 'code' as FieldType, label: 'Code Editor', icon: Code },
    ],
  },
];

export default function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const addField = useFormStore(state => state.addField);
  const setSelectedField = useFormStore(state => state.setSelectedField);
  const fields = useFormStore(state => state.fields);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-96 overflow-y-auto border-r border-border bg-background p-4">
        <div className="space-y-4">
          <div>
            <h2 className="mb-4 text-lg font-semibold">Form Components</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Loading components...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent, fieldType: FieldType) => {
    // Don't allow dragging submit button if one already exists or if no other fields exist
    if (fieldType === 'submit' && (fields.some(field => field.type === 'submit') || !fields.some(field => field.type !== 'submit'))) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('fieldType', fieldType);
  };

  const handleAddField = (fieldType: FieldType) => {
    // Don't allow adding submit button if one already exists or if no other fields exist
    if (fieldType === 'submit' && (fields.some(field => field.type === 'submit') || !fields.some(field => field.type !== 'submit'))) {
      return;
    }
    
    const field = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: fieldType,
      label: getDefaultLabel(fieldType),
      placeholder: getDefaultPlaceholder(fieldType),
      required: false,
      options:
        fieldType === 'select' ||
        fieldType === 'radio' ||
        fieldType === 'multi-select'
          ? ['Option 1', 'Option 2', 'Option 3']
          : undefined,
    };
    addField(field);
    setSelectedField(field.id); // Auto-select the newly added field
  };

  const getDefaultLabel = (type: FieldType): string => {
    const labels: Record<FieldType, string> = {
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
      datetime: 'Date & Time Picker',
      rating: 'Rating',
      slider: 'Slider',
      phone: 'Phone Number',
      url: 'Website URL',
      color: 'Color Picker',
      toggle: 'Toggle Switch',
      divider: 'Divider',
      'multi-select': 'Multi-Select',
      tags: 'Tags Input',
      grid: 'Grid Table',
      code: 'Code Editor',
      image: 'Image Upload',
      submit: 'Submit',
      other: 'Other Field',
    };
    return labels[type] || 'Field';
  };

  const getDefaultPlaceholder = (type: FieldType): string => {
    const placeholders: Record<FieldType, string> = {
      text: 'Enter text...',
      email: 'Enter email address...',
      password: 'Enter password...',
      number: 'Enter number...',
      textarea: 'Enter your message...',
      select: 'Select an option...',
      radio: '',
      checkbox: '',
      file: 'Choose file...',
      date: 'Select date...',
      time: 'Select time...',
      datetime: 'Select date and time...',
      rating: '',
      slider: '',
      phone: 'Enter phone number...',
      url: 'Enter website URL...',
      color: '',
      toggle: '',
      divider: '',
      'multi-select': 'Select options...',
      tags: 'Add tags...',
      grid: '',
      code: 'Enter code...',
      image: 'Choose image...',
      submit: '',
      other: 'Enter value...',
    };
    return placeholders[type] || '';
  };

  return (
    <motion.div 
      className="w-80 h-full flex flex-col border-r border-border bg-background"
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="overflow-y-auto flex-1 p-4">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="mb-4 text-lg font-semibold">Form Components</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Drag and drop components to build your form
          </p>
        </motion.div>

        {fieldCategories.map((category, categoryIndex) => (
          <motion.div 
            key={category.name} 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.4 + (categoryIndex * 0.1),
              ease: "easeOut"
            }}
          >
            <motion.h3 
              className="text-sm font-medium uppercase tracking-wide text-muted-foreground"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + (categoryIndex * 0.1) }}
            >
              {category.name}
            </motion.h3>
            <div className="grid grid-cols-2 gap-2">
              {category.fields.map((field, fieldIndex) => {
                const IconComponent = field.icon;
                const isSubmitButton = field.type === 'submit';
                const submitButtonExists = fields.some(f => f.type === 'submit');
                const hasOtherFields = fields.some(f => f.type !== 'submit');
                const isDisabled = isSubmitButton && (submitButtonExists || !hasOtherFields);
                
                return (
                  <motion.div
                    key={field.type}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.6 + (categoryIndex * 0.1) + (fieldIndex * 0.05),
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      scale: isDisabled ? 1 : 1.02,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: isDisabled ? 1 : 0.98,
                      transition: { duration: 0.1 }
                    }}
                  >
                    <Card
                      className={`transition-shadow ${
                        isDisabled 
                          ? 'cursor-not-allowed opacity-50' 
                          : 'cursor-pointer hover:shadow-md active:cursor-grabbing'
                      }`}
                      draggable={!isDisabled}
                      onDragStart={e => handleDragStart(e, field.type)}
                      onClick={() => !isDisabled && handleAddField(field.type)}
                    >
                      <CardContent className="flex flex-col items-center space-y-1 p-2">
                        <IconComponent className={`h-4 w-4 ${
                          isDisabled ? 'text-muted-foreground/50' : 'text-muted-foreground'
                        }`} />
                        <span className={`text-center text-xs font-medium ${
                          isDisabled ? 'text-muted-foreground/50' : ''
                        }`}>
                          {field.label}
                        </span>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
            {categoryIndex < fieldCategories.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + (categoryIndex * 0.1) }}
              >
                <Separator className="my-4" />
              </motion.div>
            )}
          </motion.div>
        ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

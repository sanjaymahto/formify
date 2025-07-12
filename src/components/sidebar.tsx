'use client';

import React, { useState, useEffect } from 'react';
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
  Edit3,
  Calendar,
  Clock,
  PenTool,
  Star,
  Sliders,
  Phone,
  Globe,
  Palette,
  ToggleLeft,
  Minus,
  Code,
  Tags,
  Layers,
  Columns,
  Grid3X3,
  Section,
  Folder,
  Image,
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
    name: 'Advanced Fields',
    fields: [
      { type: 'rich-text' as FieldType, label: 'Rich Text', icon: Edit3 },
      { type: 'signature' as FieldType, label: 'Signature', icon: PenTool },
    ],
  },
  {
    name: 'Layout & Structure',
    fields: [
      { type: 'section' as FieldType, label: 'Section', icon: Section },
      { type: 'divider' as FieldType, label: 'Divider', icon: Minus },
      { type: 'group' as FieldType, label: 'Field Group', icon: Folder },
      { type: 'grid' as FieldType, label: 'Grid Layout', icon: Grid3X3 },
      { type: 'columns' as FieldType, label: 'Columns', icon: Columns },
      { type: 'accordion' as FieldType, label: 'Accordion', icon: Layers },
    ],
  },
  {
    name: 'Complex Fields',
    fields: [
      { type: 'code' as FieldType, label: 'Code Editor', icon: Code },
      { type: 'html' as FieldType, label: 'Custom HTML', icon: Code },
    ],
  },
];

export default function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const addField = useFormStore(state => state.addField);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-80 overflow-y-auto border-r border-border bg-background p-4">
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
    e.dataTransfer.setData('fieldType', fieldType);
  };

  const handleAddField = (fieldType: FieldType) => {
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
      'rich-text': 'Rich Text Editor',
      date: 'Date Picker',
      time: 'Time Picker',
      datetime: 'Date & Time Picker',
      signature: 'Signature Field',
      rating: 'Rating',
      slider: 'Slider',
      phone: 'Phone Number',
      url: 'Website URL',
      color: 'Color Picker',
      toggle: 'Toggle Switch',
      divider: 'Divider',
      html: 'Custom HTML',
      'multi-select': 'Multi-Select',
      tags: 'Tags Input',
      accordion: 'Accordion',
      grid: 'Grid Layout',
      columns: 'Column Layout',
      section: 'Section',
      group: 'Field Group',
      code: 'Code Editor',
      image: 'Image Upload',
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
      'rich-text': 'Start typing...',
      date: 'Select date...',
      time: 'Select time...',
      datetime: 'Select date and time...',
      signature: 'Sign here...',
      rating: '',
      slider: '',
      phone: 'Enter phone number...',
      url: 'Enter website URL...',
      color: '',
      toggle: '',
      divider: '',
      html: '',
      'multi-select': 'Select options...',
      tags: 'Add tags...',
      accordion: '',
      grid: '',
      columns: '',
      section: '',
      group: '',
      code: 'Enter code...',
      image: 'Choose image...',
      other: 'Enter value...',
    };
    return placeholders[type] || '';
  };

  return (
    <div className="w-80 overflow-y-auto border-r border-border bg-background p-4">
      <div className="space-y-4">
        <div>
          <h2 className="mb-4 text-lg font-semibold">Form Components</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Drag and drop components to build your form
          </p>
        </div>

        {fieldCategories.map((category, categoryIndex) => (
          <div key={category.name} className="space-y-2">
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {category.name}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {category.fields.map(field => {
                const IconComponent = field.icon;
                return (
                  <Card
                    key={field.type}
                    className="cursor-pointer transition-shadow hover:shadow-md active:cursor-grabbing"
                    draggable
                    onDragStart={e => handleDragStart(e, field.type)}
                    onClick={() => handleAddField(field.type)}
                  >
                    <CardContent className="flex flex-col items-center space-y-1 p-2">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                      <span className="text-center text-xs font-medium">
                        {field.label}
                      </span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {categoryIndex < fieldCategories.length - 1 && (
              <Separator className="my-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

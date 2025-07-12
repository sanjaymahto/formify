'use client';

import React, { useState } from 'react';
import { useFormStore, Field, FieldType } from '@/lib/store';
import { useSettingsStore } from '@/lib/settings-store';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { TemplateSelector } from '@/components/template-selector';
import { FormTitle } from '@/components/form-title';
import {
  Trash2,
  GripVertical,
  Upload,
  Calendar,
  Clock,
  Star,
  Palette,
  FileText,
  Code,
  Tags,
  Layers,
  Grid3X3,
  Columns,
  Section,
  Folder,
  PenTool,
  Sparkles,
} from 'lucide-react';

interface FieldRendererProps {
  field: Field;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDragStart: (fieldId: string) => void;
  onDragOver: (e: React.DragEvent, fieldId?: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, fieldId?: string) => void;
  isDragOver: boolean;
  isDragging: boolean;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  isSelected,
  onSelect,
  onDelete,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragOver,
  isDragging,
}) => {
  const updateField = useFormStore(state => state.updateField);
  const { colorPalette } = useSettingsStore();

  const handleLabelChange = (value: string) => {
    updateField(field.id, { label: value });
  };

  const handleRequiredChange = (checked: boolean) => {
    updateField(field.id, { required: checked });
  };

  const getCheckboxColors = () => {
    const colors = {
      default: {
        border: 'border-blue-500',
        bg: 'bg-blue-500',
        focus: 'focus:ring-blue-500/20',
        hover: 'hover:border-blue-500/50',
        cssColor: '#3b82f6',
      },
      blue: {
        border: 'border-blue-500',
        bg: 'bg-blue-500',
        focus: 'focus:ring-blue-500/20',
        hover: 'hover:border-blue-500/50',
        cssColor: '#3b82f6',
      },
      green: {
        border: 'border-green-500',
        bg: 'bg-green-500',
        focus: 'focus:ring-green-500/20',
        hover: 'hover:border-green-500/50',
        cssColor: '#10b981',
      },
      purple: {
        border: 'border-purple-500',
        bg: 'bg-purple-500',
        focus: 'focus:ring-purple-500/20',
        hover: 'hover:border-purple-500/50',
        cssColor: '#8b5cf6',
      },
      orange: {
        border: 'border-orange-500',
        bg: 'bg-orange-500',
        focus: 'focus:ring-orange-500/20',
        hover: 'hover:border-orange-500/50',
        cssColor: '#f97316',
      },
      pink: {
        border: 'border-pink-500',
        bg: 'bg-pink-500',
        focus: 'focus:ring-pink-500/20',
        hover: 'hover:border-pink-500/50',
        cssColor: '#ec4899',
      },
      red: {
        border: 'border-red-500',
        bg: 'bg-red-500',
        focus: 'focus:ring-red-500/20',
        hover: 'hover:border-red-500/50',
        cssColor: '#ef4444',
      },
      teal: {
        border: 'border-teal-500',
        bg: 'bg-teal-500',
        focus: 'focus:ring-teal-500/20',
        hover: 'hover:border-teal-500/50',
        cssColor: '#14b8a6',
      },
      indigo: {
        border: 'border-indigo-500',
        bg: 'bg-indigo-500',
        focus: 'focus:ring-indigo-500/20',
        hover: 'hover:border-indigo-500/50',
        cssColor: '#6366f1',
      },
      yellow: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-500',
        focus: 'focus:ring-yellow-500/20',
        hover: 'hover:border-yellow-500/50',
        cssColor: '#eab308',
      },
    };
    return colors[colorPalette] || colors.default;
  };

  const renderFieldContent = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'phone':
      case 'url':
        return (
          <Input
            type={field.type === 'password' ? 'password' : 'text'}
            placeholder={field.placeholder}
            disabled
            className="bg-muted"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            disabled
            className="bg-muted"
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            disabled
            className="resize-none bg-muted"
            rows={3}
          />
        );

      case 'select':
      case 'multi-select':
        return (
          <Select>
            <SelectTrigger className="bg-muted">
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox disabled />
            <Label>Checkbox option</Label>
          </div>
        );

      case 'file':
      case 'image':
        return (
          <div className="border-muted-foreground/25 rounded-lg border-2 border-dashed p-6 text-center">
            <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to upload {field.type} files
            </p>
          </div>
        );

      case 'rich-text':
        return (
          <div className="rounded-lg border border-muted bg-muted p-3">
            <div className="mb-2 flex items-center space-x-2">
              <Button variant="ghost" size="sm" disabled>
                B
              </Button>
              <Button variant="ghost" size="sm" disabled>
                I
              </Button>
              <Button variant="ghost" size="sm" disabled>
                U
              </Button>
              <Button variant="ghost" size="sm" disabled>
                Link
              </Button>
            </div>
            <Textarea
              placeholder={field.placeholder}
              disabled
              className="resize-none bg-background"
              rows={4}
            />
          </div>
        );

      case 'date':
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              placeholder={field.placeholder}
              disabled
              className="bg-muted"
            />
          </div>
        );

      case 'time':
        return (
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              placeholder={field.placeholder}
              disabled
              className="bg-muted"
            />
          </div>
        );

      case 'datetime':
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="datetime-local"
              placeholder={field.placeholder}
              disabled
              className="bg-muted"
            />
          </div>
        );

      case 'signature':
        return (
          <div className="rounded-lg border border-muted bg-muted p-4">
            <div className="mb-2 flex items-center space-x-2">
              <PenTool className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Signature Pad
              </span>
            </div>
            <div className="border-muted-foreground/25 flex h-24 items-center justify-center rounded border-2 border-dashed bg-background">
              <span className="text-sm text-muted-foreground">
                Click to sign
              </span>
            </div>
          </div>
        );

      case 'rating':
        return (
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className="text-muted-foreground/50 h-5 w-5 cursor-pointer hover:text-yellow-400"
                fill="currentColor"
              />
            ))}
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              defaultValue={50}
              disabled
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted"
            />
            <div className="text-center text-sm text-muted-foreground">50</div>
          </div>
        );

      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <Input
              type="color"
              defaultValue="#000000"
              disabled
              className="h-10 w-16 bg-muted"
            />
          </div>
        );

      case 'toggle':
        return (
          <div className="flex items-center space-x-2">
            <Switch disabled />
            <Label>Toggle option</Label>
          </div>
        );

      case 'divider':
        return <Separator className="my-4" />;

      case 'html':
        return (
          <div className="rounded-lg border border-muted bg-muted p-3">
            <div className="mb-2 flex items-center space-x-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Custom HTML</span>
            </div>
            <div className="rounded bg-background p-2 text-sm">
              &lt;p&gt;Custom HTML content&lt;/p&gt;
            </div>
          </div>
        );

      case 'tags':
        return (
          <div className="flex items-center space-x-2">
            <Tags className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              <span className="bg-muted-foreground/20 rounded px-2 py-1 text-xs">
                Tag 1
              </span>
              <span className="bg-muted-foreground/20 rounded px-2 py-1 text-xs">
                Tag 2
              </span>
            </div>
            <Input
              placeholder={field.placeholder}
              disabled
              className="flex-1 bg-muted"
            />
          </div>
        );



      case 'accordion':
        return (
          <div className="rounded-lg border border-muted bg-muted p-3">
            <div className="mb-2 flex items-center space-x-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Accordion</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between rounded bg-background p-2">
                <span className="text-sm">Section 1</span>
                <span className="text-xs">▼</span>
              </div>
              <div className="flex items-center justify-between rounded bg-background p-2">
                <span className="text-sm">Section 2</span>
                <span className="text-xs">▶</span>
              </div>
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className="rounded-lg border border-muted bg-muted p-3">
            <div className="mb-2 flex items-center space-x-2">
              <Grid3X3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Grid Layout</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="border-muted-foreground/25 h-8 rounded border-2 border-dashed bg-background"></div>
              <div className="border-muted-foreground/25 h-8 rounded border-2 border-dashed bg-background"></div>
              <div className="border-muted-foreground/25 h-8 rounded border-2 border-dashed bg-background"></div>
              <div className="border-muted-foreground/25 h-8 rounded border-2 border-dashed bg-background"></div>
            </div>
          </div>
        );

      case 'columns':
        return (
          <div className="rounded-lg border border-muted bg-muted p-3">
            <div className="mb-2 flex items-center space-x-2">
              <Columns className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Column Layout
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="border-muted-foreground/25 h-12 rounded border-2 border-dashed bg-background"></div>
              <div className="border-muted-foreground/25 h-12 rounded border-2 border-dashed bg-background"></div>
            </div>
          </div>
        );

      case 'section':
        return (
          <div className="rounded-lg border border-muted bg-muted p-4">
            <div className="mb-2 flex items-center space-x-2">
              <Section className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Section Title</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Section description or content area
            </div>
          </div>
        );

      case 'group':
        return (
          <div className="rounded-lg border border-muted bg-muted p-3">
            <div className="mb-2 flex items-center space-x-2">
              <Folder className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Field Group</span>
            </div>
            <div className="space-y-2">
              <div className="border-muted-foreground/25 h-6 rounded border-2 border-dashed bg-background"></div>
              <div className="border-muted-foreground/25 h-6 rounded border-2 border-dashed bg-background"></div>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="rounded-lg border border-muted bg-muted p-3">
            <div className="mb-2 flex items-center space-x-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Code Editor</span>
            </div>
            <div className="rounded bg-background p-2 font-mono text-xs">
              console.log(&quot;Hello World&quot;);
            </div>
          </div>
        );

      default:
        return (
          <Input
            placeholder="Unsupported field type"
            disabled
            className="bg-muted"
          />
        );
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected ? 'shadow-lg ring-2 ring-primary' : 'hover:shadow-md'
      } ${isDragOver ? 'ring-2 ring-blue-300 bg-blue-50' : ''} ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={onSelect}
      draggable
      onDragStart={() => onDragStart(field.id)}
      onDragOver={(e) => onDragOver(e, field.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, field.id)}
    >
      <CardContent className="px-3 py-1.5">
        <div className="mb-1.5 flex items-start justify-between">
          <div className="flex-1">
            <Input
              value={field.label}
              onChange={e => handleLabelChange(e.target.value)}
              className="h-auto border-none p-0 font-medium focus-visible:ring-0"
              onClick={e => e.stopPropagation()}
            />
          </div>
          <div className="ml-2 flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={e => {
                e.stopPropagation();
                onDelete();
              }}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <div 
              className="cursor-grab active:cursor-grabbing cursor-pointer"
              onMouseDown={(e) => {
                e.stopPropagation();
                onDragStart(field.id);
              }}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="mb-1.5">{renderFieldContent()}</div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`required-${field.id}`}
              checked={field.required}
              onChange={(e) => {
                e.stopPropagation();
                handleRequiredChange(e.target.checked);
              }}
              onClick={(e) => e.stopPropagation()}
              className={`h-4 w-4 rounded-md border border-border bg-background cursor-pointer transition-colors ${
                field.required 
                  ? `${getCheckboxColors().bg} ${getCheckboxColors().border}` 
                  : 'border-border'
              } ${getCheckboxColors().focus} ${getCheckboxColors().hover}`}
              style={{
                accentColor: field.required ? getCheckboxColors().cssColor : undefined
              }}
            />
            <Label 
              htmlFor={`required-${field.id}`}
              className="text-xs text-muted-foreground cursor-pointer select-none"
            >
              Required
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Canvas() {
  const fields = useFormStore(state => state.fields);
  const selectedFieldId = useFormStore(state => state.selectedFieldId);
  const setSelectedField = useFormStore(state => state.setSelectedField);
  const removeField = useFormStore(state => state.removeField);
  const reorderFields = useFormStore(state => state.reorderFields);
  const addField = useFormStore(state => state.addField);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);
  const [dragOverFieldId, setDragOverFieldId] = useState<string | null>(null);
  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false);
  const [ghostFieldType, setGhostFieldType] = useState<string | null>(null);
  const [ghostInsertIndex, setGhostInsertIndex] = useState<number | null>(null);
  const draggedFieldTypeRef = React.useRef<string | null>(null);

  const handleDragStart = (fieldId: string) => {
    setDraggedFieldId(fieldId);
  };

  const handleDragOver = (e: React.DragEvent, fieldId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('DragOver triggered:', { fieldId, draggedFieldType: draggedFieldTypeRef.current, draggedFieldId });
    
    // Check if we're dragging a new field from sidebar
    if (draggedFieldTypeRef.current) {
      setGhostFieldType(draggedFieldTypeRef.current);
      
      if (fieldId) {
        // Insert before specific field
        const targetIndex = fields.findIndex(f => f.id === fieldId);
        setGhostInsertIndex(targetIndex);
        setDragOverFieldId(fieldId);
      } else {
        // Insert at end
        setGhostInsertIndex(fields.length);
        setIsDragOverCanvas(true);
      }
    } else if (fieldId) {
      // Reordering existing fields
      if (draggedFieldId && draggedFieldId !== fieldId) {
        setDragOverFieldId(fieldId);
      }
    } else {
      // Dragging over canvas area (not over a specific field)
      if (draggedFieldTypeRef.current) {
        setGhostFieldType(draggedFieldTypeRef.current);
        setGhostInsertIndex(fields.length);
        setIsDragOverCanvas(true);
      }
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('DragEnter triggered:', { draggedFieldType: draggedFieldTypeRef.current });
    
    // Show ghost component immediately when entering canvas area
    if (draggedFieldTypeRef.current) {
      setGhostFieldType(draggedFieldTypeRef.current);
      setGhostInsertIndex(fields.length);
      setIsDragOverCanvas(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only clear if we're leaving the canvas area entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOverCanvas(false);
      setDragOverFieldId(null);
      setGhostFieldType(null);
      setGhostInsertIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetFieldId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const fieldType = draggedFieldTypeRef.current || e.dataTransfer.getData('fieldType');
    
    if (fieldType) {
      // Adding new field from sidebar
      const field = {
        id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: fieldType as FieldType,
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
      
      if (targetFieldId) {
        // Insert at specific position
        const targetIndex = fields.findIndex(f => f.id === targetFieldId);
        if (targetIndex !== -1) {
          // Insert before the target field
          const newFields = [...fields];
          newFields.splice(targetIndex, 0, field);
          // Update the store with the new field order
          // This is a bit hacky but works for now
          fields.forEach((_, index) => {
            if (index >= targetIndex) {
              removeField(fields[index].id);
            }
          });
          newFields.forEach((f, index) => {
            if (index >= targetIndex) {
              addField(f);
            }
          });
        }
      } else {
        // Add to end
        addField(field);
      }
    } else if (draggedFieldId && targetFieldId && draggedFieldId !== targetFieldId) {
      // Reordering existing fields
      const fromIndex = fields.findIndex(f => f.id === draggedFieldId);
      const toIndex = fields.findIndex(f => f.id === targetFieldId);
      
      if (fromIndex !== -1 && toIndex !== -1) {
        reorderFields(fromIndex, toIndex);
      }
    }
    
    setDraggedFieldId(null);
    setDragOverFieldId(null);
    setIsDragOverCanvas(false);
    setGhostFieldType(null);
    setGhostInsertIndex(null);
    draggedFieldTypeRef.current = null;
  };

  // Handle ESC key to cancel drag and global drag events
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (ghostFieldType || draggedFieldId)) {
        setDraggedFieldId(null);
        setDragOverFieldId(null);
        setIsDragOverCanvas(false);
        setGhostFieldType(null);
        setGhostInsertIndex(null);
        draggedFieldTypeRef.current = null;
      }
    };

    const handleGlobalDragStart = (e: DragEvent) => {
      const fieldType = e.dataTransfer?.getData('fieldType');
      console.log('Global drag start:', { fieldType });
      if (fieldType) {
        draggedFieldTypeRef.current = fieldType;
      }
    };

    const handleGlobalDragEnd = () => {
      draggedFieldTypeRef.current = null;
      setGhostFieldType(null);
      setGhostInsertIndex(null);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleGlobalDragStart);
    document.addEventListener('dragend', handleGlobalDragEnd);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleGlobalDragStart);
      document.removeEventListener('dragend', handleGlobalDragEnd);
    };
  }, [ghostFieldType, draggedFieldId]);

  const getDefaultLabel = (type: string): string => {
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

  const getDefaultPlaceholder = (type: string): string => {
    const placeholders: Record<string, string> = {
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

  // Ghost field component
  const GhostField = ({ fieldType }: { fieldType: string }) => {
    const renderGhostContent = () => {
      switch (fieldType) {
        case 'text':
        case 'email':
        case 'password':
        case 'phone':
        case 'url':
          return (
            <Input
              type="text"
              placeholder={getDefaultPlaceholder(fieldType)}
              disabled
              className="bg-muted/50 border-dashed"
            />
          );

        case 'number':
          return (
            <Input
              type="number"
              placeholder={getDefaultPlaceholder(fieldType)}
              disabled
              className="bg-muted/50 border-dashed"
            />
          );

        case 'textarea':
          return (
            <Textarea
              placeholder={getDefaultPlaceholder(fieldType)}
              disabled
              className="resize-none bg-muted/50 border-dashed"
              rows={3}
            />
          );

        case 'select':
        case 'multi-select':
          return (
            <Select>
              <SelectTrigger className="bg-muted/50 border-dashed">
                <SelectValue placeholder={getDefaultPlaceholder(fieldType)} />
              </SelectTrigger>
            </Select>
          );

        case 'radio':
          return (
            <RadioGroup className="space-y-2">
              {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`ghost-${index}`} disabled />
                  <Label htmlFor={`ghost-${index}`} className="text-muted-foreground">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          );

        case 'checkbox':
          return (
            <div className="flex items-center space-x-2">
              <Checkbox disabled />
              <Label className="text-muted-foreground">Checkbox option</Label>
            </div>
          );

        case 'file':
        case 'image':
          return (
            <div className="border-muted-foreground/25 rounded-lg border-2 border-dashed p-6 text-center bg-muted/50">
              <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload {fieldType} files
              </p>
            </div>
          );

        case 'rating':
          return (
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className="text-muted-foreground/30 h-5 w-5"
                  fill="currentColor"
                />
              ))}
            </div>
          );

        case 'slider':
          return (
            <div className="space-y-2">
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                defaultValue={50}
                disabled
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted/50 border-dashed"
              />
              <div className="text-center text-sm text-muted-foreground">50</div>
            </div>
          );

        case 'divider':
          return <Separator className="my-4 border-dashed" />;

        case 'section':
          return (
            <div className="rounded-lg border border-muted bg-muted/50 p-4 border-dashed">
              <div className="mb-2 flex items-center space-x-2">
                <Section className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Section Title</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Section description or content area
              </div>
            </div>
          );

        default:
          return (
            <Input
              placeholder="Field preview"
              disabled
              className="bg-muted/50 border-dashed"
            />
          );
      }
    };

    return (
      <Card className="opacity-60 border-dashed border-2 bg-muted/20">
        <CardContent className="px-3 py-1.5">
          <div className="mb-1.5 flex items-start justify-between">
            <div className="flex-1">
              <Input
                value={getDefaultLabel(fieldType)}
                disabled
                className="h-auto border-none p-0 font-medium text-muted-foreground bg-transparent"
              />
            </div>
          </div>
          <div className="mb-1.5">{renderGhostContent()}</div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                disabled
                className="h-4 w-4 rounded-md border border-border bg-background cursor-pointer transition-colors opacity-50"
              />
              <Label className="text-xs text-muted-foreground cursor-pointer select-none">
                Required
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div 
      className="h-screen overflow-y-auto bg-background p-6"
      onDragEnter={handleDragEnter}
      onDragOver={(e) => handleDragOver(e)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e)}
    >
      <div 
        className="mx-auto max-w-2xl space-y-4"
        onDragEnter={handleDragEnter}
        onDragOver={(e) => handleDragOver(e)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e)}
      >
        <FormTitle />
        
        {fields.length === 0 ? (
          <div 
            className={`flex flex-col items-center justify-center py-12 text-center transition-all duration-200 ${
              isDragOverCanvas ? 'bg-primary/5 border-2 border-dashed border-primary/30 rounded-lg' : ''
            }`}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e)}
          >
            <div className="mb-4 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12" />
            </div>
            <h3 className="mb-2 text-lg font-medium">No fields added yet</h3>
            <p className="mb-4 text-muted-foreground">
              Drag and drop components from the sidebar to start building your form
            </p>
            <p className="mb-6 text-muted-foreground font-medium">or</p>
            <Button 
              onClick={() => setShowTemplateSelector(true)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Choose a Template
            </Button>
          </div>
        ) : (
          fields.map((field, index) => (
            <div key={field.id}>
              {/* Drop zone above each field */}
              <div
                className={`h-2 transition-all duration-200 ${
                  dragOverFieldId === field.id ? 'bg-primary/20' : 'bg-transparent'
                }`}
                onDragOver={(e) => handleDragOver(e, field.id)}
                onDrop={(e) => handleDrop(e, field.id)}
              />
              
              {/* Ghost field above */}
              {ghostFieldType && ghostInsertIndex === index && (
                <GhostField fieldType={ghostFieldType} />
              )}
              
              <FieldRenderer
                field={field}
                isSelected={selectedFieldId === field.id}
                onSelect={() => setSelectedField(field.id)}
                onDelete={() => removeField(field.id)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                isDragOver={dragOverFieldId === field.id}
                isDragging={draggedFieldId === field.id}
              />
            </div>
          ))
        )}
        
        {/* Ghost field at the end */}
        {ghostFieldType && ghostInsertIndex === fields.length && (
          <GhostField fieldType={ghostFieldType} />
        )}
        
        {/* Drop zone at the end */}
        <div
          className={`h-2 transition-all duration-200 ${
            isDragOverCanvas && !dragOverFieldId ? 'bg-primary/20' : 'bg-transparent'
          }`}
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e)}
        />
        
        {/* Extra space at bottom for dragging */}
        <div className="h-32" />
      </div>
      
      {showTemplateSelector && (
        <TemplateSelector onClose={() => setShowTemplateSelector(false)} />
      )}
    </div>
  );
}

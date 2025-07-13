'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { CodeEditor } from '@/components/ui/code-editor';
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
  Grid3X3,
  Columns,
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

      case 'multi-select':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox disabled />
                <Label className="text-sm text-muted-foreground">{option}</Label>
              </div>
            ))}
          </div>
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



      case 'date':
        return (
          <div className="relative">
            <Input
              type="date"
              placeholder={field.placeholder}
              disabled
              className="bg-background border-border text-foreground placeholder:text-muted-foreground pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
            />
            <Calendar 
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" 
              onClick={() => {
                const input = document.getElementById(field.id) as HTMLInputElement;
                if (input) input.showPicker();
              }}
            />
          </div>
        );

      case 'time':
        return (
          <div className="relative">
            <Input
              type="time"
              placeholder={field.placeholder}
              disabled
              className="bg-background border-border text-foreground placeholder:text-muted-foreground pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
            />
            <Clock 
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" 
              onClick={() => {
                const input = document.getElementById(field.id) as HTMLInputElement;
                if (input) input.showPicker();
              }}
            />
          </div>
        );

      case 'datetime':
        return (
          <div className="relative">
            <Input
              type="datetime-local"
              placeholder={field.placeholder}
              disabled
              className="bg-background border-border text-foreground placeholder:text-muted-foreground pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
            />
            <Calendar 
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" 
              onClick={() => {
                const input = document.getElementById(field.id) as HTMLInputElement;
                if (input) input.showPicker();
              }}
            />
          </div>
        );



      case 'rating':
        return (
          <div className="flex items-center space-x-1">
            {Array.from(
              { length: field.ratingConfig?.maxRating || 5 }, 
              (_, i) => {
                const starValue = i + 1;
                const allowHalf = field.ratingConfig?.allowHalf || false;
                
                return (
                  <Star
                    key={i}
                    className="text-muted-foreground/50 h-5 w-5 cursor-pointer hover:text-yellow-400"
                    fill="currentColor"
                  />
                );
              }
            )}
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={field.sliderConfig?.min || 0}
              max={field.sliderConfig?.max || 100}
              step={field.sliderConfig?.step || 1}
              defaultValue={field.sliderConfig?.defaultValue ?? 0}
              disabled
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
              <span>{field.sliderConfig?.min || 0}</span>
              <span>{field.sliderConfig?.defaultValue ?? 0}</span>
              <span>{field.sliderConfig?.max || 100}</span>
            </div>
            {field.sliderConfig?.showValue && (
              <div className="text-center text-sm text-muted-foreground">
                {field.sliderConfig?.defaultValue ?? 0}
              </div>
            )}
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

      case 'other':
        return (
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={field.placeholder}
              disabled
              className="bg-muted"
            />
          </div>
        );

      case 'divider':
        return <Separator className="my-4" />;







      case 'grid':
        const gridConfig = field.gridConfig || {
          columns: [
            { id: '1', name: 'Name', type: 'text' as const, required: true },
            { id: '2', name: 'Email', type: 'email' as const, required: true },
            { id: '3', name: 'Phone', type: 'phone' as const, required: false }
          ],
          rows: [],
          allowAddRows: true,
          allowDeleteRows: true,
          maxRows: 10,
          minRows: 1
        };
        
        return (
          <div className="rounded-lg border border-muted bg-muted p-3">
            <div className="mb-2 flex items-center space-x-2">
              <Grid3X3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Grid Table</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-muted-foreground/20">
                    {gridConfig.columns.map((column) => (
                      <th key={column.id} className="p-2 text-left font-medium">
                        {column.name}
                        {column.required && <span className="text-red-500 ml-1">*</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-muted-foreground/10">
                    {gridConfig.columns.map((column) => (
                      <td key={column.id} className="p-2">
                        <div className="text-muted-foreground">
                          {column.type === 'text' && 'Text input'}
                          {column.type === 'number' && 'Number input'}
                          {column.type === 'date' && 'Date picker'}
                          {column.type === 'time' && 'Time picker'}
                          {column.type === 'datetime' && 'Date & Time picker'}
                          {column.type === 'email' && 'Email input'}
                          {column.type === 'phone' && 'Phone input'}
                          {column.type === 'url' && 'URL input'}
                          {column.type === 'select' && 'Dropdown'}
                          {column.type === 'checkbox' && 'Checkbox'}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    {gridConfig.columns.map((column) => (
                      <td key={column.id} className="p-2">
                        <div className="text-muted-foreground">
                          {column.type === 'text' && 'Text input'}
                          {column.type === 'number' && 'Number input'}
                          {column.type === 'date' && 'Date picker'}
                          {column.type === 'time' && 'Time picker'}
                          {column.type === 'datetime' && 'Date & Time picker'}
                          {column.type === 'email' && 'Email input'}
                          {column.type === 'phone' && 'Phone input'}
                          {column.type === 'url' && 'URL input'}
                          {column.type === 'select' && 'Dropdown'}
                          {column.type === 'checkbox' && 'Checkbox'}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );







      case 'code':
        const codeConfig = field.codeConfig || {
          language: 'javascript',
          theme: 'one-dark',
          lineNumbers: true,
          autoComplete: true,
          syntaxHighlighting: true,
        };
        
        return (
          <div className="rounded-lg border border-muted bg-muted p-3">
            <div className="mb-2 flex items-center space-x-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Code Editor ({codeConfig.language})
              </span>
            </div>
            <CodeEditor
              value={field.advanced?.defaultValue?.toString() || '// Enter your code here...'}
              onChange={() => {}} // Read-only in canvas
              language={codeConfig.language || 'javascript'}
              placeholder="// Enter your code here..."
              disabled={true}
              className="w-full"
            />
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
            {field.type !== 'divider' ? (
              <Input
                value={field.label}
                onChange={e => handleLabelChange(e.target.value)}
                className="h-auto border-none p-0 font-medium focus-visible:ring-0"
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <div className="h-auto p-0 font-medium text-muted-foreground">
                Divider
              </div>
            )}
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

        {/* Only show required checkbox for input fields */}
        {!['divider', 'code', 'progress'].includes(field.type) && (
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
        )}
      </CardContent>
    </Card>
  );
};

export default function Canvas() {
  const fields = useFormStore(state => state.fields);
  const selectedFieldId = useFormStore(state => state.selectedFieldId);
  const setSelectedField = useFormStore(state => state.setSelectedField);
  const removeField = useFormStore(state => state.removeField);
  const shouldShowField = useFormStore(state => state.shouldShowField);
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
                defaultValue={0}
                disabled
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200/50 dark:bg-gray-700/50 border-dashed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary/50 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary/50 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>0</span>
                <span>100</span>
              </div>
              <div className="text-center text-sm text-muted-foreground">0</div>
            </div>
          );

        case 'divider':
          return <Separator className="my-4 border-dashed" />;



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
    <motion.div 
      className="h-full overflow-y-auto bg-background p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => handleDragOver(e)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e)}
    >
      <motion.div 
        className="mx-auto max-w-4xl space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => handleDragOver(e)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e)}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FormTitle />
        </motion.div>
        
        <AnimatePresence mode="wait">
          {fields.length === 0 ? (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className={`flex flex-col items-center justify-center py-12 text-center transition-all duration-200 ${
                isDragOverCanvas ? 'bg-primary/5 border-2 border-dashed border-primary/30 rounded-lg' : ''
              }`}
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e)}
            >
              <motion.div 
                className="mb-4 text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <FileText className="mx-auto h-12 w-12" />
              </motion.div>
              <motion.h3 
                className="mb-2 text-lg font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                No fields added yet
              </motion.h3>
              <motion.p 
                className="mb-4 text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Drag and drop components from the sidebar to start building your form
              </motion.p>
              <motion.p 
                className="mb-6 text-muted-foreground font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                or
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={() => setShowTemplateSelector(true)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  Choose a Template
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {fields
                .filter(field => shouldShowField(field)) // Only show fields that meet conditional logic
                .map((field, index) => (
                <motion.div 
                  key={field.id}
                  initial={{ opacity: 0, x: -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 20, y: -10, height: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  layout
                >
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
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GhostField fieldType={ghostFieldType} />
                    </motion.div>
                  )}
                  
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
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
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </AnimatePresence>
        
        {/* Ghost field at the end */}
        {ghostFieldType && ghostInsertIndex === fields.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <GhostField fieldType={ghostFieldType} />
          </motion.div>
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
      </motion.div>
      
      <AnimatePresence>
        {showTemplateSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TemplateSelector onClose={() => setShowTemplateSelector(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

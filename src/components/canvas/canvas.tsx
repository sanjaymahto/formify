'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFormStore } from '@/lib/store';
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TemplateSelector } from '@/components/template-selector/template-selector';
import { FormTitle } from '@/components/form/form-title';
import { SavedForms } from '@/components/form/saved-forms';
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
  Sparkles,
  Send,
} from 'lucide-react';
import { useRef } from 'react';
import { showToast } from '@/lib/utils';
import { FieldType } from '@/types';
import { FieldRendererProps } from '@/types/components/canvas';

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
                <Label className="text-sm text-muted-foreground">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'radio':
        return (
          <RadioGroup className="space-y-3 sm:space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 sm:space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`} className="text-sm sm:text-base">{option}</Label>
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

      case 'avatar':
        return (
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" alt="Avatar preview" />
              <AvatarFallback className="text-lg">👤</AvatarFallback>
            </Avatar>
            <div className="border-muted-foreground/25 rounded-lg border-2 border-dashed p-4 text-center">
              <Upload className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload avatar
              </p>
            </div>
          </div>
        );

      case 'date':
        return (
          <div className="relative">
            <Input
              type="date"
              placeholder={field.placeholder}
              disabled
              className="border-border bg-background pr-10 text-foreground placeholder:text-muted-foreground [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
            />
            <Calendar
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => {
                const input = document.getElementById(
                  field.id
                ) as HTMLInputElement;
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
              className="border-border bg-background pr-10 text-foreground placeholder:text-muted-foreground [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
            />
            <Clock
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => {
                const input = document.getElementById(
                  field.id
                ) as HTMLInputElement;
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
              className="border-border bg-background pr-10 text-foreground placeholder:text-muted-foreground [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
            />
            <Calendar
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => {
                const input = document.getElementById(
                  field.id
                ) as HTMLInputElement;
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
              (_, i) => (
                <Star
                  key={i}
                  className="text-muted-foreground/50 h-5 w-5 cursor-pointer hover:text-yellow-400"
                  fill="currentColor"
                />
              )
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
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
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
            { id: '3', name: 'Phone', type: 'phone' as const, required: false },
          ],
          rows: [],
          allowAddRows: true,
          allowDeleteRows: true,
          maxRows: 10,
          minRows: 1,
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
                  <tr className="border-muted-foreground/20 border-b">
                    {gridConfig.columns.map(column => (
                      <th key={column.id} className="p-2 text-left font-medium">
                        {column.name}
                        {column.required && (
                          <span className="ml-1 text-red-500">*</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-muted-foreground/10 border-b">
                    {gridConfig.columns.map(column => (
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
                    {gridConfig.columns.map(column => (
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
              value={
                field.advanced?.defaultValue?.toString() ||
                '// Enter your code here...'
              }
              onChange={() => {}} // Read-only in canvas
              language={codeConfig.language || 'javascript'}
              placeholder="// Enter your code here..."
              disabled={true}
              className="w-full"
            />
          </div>
        );

      case 'submit':
        return (
          <Button
            type="submit"
            className="hover:bg-primary/90 w-full bg-primary text-primary-foreground"
            disabled
          >
            <Send className="mr-2 h-4 w-4" />
            {field.label || 'Submit'}
          </Button>
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
      } ${isDragOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''} ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={onSelect}
      draggable={field.type !== 'submit'}
      onDragStart={() => field.type !== 'submit' && onDragStart(field.id)}
      onDragOver={e => onDragOver(e, field.id)}
      onDragLeave={onDragLeave}
      onDrop={e => onDrop(e, field.id)}
    >
      <CardContent className="px-3 py-1.5">
        <div className="mb-1.5 flex items-start justify-between">
          <div className="flex-1">
            {field.type !== 'divider' && field.type !== 'submit' ? (
              <Input
                value={field.label}
                onChange={e => handleLabelChange(e.target.value)}
                className="h-auto border-none p-0 font-medium focus-visible:ring-0 dark:bg-transparent"
                onClick={e => e.stopPropagation()}
              />
            ) : field.type === 'divider' ? (
              <div className="h-auto p-0 font-medium text-muted-foreground">
                Divider
              </div>
            ) : (
              <div className="h-auto p-0 font-medium text-muted-foreground">
                Submit Button
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
              className="h-6 w-6 cursor-pointer p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            {field.type !== 'submit' && (
              <div
                className="cursor-pointer active:cursor-grabbing"
                onMouseDown={e => {
                  e.stopPropagation();
                  onDragStart(field.id);
                }}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <div className="mb-1.5">{renderFieldContent()}</div>

        {/* Only show required checkbox for input fields */}
        {!['divider', 'code', 'progress', 'submit'].includes(field.type) && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`required-${field.id}`}
                checked={field.required}
                onChange={e => {
                  e.stopPropagation();
                  handleRequiredChange(e.target.checked);
                }}
                onClick={e => e.stopPropagation()}
                className={`h-4 w-4 cursor-pointer rounded-md border border-border bg-background transition-colors ${
                  field.required
                    ? `${getCheckboxColors().bg} ${getCheckboxColors().border}`
                    : 'border-border'
                } ${getCheckboxColors().focus} ${getCheckboxColors().hover}`}
                style={{
                  accentColor: field.required
                    ? getCheckboxColors().cssColor
                    : undefined,
                }}
              />
              <Label
                htmlFor={`required-${field.id}`}
                className="cursor-pointer select-none text-xs text-muted-foreground"
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
  const updateField = useFormStore(state => state.updateField);
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
  const dragOverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const fieldRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  // Use cover and logo image from store
  const coverImage = useFormStore(state => state.coverImage);
  const logoImage = useFormStore(state => state.logoImage);
  const setCoverImage = useFormStore(state => state.setCoverImage);
  const setLogoImage = useFormStore(state => state.setLogoImage);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGE_SIZE = 200 * 1024; // 200 KB

  // Handlers for cover image
  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };
  
  // Utility to compress/resize image before storing as base64
  async function compressImage(
    file: File,
    maxSize = 800,
    quality = 0.7
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const reader = new FileReader();
      reader.onload = e => {
        img.onload = () => {
          // Calculate new size
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }
          // Draw to canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('No canvas context');
          ctx.drawImage(img, 0, 0, width, height);
          // Export as JPEG (smaller than PNG)
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        showToast(
          'Cover image is too large. Please select an image under 200 KB.',
          'error'
        );
        return;
      }
      try {
        const compressed = await compressImage(file, 400, 0.5);
        setCoverImage(compressed);
      } catch {
        // fallback to original if compression fails
        const reader = new FileReader();
        reader.onload = ev => setCoverImage(ev.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCoverImage(null);
    // Only set input value if ref is still mounted
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  // Handlers for logo image
  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        showToast(
          'Logo image is too large. Please select an image under 200 KB.',
          'error'
        );
        return;
      }
      try {
        const compressed = await compressImage(file, 400, 0.5);
        setLogoImage(compressed);
      } catch {
        // fallback to original if compression fails
        const reader = new FileReader();
        reader.onload = ev => setLogoImage(ev.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLogoImage(null);
    // Only set input value if ref is still mounted
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const scrollToField = (fieldId: string) => {
    console.log('Scrolling to field:', fieldId);
    const fieldElement = fieldRefs.current[fieldId];

    console.log('Field element:', fieldElement);

    if (fieldElement) {
      // Use scrollIntoView for simpler and more reliable scrolling
      fieldElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  };

  const handleDragStart = (fieldId: string) => {
    setDraggedFieldId(fieldId);
  };

  const handleDragOver = (e: React.DragEvent, fieldId?: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear any existing timeout
    if (dragOverTimeoutRef.current) {
      clearTimeout(dragOverTimeoutRef.current);
    }

    // Debounce the drag over updates to prevent shaky effect
    dragOverTimeoutRef.current = setTimeout(() => {
      // Check if we're dragging a new field from sidebar
      if (draggedFieldTypeRef.current) {
        setGhostFieldType(draggedFieldTypeRef.current);

        if (fieldId) {
          // Insert before specific field
          const targetField = fields.find(f => f.id === fieldId);

          // Don't allow dropping after submit buttons
          if (targetField && targetField.type === 'submit') {
            return;
          }

          // Calculate index in otherFields array
          const targetIndexInOtherFields = otherFields.findIndex(
            f => f.id === fieldId
          );
          if (targetIndexInOtherFields !== -1) {
            setGhostInsertIndex(targetIndexInOtherFields);
            setDragOverFieldId(fieldId);
          }
        } else {
          // Insert at end of otherFields
          setGhostInsertIndex(otherFields.length);
          setIsDragOverCanvas(true);
        }
      } else if (fieldId && draggedFieldId && draggedFieldId !== fieldId) {
        // Reordering existing fields - only set drag over state, don't interfere with ghost
        const draggedField = fields.find(f => f.id === draggedFieldId);
        const targetField = fields.find(f => f.id === fieldId);

        // Don't allow reordering submit buttons or dropping after them
        if (draggedField && draggedField.type === 'submit') {
          return;
        }
        if (targetField && targetField.type === 'submit') {
          return;
        }

        setDragOverFieldId(fieldId);
      } else if (!fieldId && draggedFieldTypeRef.current) {
        // Dragging over canvas area (not over a specific field)
        setGhostFieldType(draggedFieldTypeRef.current);
        setGhostInsertIndex(otherFields.length);
        setIsDragOverCanvas(true);
      }
    }, 50); // 50ms debounce
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('DragEnter triggered:', {
      draggedFieldType: draggedFieldTypeRef.current,
    });

    // Show ghost component immediately when entering canvas area
    if (draggedFieldTypeRef.current) {
      setGhostFieldType(draggedFieldTypeRef.current);
      setGhostInsertIndex(otherFields.length);
      setIsDragOverCanvas(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only clear if we're leaving the canvas area entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOverCanvas(false);
      setDragOverFieldId(null);
      // Don't clear ghost immediately to prevent flickering
      // Ghost will be cleared on drop or when drag ends
    }
  };

  const handleDrop = (e: React.DragEvent, targetFieldId?: string) => {
    e.preventDefault();
    e.stopPropagation();

    const fieldType =
      draggedFieldTypeRef.current || e.dataTransfer.getData('fieldType');

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

      // For submit buttons, always add at the end
      if (fieldType === 'submit') {
        addField(field);
        setSelectedField(field.id); // Auto-select the newly added field
      } else if (targetFieldId) {
        // Insert at specific position (but not after submit buttons)
        const targetIndex = fields.findIndex(f => f.id === targetFieldId);
        const submitButtonIndex = fields.findIndex(f => f.type === 'submit');

        if (targetIndex !== -1) {
          // If there's a submit button, insert before it
          const insertIndex =
            submitButtonIndex !== -1 && targetIndex > submitButtonIndex
              ? submitButtonIndex
              : targetIndex;

          const newFields = [...fields];
          newFields.splice(insertIndex, 0, field);
          // Update the store with the new field order
          // This is a bit hacky but works for now
          fields.forEach((_, index) => {
            if (index >= insertIndex) {
              removeField(fields[index].id);
            }
          });
          newFields.forEach((f, index) => {
            if (index >= insertIndex) {
              addField(f);
            }
          });
          setSelectedField(field.id); // Auto-select the newly added field
        }
      } else {
        // Add to end (but before submit buttons)
        const submitButtonIndex = fields.findIndex(f => f.type === 'submit');
        if (submitButtonIndex !== -1) {
          // Insert before submit button
          const newFields = [...fields];
          newFields.splice(submitButtonIndex, 0, field);
          fields.forEach((_, index) => {
            if (index >= submitButtonIndex) {
              removeField(fields[index].id);
            }
          });
          newFields.forEach((f, index) => {
            if (index >= submitButtonIndex) {
              addField(f);
            }
          });
          setSelectedField(field.id); // Auto-select the newly added field
        } else {
          addField(field);
          setSelectedField(field.id); // Auto-select the newly added field
        }
      }
    } else if (
      draggedFieldId &&
      targetFieldId &&
      draggedFieldId !== targetFieldId
    ) {
      // Reordering existing fields (but not submit buttons)
      const draggedField = fields.find(f => f.id === draggedFieldId);
      if (draggedField && draggedField.type === 'submit') {
        // Don't allow reordering submit buttons
        return;
      }

      const fromIndex = fields.findIndex(f => f.id === draggedFieldId);
      const toIndex = fields.findIndex(f => f.id === targetFieldId);
      const submitButtonIndex = fields.findIndex(f => f.type === 'submit');

      if (fromIndex !== -1 && toIndex !== -1) {
        // Don't allow moving fields after submit button
        const adjustedToIndex =
          submitButtonIndex !== -1 && toIndex > submitButtonIndex
            ? submitButtonIndex
            : toIndex;

        if (adjustedToIndex !== toIndex) {
          // If we adjusted the position, we need to handle it differently
          const newFields = [...fields];
          const [movedField] = newFields.splice(fromIndex, 1);
          newFields.splice(adjustedToIndex, 0, movedField);

          // Update the store
          fields.forEach((_, index) => {
            if (index >= Math.min(fromIndex, adjustedToIndex)) {
              removeField(fields[index].id);
            }
          });
          newFields.forEach((f, index) => {
            if (index >= Math.min(fromIndex, adjustedToIndex)) {
              addField(f);
            }
          });
        } else {
          reorderFields(fromIndex, adjustedToIndex);
        }
      }
    }

    // Clear any pending timeout
    if (dragOverTimeoutRef.current) {
      clearTimeout(dragOverTimeoutRef.current);
      dragOverTimeoutRef.current = null;
    }

    setDraggedFieldId(null);
    setDragOverFieldId(null);
    setIsDragOverCanvas(false);
    setGhostFieldType(null);
    setGhostInsertIndex(null);
    draggedFieldTypeRef.current = null;
  };

  // Scroll to selected field when it changes
   useEffect(() => {
    if (selectedFieldId) {
      console.log('Selected field changed to:', selectedFieldId);
      // Use a longer delay to ensure the field is fully rendered
      const timeoutId = setTimeout(() => {
        scrollToField(selectedFieldId);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedFieldId]);

  // Handle keyboard navigation and shortcuts
   useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard shortcuts if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // ESC key to cancel drag or deselect field
      if (e.key === 'Escape') {
        if (ghostFieldType || draggedFieldId) {
          setDraggedFieldId(null);
          setDragOverFieldId(null);
          setIsDragOverCanvas(false);
          setGhostFieldType(null);
          setGhostInsertIndex(null);
          draggedFieldTypeRef.current = null;
        } else if (selectedFieldId) {
          setSelectedField(null);
        }
        return;
      }

      // Arrow key navigation for field selection
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();

        if (fields.length === 0) return;

        const currentIndex = fields.findIndex(f => f.id === selectedFieldId);
        let newIndex: number;

        if (e.key === 'ArrowUp') {
          // Navigate to previous field
          newIndex = currentIndex > 0 ? currentIndex - 1 : fields.length - 1;
        } else {
          // Navigate to next field
          newIndex = currentIndex < fields.length - 1 ? currentIndex + 1 : 0;
        }

        const newFieldId = fields[newIndex]?.id;
        if (newFieldId) {
          setSelectedField(newFieldId);
          scrollToField(newFieldId);
        }
        return;
      }

      // Delete/Backspace to remove selected field
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedFieldId) {
        e.preventDefault();
        removeField(selectedFieldId);
        setSelectedField(null);
        return;
      }

      // Enter to edit field label (focus on label input)
      if (e.key === 'Enter' && selectedFieldId) {
        e.preventDefault();
        const fieldElement = fieldRefs.current[selectedFieldId];
        if (fieldElement) {
          const labelInput = fieldElement.querySelector(
            'input[type="text"]'
          ) as HTMLInputElement;
          if (labelInput) {
            labelInput.focus();
            labelInput.select();
          }
        }
        return;
      }

      // Space to toggle required field
      if (e.key === ' ' && selectedFieldId) {
        e.preventDefault();
        const selectedField = fields.find(f => f.id === selectedFieldId);
        if (selectedField) {
          updateField(selectedFieldId, { required: !selectedField.required });
        }
        return;
      }

      // Ctrl+A to select all fields (or first field if none selected)
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        if (fields.length > 0) {
          const firstFieldId = fields[0].id;
          setSelectedField(firstFieldId);
          scrollToField(firstFieldId);
        }
        return;
      }

      // Ctrl+D to duplicate selected field
      if (e.ctrlKey && e.key === 'd' && selectedFieldId) {
        e.preventDefault();
        const selectedField = fields.find(f => f.id === selectedFieldId);
        if (selectedField) {
          const duplicatedField = {
            ...selectedField,
            id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            label: `${selectedField.label} (Copy)`,
          };
          const currentIndex = fields.findIndex(f => f.id === selectedFieldId);
          // Add the duplicated field after the current field
          const newFields = [...fields];
          newFields.splice(currentIndex + 1, 0, duplicatedField);
          // Update the store with the new field order
          fields.forEach((_, index) => {
            if (index > currentIndex) {
              removeField(fields[index].id);
            }
          });
          newFields.forEach((f, index) => {
            if (index > currentIndex) {
              addField(f);
            }
          });
          setSelectedField(duplicatedField.id);
          scrollToField(duplicatedField.id);
        }
        return;
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
      // Clear any pending timeout
      if (dragOverTimeoutRef.current) {
        clearTimeout(dragOverTimeoutRef.current);
        dragOverTimeoutRef.current = null;
      }

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
  }, [
    ghostFieldType,
    draggedFieldId,
    selectedFieldId,
    fields,
    setSelectedField,
    removeField,
    addField,
    updateField,
  ]);

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
              className="bg-muted/50 resize-none border-dashed"
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
            <RadioGroup className="space-y-3 sm:space-y-2">
              {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
                <div key={index} className="flex items-center space-x-3 sm:space-x-2">
                  <RadioGroupItem
                    value={option}
                    id={`ghost-${index}`}
                    disabled
                  />
                  <Label
                    htmlFor={`ghost-${index}`}
                    className="text-muted-foreground text-sm sm:text-base"
                  >
                    {option}
                  </Label>
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
            <div className="border-muted-foreground/25 bg-muted/50 rounded-lg border-2 border-dashed p-6 text-center">
              <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload {fieldType} files
              </p>
            </div>
          );

        case 'avatar':
          return (
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="bg-muted/50 h-16 w-16">
                <AvatarFallback className="text-lg text-muted-foreground">
                  👤
                </AvatarFallback>
              </Avatar>
              <div className="border-muted-foreground/25 bg-muted/50 rounded-lg border-2 border-dashed p-4 text-center">
                <Upload className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload avatar
                </p>
              </div>
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
                className="[&::-webkit-slider-thumb]:bg-primary/50 [&::-moz-range-thumb]:bg-primary/50 h-2 w-full cursor-pointer appearance-none rounded-lg border-dashed bg-gray-200/50 dark:bg-gray-700/50 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>0</span>
                <span>100</span>
              </div>
              <div className="text-center text-sm text-muted-foreground">0</div>
            </div>
          );

        case 'divider':
          return <Separator className="my-4 border-dashed" />;

        case 'submit':
          return (
            <Button
              type="submit"
              className="bg-primary/50 hover:bg-primary/60 w-full border-dashed text-primary-foreground"
              disabled
            >
              <Send className="mr-2 h-4 w-4" />
              Submit
            </Button>
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
      <Card className="bg-muted/20 border-2 border-dashed opacity-60">
        <CardContent className="px-3 py-1.5">
          <div className="mb-1.5 flex items-start justify-between">
            <div className="flex-1">
              <Input
                value={getDefaultLabel(fieldType)}
                disabled
                className="h-auto border-none bg-transparent p-0 font-medium text-muted-foreground"
              />
            </div>
          </div>
          <div className="mb-1.5">{renderGhostContent()}</div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                disabled
                className="h-4 w-4 cursor-pointer rounded-md border border-border bg-background opacity-50 transition-colors"
              />
              <Label className="cursor-pointer select-none text-xs text-muted-foreground">
                Required
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Separate submit buttons from other fields
  const submitFields = fields.filter(field => field.type === 'submit');
  const otherFields = fields.filter(field => field.type !== 'submit');

  return (
    <motion.div
      className="flex h-full flex-col bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main content area with scroll */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6"
        onDragEnter={handleDragEnter}
        onDragOver={e => handleDragOver(e)}
        onDragLeave={handleDragLeave}
        onDrop={e => handleDrop(e)}
      >
        <motion.div
          className="mx-auto w-full max-w-4xl space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onDragEnter={handleDragEnter}
          onDragOver={e => handleDragOver(e)}
          onDragLeave={handleDragLeave}
          onDrop={e => handleDrop(e)}
        >
          {/* Cover Image Placeholder */}
          <div
            className="group relative mb-[-3.5rem] h-48 w-full cursor-pointer overflow-hidden rounded-xl"
            onClick={handleCoverClick}
          >
            {coverImage ? (
              <img
                src={coverImage}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="bg-muted-foreground/10 flex h-full w-full items-center justify-center text-lg font-medium text-muted-foreground">
                Click to upload cover image
              </div>
            )}
            {coverImage && (
              <button
                type="button"
                className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                onClick={handleRemoveCover}
                title="Remove cover image"
                tabIndex={0}
              >
                ×
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
          </div>
          {/* Logo Placeholder (overlapping cover, now left-aligned) */}
          <div
            className="group relative z-10 flex justify-start"
            style={{ marginTop: '-2.5rem', marginBottom: '1.5rem' }}
          >
            <div className="relative ml-6" onClick={handleLogoClick}>
              {logoImage ? (
                <img
                  src={logoImage}
                  alt="Logo"
                  className="h-20 w-20 cursor-pointer rounded-full border-4 border-neutral-300 bg-background object-cover shadow-lg dark:border-neutral-700"
                />
              ) : (
                <div className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-4 border-neutral-300 bg-background text-3xl text-muted-foreground shadow-lg dark:border-neutral-700">
                  +
                </div>
              )}
              {logoImage && (
                <button
                  type="button"
                  className="absolute right-0 top-0 z-10 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                  onClick={handleRemoveLogo}
                  title="Remove logo"
                  style={{ transform: 'translate(40%, -40%)' }}
                  tabIndex={0}
                >
                  ×
                </button>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
          </div>
          {/* Form Title */}
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
                  isDragOverCanvas
                    ? 'bg-primary/5 border-primary/30 rounded-lg border-2 border-dashed'
                    : ''
                }`}
                onDragOver={e => handleDragOver(e)}
                onDrop={e => handleDrop(e)}
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
                  Drag and drop components from the sidebar to start building
                  your form
                </motion.p>
                <motion.p
                  className="mb-6 font-medium text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  or
                </motion.p>
                <motion.p
                  className="text-muted-foreground/70 mb-4 text-xs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  💡 Tip: Use arrow keys to navigate fields, F1 for keyboard
                  shortcuts
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
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Choose a Template
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <div className="my-6 flex items-center gap-4">
                    <Separator className="flex-1" />
                    <span className="text-xs font-medium text-muted-foreground">
                      OR
                    </span>
                    <Separator className="flex-1" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <SavedForms />
                </motion.div>
              </motion.div>
            ) : (
              <AnimatePresence>
                {otherFields
                  .filter(field => shouldShowField(field)) // Only show fields that meet conditional logic
                  .map((field, index) => (
                    <motion.div
                      key={field.id}
                      ref={el => {
                        fieldRefs.current[field.id] = el;
                      }}
                      initial={{ opacity: 0, x: -20, y: 10 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      exit={{ opacity: 0, x: 20, y: -10, height: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: 'easeOut',
                      }}
                      layout
                    >
                      {/* Drop zone above each field */}
                      <div
                        className={`h-2 transition-all duration-200 ${
                          dragOverFieldId === field.id
                            ? 'bg-primary/20'
                            : 'bg-transparent'
                        }`}
                        onDragOver={e => handleDragOver(e, field.id)}
                        onDrop={e => handleDrop(e, field.id)}
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
          {ghostFieldType && ghostInsertIndex === otherFields.length && (
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
              isDragOverCanvas && !dragOverFieldId
                ? 'bg-primary/20'
                : 'bg-transparent'
            }`}
            onDragOver={e => handleDragOver(e)}
            onDrop={e => handleDrop(e)}
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
              <TemplateSelector
                onClose={() => setShowTemplateSelector(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed submit buttons at bottom */}
      {submitFields.length > 0 && (
        <motion.div
          className="border-t bg-background p-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="mx-auto max-w-4xl space-y-4">
            {submitFields.map((field, index) => (
              <motion.div
                key={field.id}
                ref={el => {
                  fieldRefs.current[field.id] = el;
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
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
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

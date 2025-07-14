'use client';

import React from 'react';
import { useFormStore, Field } from '@/lib/store';
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
import {
  Trash2,
  GripVertical,
  Upload,
  Calendar,
  Clock,
  Star,
  Grid3X3,
  Send,
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

export const FieldRenderer: React.FC<FieldRendererProps> = ({
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
              min={field.sliderConfig?.min ?? 0}
              max={field.sliderConfig?.max ?? 100}
              step={field.sliderConfig?.step ?? 1}
              defaultValue={field.sliderConfig?.defaultValue ?? 0}
              disabled
              className="[&::-webkit-slider-thumb]:bg-primary/50 [&::-moz-range-thumb]:bg-primary/50 h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full"
            />
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>{field.sliderConfig?.min ?? 0}</span>
              <span>{field.sliderConfig?.defaultValue ?? 0}</span>
              <span>{field.sliderConfig?.max ?? 100}</span>
            </div>
          </div>
        );

      case 'divider':
        return <Separator className="my-4" />;

      case 'submit':
        return (
          <Button
            type="submit"
            className="w-full"
            disabled
          >
            <Send className="mr-2 h-4 w-4" />
            {field.label || 'Submit'}
          </Button>
        );

      case 'grid':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Grid3X3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Grid Layout
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Columns: {field.gridConfig?.columns?.length || 2}
            </div>
          </div>
        );

      default:
        return (
          <Input
            placeholder="Field preview"
            disabled
            className="bg-muted"
          />
        );
    }
  };

  const colors = getCheckboxColors();

  return (
    <Card
      className={`relative cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'ring-2 ring-primary shadow-lg'
          : 'hover:shadow-md'
      } ${isDragOver ? 'ring-2 ring-primary/50' : ''} ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={onSelect}
      draggable
      onDragStart={() => onDragStart(field.id)}
      onDragOver={e => onDragOver(e, field.id)}
      onDragLeave={onDragLeave}
      onDrop={e => onDrop(e, field.id)}
    >
      <CardContent className="px-3 py-1.5">
        <div className="mb-1.5 flex items-start justify-between">
          <div className="flex-1">
            <Input
              value={field.label}
              onChange={e => handleLabelChange(e.target.value)}
              className="h-auto border-none bg-transparent p-0 font-medium focus-visible:ring-0 !bg-transparent !dark:bg-transparent"
              placeholder="Field label"
            />
          </div>
          <div className="ml-2 flex items-center space-x-1">
            <button
              type="button"
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              onClick={e => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete field"
            >
              <Trash2 className="h-3 w-3" />
            </button>
            <div
              className="cursor-grab p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Drag to reorder"
            >
              <GripVertical className="h-3 w-3" />
            </div>
          </div>
        </div>
        <div className="mb-1.5">{renderFieldContent()}</div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={field.required}
              onCheckedChange={handleRequiredChange}
              onClick={e => e.stopPropagation()}
              className={`${colors.border} ${colors.focus} ${colors.hover}`}
              style={{
                '--checkbox-color': colors.cssColor,
              } as React.CSSProperties}
            />
            <Label className="cursor-pointer select-none text-xs">
              Required
            </Label>
          </div>
          {field.type === 'checkbox' && (
            <div className="flex items-center space-x-2">
              <Switch
                // No checked property on Field, so just render the switch as disabled
                checked={false}
                disabled
                onClick={e => e.stopPropagation()}
              />
              <Label className="cursor-pointer select-none text-xs">
                Checked by default
              </Label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 
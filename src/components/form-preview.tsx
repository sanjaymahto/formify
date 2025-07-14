'use client';

import { useFormStore, Field } from '@/lib/store';
import { useSettingsStore } from '@/lib/settings-store';
import { Card } from '@/components/ui/card';
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
import { Calendar, Clock, Upload, Send } from 'lucide-react';
import { useState, useRef } from 'react';
import { CodeEditor } from '@/components/ui/code-editor';
import { showToast } from '@/lib/utils';
import { Grid3X3 } from 'lucide-react';

export function FormPreview() {
  const fields = useFormStore(state => state.fields);
  const { colorPalette } = useSettingsStore();
  const [formData, setFormData] = useState<
    Record<string, string | number | boolean | string[]>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState<Record<string, boolean>>({});
  const [selectedFiles, setSelectedFiles] = useState<
    Record<string, FileList | null>
  >({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const getButtonColors = () => {
    const colors = {
      default: {
        bg: 'bg-blue-500',
        hover: 'hover:bg-blue-600',
        text: 'text-white',
      },
      blue: {
        bg: 'bg-blue-500',
        hover: 'hover:bg-blue-600',
        text: 'text-white',
      },
      green: {
        bg: 'bg-green-500',
        hover: 'hover:bg-green-600',
        text: 'text-white',
      },
      purple: {
        bg: 'bg-purple-500',
        hover: 'hover:bg-purple-600',
        text: 'text-white',
      },
      orange: {
        bg: 'bg-orange-500',
        hover: 'hover:bg-orange-600',
        text: 'text-white',
      },
      pink: {
        bg: 'bg-pink-500',
        hover: 'hover:bg-pink-600',
        text: 'text-white',
      },
      red: {
        bg: 'bg-red-500',
        hover: 'hover:bg-red-600',
        text: 'text-white',
      },
      teal: {
        bg: 'bg-teal-500',
        hover: 'hover:bg-teal-600',
        text: 'text-white',
      },
      indigo: {
        bg: 'bg-indigo-500',
        hover: 'hover:bg-indigo-600',
        text: 'text-white',
      },
      yellow: {
        bg: 'bg-yellow-500',
        hover: 'hover:bg-yellow-600',
        text: 'text-black',
      },
    };
    return colors[colorPalette] || colors.default;
  };

  const handleInputChange = (
    fieldId: string,
    value: string | number | boolean | string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      if (field.required) {
        const value = formData[field.id];
        if (
          !value ||
          (Array.isArray(value) && value.length === 0) ||
          value === ''
        ) {
          newErrors[field.id] = `${field.label} is required`;
        }
      }

      // Email validation
      if (field.type === 'email' && formData[field.id]) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        const emailValue = String(formData[field.id]).trim();
        if (!emailRegex.test(emailValue)) {
          newErrors[field.id] = 'Please enter a valid email address';
        }
      }

      // Text input settings validation
      if (formData[field.id] && field.textConfig) {
        const value = String(formData[field.id]);
        const { minLength, maxLength, pattern } = field.textConfig;

        if (minLength && value.length < minLength) {
          newErrors[field.id] = `${field.label} must be at least ${minLength} characters`;
        }

        if (maxLength && value.length > maxLength) {
          newErrors[field.id] = `${field.label} must be no more than ${maxLength} characters`;
        }

        if (pattern && !new RegExp(pattern).test(value)) {
          newErrors[field.id] = `${field.label} format is invalid`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      showToast('Form submitted successfully! Check console for data.', 'success');
    }
  };

  const renderField = (field: Field) => {
    const fieldError = errors[field.id];
    const fieldValue = formData[field.id] || '';

    const baseClasses = `w-full transition-all duration-200 ${
      fieldError ? 'border-red-500 focus:border-red-500' : ''
    }`;

    // Helper function to safely convert fieldValue to string
    const getStringValue = () => {
      if (typeof fieldValue === 'string') return fieldValue;
      if (typeof fieldValue === 'number') return fieldValue.toString();
      if (typeof fieldValue === 'boolean') return fieldValue.toString();
      if (Array.isArray(fieldValue)) return fieldValue.join(', ');
      return '';
    };

    switch (field.type) {
      case 'text':
      case 'phone':
      case 'url':
        return (
          <Input
            type={field.type === 'url' ? 'url' : 'text'}
            value={getStringValue() || field.advanced?.defaultValue?.toString() || ''}
            onChange={e => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.type}`}
            className={baseClasses}
            pattern={field.textConfig?.pattern}
            minLength={field.textConfig?.minLength}
            maxLength={field.textConfig?.maxLength}
            autoFocus={field.textConfig?.autoFocus}
            disabled={field.advanced?.disabled}
            readOnly={field.advanced?.readonly}
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            value={fieldValue as string}
            onChange={e => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || 'Enter email'}
            className={baseClasses}
          />
        );

      case 'password':
        return (
          <Input
            type="password"
            value={fieldValue as string}
            onChange={e => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || 'Enter password'}
            className={baseClasses}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={fieldValue as string}
            onChange={e => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || 'Enter number'}
            className={baseClasses}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={fieldValue as string}
            onChange={e => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || 'Enter text'}
            className={baseClasses}
            rows={3}
          />
        );

      case 'select':
        return (
          <Select
            value={fieldValue as string}
            onValueChange={value => handleInputChange(field.id, value)}
          >
            <SelectTrigger className={baseClasses}>
              <SelectValue
                placeholder={field.placeholder || 'Select an option'}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string, index: number) => (
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
            {field.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${index}`}
                  checked={
                    Array.isArray(fieldValue)
                      ? fieldValue.includes(option)
                      : false
                  }
                  onCheckedChange={checked => {
                    const currentValues = Array.isArray(fieldValue)
                      ? fieldValue
                      : [];
                    const newValues = checked
                      ? [...currentValues, option]
                      : currentValues.filter(val => val !== option);
                    handleInputChange(field.id, newValues);
                  }}
                  className={fieldError ? 'border-red-500' : ''}
                />
                <Label
                  htmlFor={`${field.id}-${index}`}
                  className="text-sm text-gray-600"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={fieldValue as boolean}
              onCheckedChange={checked =>
                handleInputChange(field.id, checked as boolean)
              }
              className={fieldError ? 'border-red-500' : ''}
            />
            <Label className="text-sm text-gray-600">{field.label}</Label>
          </div>
        );

      case 'radio':
        return (
          <RadioGroup
            value={fieldValue as string}
            onValueChange={value => handleInputChange(field.id, value)}
          >
            {field.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} />
                <Label className="text-sm text-gray-600">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'date':
        return (
          <div className="relative">
            <Input
              type="date"
              value={fieldValue as string}
              onChange={e => handleInputChange(field.id, e.target.value)}
              className={`${baseClasses} focus:ring-primary/20 border-border bg-background pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden`}
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
              value={fieldValue as string}
              onChange={e => handleInputChange(field.id, e.target.value)}
              className={`${baseClasses} focus:ring-primary/20 border-border bg-background pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden`}
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
              value={fieldValue as string}
              onChange={e => handleInputChange(field.id, e.target.value)}
              className={`${baseClasses} focus:ring-primary/20 border-border bg-background pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden`}
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

      case 'file':
      case 'image':
        const handleDrag = (e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
        };

        const handleDragIn = (e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDragActive(prev => ({ ...prev, [field.id]: true }));
          }
        };

        const handleDragOut = (e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(prev => ({ ...prev, [field.id]: false }));
        };

        const handleDrop = (e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(prev => ({ ...prev, [field.id]: false }));

          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setSelectedFiles(prev => ({
              ...prev,
              [field.id]: e.dataTransfer.files,
            }));
            handleInputChange(field.id, e.dataTransfer.files);
          }
        };

        const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles(prev => ({ ...prev, [field.id]: e.target.files }));
            handleInputChange(field.id, e.target.files);
          }
        };

        const handleClick = () => {
          fileInputRefs.current[field.id]?.click();
        };

        return (
          <div
            className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
              dragActive[field.id]
                ? 'bg-primary/5 border-primary'
                : 'border-muted-foreground/25 hover:border-primary/50'
            } ${fieldError ? 'border-red-500' : ''}`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              {dragActive[field.id]
                ? 'Drop files here'
                : `Click or drag to upload ${field.type} files`}
            </p>
            {field.fileConfig?.maxSize && (
              <p className="text-xs text-muted-foreground">
                Max size: {field.fileConfig.maxSize}MB
              </p>
            )}
            {selectedFiles[field.id] && (
              <div className="mt-2 text-xs text-muted-foreground">
                {Array.from(selectedFiles[field.id]!).map((file, index) => (
                  <div key={index} className="text-green-600">
                    ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                  </div>
                ))}
              </div>
            )}
            <Input
              ref={el => {
                fileInputRefs.current[field.id] = el;
              }}
              type="file"
              accept={
                field.fileConfig?.accept ||
                (field.type === 'image' ? 'image/*' : undefined)
              }
              multiple={field.fileConfig?.multiple}
              onChange={handleFileSelect}
              className="hidden"
              id={`file-${field.id}`}
            />
          </div>
        );

      case 'color':
        return (
          <Input
            type="color"
            value={fieldValue as string}
            onChange={e => handleInputChange(field.id, e.target.value)}
            className={baseClasses}
          />
        );

      case 'rating':
        return (
          <div className="flex items-center space-x-1">
            {Array.from(
              { length: field.ratingConfig?.maxRating || 5 },
              (_, i) => {
                const starValue = i + 1;
                const minRating = field.ratingConfig?.minRating || 1;
                const maxRating = field.ratingConfig?.maxRating || 5;
                const allowHalf = field.ratingConfig?.allowHalf || false;
                const currentRating = fieldValue || 0;

                if (allowHalf) {
                  return (
                    <div key={i} className="relative">
                      <button
                        type="button"
                        className={`text-2xl ${
                          starValue <= currentRating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        onClick={() => handleInputChange(field.id, starValue)}
                      >
                        ★
                      </button>
                      {starValue - 0.5 <= currentRating &&
                        currentRating < starValue && (
                          <div className="absolute inset-0 overflow-hidden">
                            <button
                              type="button"
                              className="text-2xl text-yellow-400"
                              style={{ clipPath: 'inset(0 50% 0 0)' }}
                            >
                              ★
                            </button>
                          </div>
                        )}
                      <button
                        type="button"
                        className="absolute inset-0"
                        onClick={() =>
                          handleInputChange(field.id, starValue - 0.5)
                        }
                        style={{ width: '50%' }}
                      />
                    </div>
                  );
                } else {
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleInputChange(field.id, starValue)}
                      className={`text-2xl ${
                        starValue <= currentRating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  );
                }
              }
            )}
            {field.ratingConfig?.showLabels && fieldValue && (
              <span className="ml-2 text-sm text-muted-foreground">
                {field.ratingConfig.labels?.[
                  Math.floor((fieldValue as number) - 1)
                ] || `${fieldValue} stars`}
              </span>
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
              value={
                fieldValue !== undefined
                  ? (fieldValue as number)
                  : (field.sliderConfig?.defaultValue ?? 0)
              }
              onChange={e =>
                handleInputChange(field.id, parseInt(e.target.value))
              }
              className="h-2 w-full cursor-pointer appearance-none rounded-lg border-2 border-gray-300 bg-gray-200 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-700 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
            <div className="mt-1 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>{field.sliderConfig?.min || 0}</span>
              <span>
                {fieldValue !== undefined
                  ? (fieldValue as number)
                  : (field.sliderConfig?.defaultValue ?? 0)}
              </span>
              <span>{field.sliderConfig?.max || 100}</span>
            </div>
            {field.sliderConfig?.showValue && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {fieldValue !== undefined
                  ? (fieldValue as number)
                  : (field.sliderConfig?.defaultValue ?? 0)}
              </div>
            )}
          </div>
        );

      case 'toggle':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={fieldValue as boolean}
              onChange={e => handleInputChange(field.id, e.target.checked)}
              className="h-4 w-4 rounded border-2 border-gray-300 bg-transparent text-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600"
            />
            <Label className="text-sm text-gray-600">{field.label}</Label>
          </div>
        );

      case 'tags':
        return (
          <Input
            type="text"
            value={fieldValue as string}
            onChange={e => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || 'Enter tags separated by commas'}
            className={baseClasses}
          />
        );

      case 'divider':
        return <hr className="my-4 border-gray-300" />;

      case 'code':
        const codeConfig = field.codeConfig || {
          language: 'javascript',
          theme: 'one-dark',
          lineNumbers: true,
          autoComplete: true,
          syntaxHighlighting: true,
        };

        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Language: {codeConfig.language}</span>
            </div>
            <CodeEditor
              value={(fieldValue as string) || ''}
              onChange={value => handleInputChange(field.id, value)}
              language={codeConfig.language || 'javascript'}
              placeholder="// Enter your code here..."
              className="w-full"
            />
          </div>
        );

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

        // Get current grid data from form store
        const gridData = formData[field.id] as Record<string, any>[] || [];
        
        // Initialize with minimum rows if no data exists
        const currentRows = Array.isArray(gridData) && gridData.length > 0 ? gridData : Array(gridConfig.minRows || 1).fill(null).map(() => ({}));

        const addRow = () => {
          if (currentRows.length < (gridConfig.maxRows || 10)) {
            const newRows = [...currentRows, {}];
            handleInputChange(field.id, newRows);
          }
        };

        const removeRow = (index: number) => {
          if (currentRows.length > (gridConfig.minRows || 1)) {
            const newRows = currentRows.filter((_, i) => i !== index);
            handleInputChange(field.id, newRows);
          }
        };

        const updateRowData = (rowIndex: number, columnId: string, value: any) => {
          const newRows = [...currentRows];
          if (!newRows[rowIndex]) {
            newRows[rowIndex] = {};
          }
          newRows[rowIndex][columnId] = value;
          handleInputChange(field.id, newRows);
        };

        const renderGridInput = (column: any, rowIndex: number) => {
          const rowData = currentRows[rowIndex] || {};
          const value = rowData[column.id] || '';

          const handleChange = (newValue: any) => {
            updateRowData(rowIndex, column.id, newValue);
          };

          switch (column.type) {
            case 'text':
              return (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder={`Enter ${column.name.toLowerCase()}`}
                  className="w-full rounded border-2 border-gray-300 px-2 py-1 text-sm transition-[border-color] hover:border-blue-400 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 dark:border-gray-600 dark:hover:border-blue-500 dark:focus-visible:border-blue-400"
                />
              );
            case 'number':
              return (
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder={`Enter ${column.name.toLowerCase()}`}
                  className="w-full rounded border-2 border-gray-300 px-2 py-1 text-sm transition-[border-color] hover:border-blue-400 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 dark:border-gray-600 dark:hover:border-blue-500 dark:focus-visible:border-blue-400"
                />
              );
            case 'date':
              return (
                <input
                  type="date"
                  value={value}
                  onChange={(e) => handleChange(e.target.value)}
                  className="w-full rounded border-2 border-gray-300 px-2 py-1 text-sm transition-[border-color] hover:border-blue-400 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 dark:border-gray-600 dark:hover:border-blue-500 dark:focus-visible:border-blue-400"
                />
              );
            case 'time':
              return (
                <input
                  type="time"
                  value={value}
                  onChange={(e) => handleChange(e.target.value)}
                  className="w-full rounded border-2 border-gray-300 px-2 py-1 text-sm transition-[border-color] hover:border-blue-400 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 dark:border-gray-600 dark:hover:border-blue-500 dark:focus-visible:border-blue-400"
                />
              );
            case 'datetime':
              return (
                <input
                  type="datetime-local"
                  value={value}
                  onChange={(e) => handleChange(e.target.value)}
                  className="w-full rounded border-2 border-gray-300 px-2 py-1 text-sm transition-[border-color] hover:border-blue-400 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 dark:border-gray-600 dark:hover:border-blue-500 dark:focus-visible:border-blue-400"
                />
              );
            case 'email':
              return (
                <input
                  type="email"
                  value={value}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder={`Enter ${column.name.toLowerCase()}`}
                  className="w-full rounded border-2 border-gray-300 px-2 py-1 text-sm transition-[border-color] hover:border-blue-400 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 dark:border-gray-600 dark:hover:border-blue-500 dark:focus-visible:border-blue-400"
                />
              );
            case 'phone':
              return (
                <input
                  type="tel"
                  value={value}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder={`Enter ${column.name.toLowerCase()}`}
                  className="w-full rounded border-2 border-gray-300 px-2 py-1 text-sm transition-[border-color] hover:border-blue-400 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 dark:border-gray-600 dark:hover:border-blue-500 dark:focus-visible:border-blue-400"
                />
              );
            case 'url':
              return (
                <input
                  type="url"
                  value={value}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder={`Enter ${column.name.toLowerCase()}`}
                  className="w-full rounded border-2 border-gray-300 px-2 py-1 text-sm transition-[border-color] hover:border-blue-400 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 dark:border-gray-600 dark:hover:border-blue-500 dark:focus-visible:border-blue-400"
                />
              );
            case 'select':
              return (
                <select 
                  value={value}
                  onChange={(e) => handleChange(e.target.value)}
                  className="w-full rounded border-2 border-gray-300 px-2 py-1 text-sm transition-[border-color] hover:border-blue-400 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 dark:border-gray-600 dark:hover:border-blue-500 dark:focus-visible:border-blue-400"
                >
                  <option value="">Select {column.name.toLowerCase()}</option>
                  {column.options?.map((option: string, index: number) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  )) || (
                    <>
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                      <option value="option3">Option 3</option>
                    </>
                  )}
                </select>
              );
            case 'checkbox':
              return (
                <input
                  type="checkbox"
                  checked={value || false}
                  onChange={(e) => handleChange(e.target.checked)}
                  className="h-4 w-4 rounded border-2 border-gray-300 bg-transparent text-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600"
                />
              );
            default:
              return (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder={`Enter ${column.name.toLowerCase()}`}
                  className="w-full rounded border-2 border-gray-300 px-2 py-1 text-sm transition-[border-color] hover:border-blue-400 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 dark:border-gray-600 dark:hover:border-blue-500 dark:focus-visible:border-blue-400"
                />
              );
          }
        };

        return (
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Grid3X3 className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{field.label}</span>
              </div>
              {gridConfig.allowAddRows && (
                <button
                  type="button"
                  onClick={addRow}
                  disabled={currentRows.length >= (gridConfig.maxRows || 10)}
                  className="rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Add Row
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {gridConfig.columns.map(column => (
                      <th
                        key={column.id}
                        className="p-2 text-left font-medium text-gray-700"
                      >
                        {column.name}
                        {column.required && (
                          <span className="ml-1 text-red-500">*</span>
                        )}
                      </th>
                    ))}
                    {gridConfig.allowDeleteRows && (
                      <th className="p-2 text-left font-medium text-gray-700 w-12">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-gray-100">
                      {gridConfig.columns.map(column => (
                        <td key={column.id} className="p-2">
                          {renderGridInput(column, rowIndex)}
                        </td>
                      ))}
                      {gridConfig.allowDeleteRows && (
                        <td className="p-2">
                          <button
                            type="button"
                            onClick={() => removeRow(rowIndex)}
                            disabled={currentRows.length <= (gridConfig.minRows || 1)}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ✕
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'other':
        return (
          <Input
            type="text"
            value={fieldValue as string}
            onChange={e => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || 'Enter value'}
            className={baseClasses}
          />
        );

      case 'submit':
        const buttonColors = getButtonColors();
        const hasOtherFields = fields.some(f => f.type !== 'submit');
        const isDisabled = !hasOtherFields;

        return (
          <Button
            type="submit"
            className={`w-full ${buttonColors.bg} ${buttonColors.hover} ${buttonColors.text} ${
              isDisabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={isDisabled}
          >
            <Send className="mr-2 h-4 w-4" />
            {field.label || 'Submit'}
          </Button>
        );

      default:
        return (
          <Input
            type="text"
            value={fieldValue as string}
            onChange={e => handleInputChange(field.id, e.target.value)}
            placeholder="Unknown field type"
            className={baseClasses}
          />
        );
    }
  };

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No form fields
        </h3>
        <p className="max-w-sm text-gray-500">
          Add some fields in the builder to see the form preview here.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[60%] p-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Sample Form
            </h2>
            <p className="text-gray-600">
              This is how your form will appear to users
            </p>
          </div>

          {fields.map(field => {
            // Apply layout styles
            const layoutStyles: React.CSSProperties = {};
            if (field.layout) {
              if (field.layout.width) layoutStyles.width = field.layout.width;
              if (field.layout.height) layoutStyles.height = field.layout.height;
              if (field.layout.margin) layoutStyles.margin = field.layout.margin;
              if (field.layout.padding) layoutStyles.padding = field.layout.padding;
              if (field.layout.display) layoutStyles.display = field.layout.display;
              if (field.layout.flexDirection) layoutStyles.flexDirection = field.layout.flexDirection;
              if (field.layout.justifyContent) layoutStyles.justifyContent = field.layout.justifyContent;
              if (field.layout.alignItems) layoutStyles.alignItems = field.layout.alignItems;
              if (field.layout.gridTemplateColumns) layoutStyles.gridTemplateColumns = field.layout.gridTemplateColumns;
              if (field.layout.gridGap) layoutStyles.gap = field.layout.gridGap;
            }

            return (
              <div key={field.id} className="space-y-2" style={layoutStyles}>
                {field.type !== 'divider' && field.type !== 'submit' && (
                  <Label className="text-sm font-medium text-gray-900">
                    {field.label}
                    {field.required && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                    {field.advanced?.tooltip && (
                      <span 
                        className="ml-1 text-xs text-gray-500 cursor-help" 
                        title={field.advanced.tooltip}
                      >
                        ℹ️
                      </span>
                    )}
                  </Label>
                )}
                {renderField(field)}
                {errors[field.id] && (
                  <p className="text-sm text-red-500">{errors[field.id]}</p>
                )}
                {field.advanced?.helpText && (
                  <p className="text-xs text-gray-500">
                    {field.advanced.helpText}
                  </p>
                )}
                {field.advanced?.description && (
                  <p className="text-xs text-gray-500 italic">
                    {field.advanced.description}
                  </p>
                )}
              </div>
            );
          })}

          {!fields.some(field => field.type === 'submit') && (
            <div className="border-t pt-6">
              <Button type="submit" className="w-full">
                Submit Form
              </Button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Field, useFormStore } from '@/lib/store';
import { useSettingsStore } from '@/lib/settings-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Upload,
  Calendar,
  Clock,
  Star,
  Palette,
  FileText,
  Code,
  Tags,
  Grid3X3,
  Send,
  Plus,
  Trash2,
} from 'lucide-react';
import { CodeEditor } from '@/components/ui/code-editor';
import { showToast } from '@/lib/utils';

interface PreviewProps {
  fields: Field[];
  formTitle?: string;
}

// Custom Tooltip Component
const CustomTooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Reduced delay to 200ms (default is usually 1000ms)
    timeoutRef.current = setTimeout(() => setIsVisible(true), 200);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap z-50"
          >
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Preview: React.FC<PreviewProps> = ({
  fields,
  formTitle = 'Untitled Form',
}) => {
  // Handle ESC key to exit preview mode
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Exit preview mode by triggering the preview toggle
        const previewButton = document.querySelector('[data-preview-toggle]') as HTMLButtonElement;
        if (previewButton) {
          previewButton.click();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  const storeFormData = useFormStore(state => state.formData);
  const updateFormData = useFormStore(state => state.updateFormData);
  const shouldShowField = useFormStore(state => state.shouldShowField);
  const { colorPalette } = useSettingsStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleInputChange = (fieldId: string, value: any) => {
    updateFormData(fieldId, value);
    
    // Get the field to check its type
    const field = fields.find(f => f.id === fieldId);
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
    
    // Real-time validation for email fields
    if (field?.type === 'email' && value) {
      const emailValue = String(value).trim();
      if (!isValidEmail(emailValue)) {
        setErrors(prev => ({ ...prev, [fieldId]: 'Please enter a valid email address' }));
      }
    }
  };

  // Enhanced email validation function
  const isValidEmail = (email: string): boolean => {
    // More comprehensive email regex pattern
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  const validateField = (field: Field, value: any): string => {
    if (
      field.required &&
      (!value || (Array.isArray(value) && value.length === 0))
    ) {
      return field.advanced?.errorMessage || `${field.label} is required`;
    }

    if (value) {
      // Email-specific validation
      if (field.type === 'email') {
        const emailValue = String(value).trim();
        if (!isValidEmail(emailValue)) {
          return 'Please enter a valid email address';
        }
      }

      // Check validation properties
      if (field.validation) {
        const { minLength, maxLength, min, max, pattern } = field.validation;

        if (minLength && value.length < minLength) {
          return `${field.label} must be at least ${minLength} characters`;
        }

        if (maxLength && value.length > maxLength) {
          return `${field.label} must be no more than ${maxLength} characters`;
        }

        if (min !== undefined && parseFloat(value) < min) {
          return `${field.label} must be at least ${min}`;
        }

        if (max !== undefined && parseFloat(value) > max) {
          return `${field.label} must be no more than ${max}`;
        }

        if (pattern && !new RegExp(pattern).test(value)) {
          return `${field.label} format is invalid`;
        }
      }

      // Check textConfig properties (for text input settings)
      if (field.textConfig) {
        const { minLength, maxLength, pattern } = field.textConfig;

        if (minLength && value.length < minLength) {
          return `${field.label} must be at least ${minLength} characters`;
        }

        if (maxLength && value.length > maxLength) {
          return `${field.label} must be no more than ${maxLength} characters`;
        }

        if (pattern && !new RegExp(pattern).test(value)) {
          return `${field.label} format is invalid`;
        }
      }
    }

    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      if (field.advanced?.hidden) return;

      const error = validateField(field, storeFormData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Form submitted:', storeFormData);
    showToast('Form submitted successfully!', 'success');

    setIsSubmitting(false);
  };

  const renderField = (field: Field) => {
    if (field.advanced?.hidden) return null;

    // Check conditional logic - if field should be hidden, don't render it
    if (!shouldShowField(field)) return null;

    const fieldError = errors[field.id];
    const fieldValue = storeFormData[field.id];
    
    // Check if user has explicitly set a value (including empty string)
    const hasUserValue = field.id in storeFormData;
    const displayValue = hasUserValue ? fieldValue : (field.advanced?.defaultValue?.toString() || '');

    const baseFieldProps = {
      id: field.id,
      value: displayValue,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => handleInputChange(field.id, e.target.value),
      placeholder: field.placeholder,
      disabled: field.advanced?.disabled || field.advanced?.readonly,
      readOnly: field.advanced?.readonly,
      className: `w-full ${fieldError ? 'border-destructive' : ''}`,
    };

    const renderFieldContent = () => {
      switch (field.type) {
        case 'text':
        case 'phone':
        case 'url':
          return (
            <Input
              {...baseFieldProps}
              type="text"
              pattern={field.textConfig?.pattern}
              minLength={field.textConfig?.minLength}
              maxLength={field.textConfig?.maxLength}
              autoFocus={field.textConfig?.autoFocus}
            />
          );

        case 'email':
          return (
            <Input
              {...baseFieldProps}
              type="email"
              pattern={field.textConfig?.pattern}
              minLength={field.textConfig?.minLength}
              maxLength={field.textConfig?.maxLength}
              autoFocus={field.textConfig?.autoFocus}
            />
          );

        case 'password':
          return (
            <Input
              {...baseFieldProps}
              type="password"
              pattern={field.textConfig?.pattern}
              minLength={field.textConfig?.minLength}
              maxLength={field.textConfig?.maxLength}
              autoFocus={field.textConfig?.autoFocus}
            />
          );

        case 'number':
          return (
            <Input
              {...baseFieldProps}
              type="number"
              min={field.validation?.min}
              max={field.validation?.max}
            />
          );

        case 'textarea':
          return (
            <Textarea
              {...baseFieldProps}
              rows={4}
              className={`resize-none ${fieldError ? 'border-destructive' : ''}`}
            />
          );

        case 'select':
          return (
            <Select
              value={hasUserValue ? fieldValue || '' : (field.advanced?.defaultValue?.toString() || '')}
              onValueChange={value => handleInputChange(field.id, value)}
              disabled={field.advanced?.disabled}
            >
              <SelectTrigger className={fieldError ? 'border-destructive' : ''}>
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
                    disabled={field.advanced?.disabled}
                  />
                  <Label htmlFor={`${field.id}-${index}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          );

        case 'radio':
          return (
            <RadioGroup
              value={hasUserValue ? fieldValue || '' : (field.advanced?.defaultValue?.toString() || '')}
              onValueChange={value => handleInputChange(field.id, value)}
              disabled={field.advanced?.disabled}
              className="space-y-2"
            >
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
              <Checkbox
                id={field.id}
                checked={hasUserValue ? fieldValue || false : (field.advanced?.defaultValue || false)}
                onCheckedChange={checked =>
                  handleInputChange(field.id, checked)
                }
                disabled={field.advanced?.disabled}
              />
              <Label htmlFor={field.id}>{field.label}</Label>
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
              setSelectedFiles(prev => ({
                ...prev,
                [field.id]: e.target.files,
              }));
              handleInputChange(field.id, e.target.files);
            }
          };

          const handleClick = () => {
            fileInputRefs.current[field.id]?.click();
          };

          return (
            <div
              className={`cursor-pointer border-2 border-dashed p-6 text-center transition-colors ${
                dragActive[field.id]
                  ? 'bg-primary/5 border-primary'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
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

        case 'date':
          return (
            <div className="relative">
              <Input
                {...baseFieldProps}
                type="date"
                className="focus:ring-primary/20 w-full border-border bg-background pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
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
                {...baseFieldProps}
                type="time"
                className="focus:ring-primary/20 w-full border-border bg-background pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
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
                {...baseFieldProps}
                type="datetime-local"
                className="focus:ring-primary/20 w-full border-border bg-background pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
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
                (_, i) => {
                  const starValue = i + 1;
                  const minRating = field.ratingConfig?.minRating || 1;
                  const maxRating = field.ratingConfig?.maxRating || 5;
                  const allowHalf = field.ratingConfig?.allowHalf || false;
                  const currentRating = fieldValue || 0;

                  if (allowHalf) {
                    return (
                      <div key={i} className="relative">
                        <Star
                          className={`h-5 w-5 cursor-pointer transition-colors ${
                            starValue <= currentRating
                              ? 'fill-current text-yellow-400'
                              : 'text-muted-foreground/50'
                          }`}
                          onClick={() => handleInputChange(field.id, starValue)}
                        />
                        {starValue - 0.5 <= currentRating &&
                          currentRating < starValue && (
                            <div className="absolute inset-0 overflow-hidden">
                              <Star
                                className="h-5 w-5 fill-current text-yellow-400"
                                style={{ clipPath: 'inset(0 50% 0 0)' }}
                              />
                            </div>
                          )}
                        <div
                          className="absolute inset-0 cursor-pointer"
                          onClick={() =>
                            handleInputChange(field.id, starValue - 0.5)
                          }
                          style={{ width: '50%' }}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <Star
                        key={i}
                        className={`h-5 w-5 cursor-pointer transition-colors ${
                          starValue <= currentRating
                            ? 'fill-current text-yellow-400'
                            : 'text-muted-foreground/50'
                        }`}
                        onClick={() => handleInputChange(field.id, starValue)}
                      />
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
                    ? fieldValue
                    : (field.sliderConfig?.defaultValue ?? 0)
                }
                onChange={e =>
                  handleInputChange(field.id, parseInt(e.target.value))
                }
                disabled={field.advanced?.disabled}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>{field.sliderConfig?.min || 0}</span>
                <span>
                  {fieldValue !== undefined
                    ? fieldValue
                    : (field.sliderConfig?.defaultValue ?? 0)}
                </span>
                <span>{field.sliderConfig?.max || 100}</span>
              </div>
              {field.sliderConfig?.showValue && (
                <div className="text-center text-sm text-muted-foreground">
                  {fieldValue !== undefined
                    ? fieldValue
                    : (field.sliderConfig?.defaultValue ?? 0)}
                </div>
              )}
            </div>
          );

        case 'color':
          return (
            <div className="flex items-center space-x-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <Input {...baseFieldProps} type="color" className="h-10 w-16" />
            </div>
          );

        case 'toggle':
          return (
            <div className="flex items-center space-x-2">
              <Switch
                checked={fieldValue || false}
                onCheckedChange={checked =>
                  handleInputChange(field.id, checked)
                }
                disabled={field.advanced?.disabled}
              />
              <Label>{field.label}</Label>
            </div>
          );

        case 'divider':
          return <Separator className="my-4" />;

        case 'tags':
          return (
            <div className="space-y-2">
              <div className="mb-2 flex flex-wrap gap-1">
                {(fieldValue || []).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-primary/10 rounded px-2 py-1 text-sm text-primary"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        const newTags = (fieldValue || []).filter(
                          (_: string, i: number) => i !== index
                        );
                        handleInputChange(field.id, newTags);
                      }}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <Input
                placeholder={field.placeholder}
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    const newTags = [
                      ...(fieldValue || []),
                      e.currentTarget.value.trim(),
                    ];
                    handleInputChange(field.id, newTags);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          );

        case 'grid':
          const gridConfig = field.gridConfig || {
            columns: [
              { id: '1', name: 'Name', type: 'text' as const, required: true },
              {
                id: '2',
                name: 'Email',
                type: 'email' as const,
                required: true,
              },
              {
                id: '3',
                name: 'Phone',
                type: 'phone' as const,
                required: false,
              },
            ],
            rows: [],
            allowAddRows: true,
            allowDeleteRows: true,
            maxRows: 10,
            minRows: 1,
          };

          // Get current grid data from form store
          const gridData = storeFormData[field.id] || [];
          
          // Initialize with minimum rows if no data exists
          const currentRows = gridData.length > 0 ? gridData : Array(gridConfig.minRows || 1).fill(null).map(() => ({}));

          const addRow = () => {
            if (currentRows.length < (gridConfig.maxRows || 10)) {
              const newRows = [...currentRows, {}];
              updateFormData(field.id, newRows);
            }
          };

          const removeRow = (index: number) => {
            if (currentRows.length > (gridConfig.minRows || 1)) {
              const newRows = currentRows.filter((_, i) => i !== index);
              updateFormData(field.id, newRows);
            }
          };

          const updateRowData = (rowIndex: number, columnId: string, value: any) => {
            const newRows = [...currentRows];
            if (!newRows[rowIndex]) {
              newRows[rowIndex] = {};
            }
            newRows[rowIndex][columnId] = value;
            updateFormData(field.id, newRows);
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
                  <Input
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={`Enter ${column.name.toLowerCase()}`}
                    className="h-8 text-xs"
                  />
                );
              case 'number':
                return (
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={`Enter ${column.name.toLowerCase()}`}
                    className="h-8 text-xs"
                  />
                );
              case 'date':
                return (
                  <Input 
                    type="date" 
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    className="h-8 text-xs" 
                  />
                );
              case 'time':
                return (
                  <Input 
                    type="time" 
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    className="h-8 text-xs" 
                  />
                );
              case 'datetime':
                return (
                  <Input 
                    type="datetime-local" 
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    className="h-8 text-xs" 
                  />
                );
              case 'email':
                return (
                  <Input
                    type="email"
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={`Enter ${column.name.toLowerCase()}`}
                    className="h-8 text-xs"
                  />
                );
              case 'phone':
                return (
                  <Input
                    type="tel"
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={`Enter ${column.name.toLowerCase()}`}
                    className="h-8 text-xs"
                  />
                );
              case 'url':
                return (
                  <Input
                    type="url"
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={`Enter ${column.name.toLowerCase()}`}
                    className="h-8 text-xs"
                  />
                );
              case 'select':
                return (
                  <Select value={value} onValueChange={handleChange}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue
                        placeholder={`Select ${column.name.toLowerCase()}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {column.options?.map((option: string, index: number) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      )) || (
                        <>
                          <SelectItem value="option1">Option 1</SelectItem>
                          <SelectItem value="option2">Option 2</SelectItem>
                          <SelectItem value="option3">Option 3</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
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
                  <Input
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={`Enter ${column.name.toLowerCase()}`}
                    className="h-8 text-xs"
                  />
                );
            }
          };

          return (
            <div className="rounded-lg border border-muted p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Grid3X3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{field.label}</span>
                </div>
                {gridConfig.allowAddRows && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRow}
                    disabled={currentRows.length >= (gridConfig.maxRows || 10)}
                    className="h-7 px-2 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Row
                  </Button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-muted-foreground/20 border-b">
                      {gridConfig.columns.map(column => (
                        <th
                          key={column.id}
                          className="p-2 text-left font-medium"
                        >
                          {column.name}
                          {column.required && (
                            <span className="ml-1 text-red-500">*</span>
                          )}
                        </th>
                      ))}
                      {gridConfig.allowDeleteRows && (
                        <th className="p-2 text-left font-medium w-12">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-muted-foreground/10 border-b">
                        {gridConfig.columns.map(column => (
                          <td key={column.id} className="p-2">
                            {renderGridInput(column, rowIndex)}
                          </td>
                        ))}
                        {gridConfig.allowDeleteRows && (
                          <td className="p-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRow(rowIndex)}
                              disabled={currentRows.length <= (gridConfig.minRows || 1)}
                              className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );

        case 'json':
          return (
            <div className="rounded-lg border border-muted p-3">
              <div className="mb-2 flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  JSON Editor
                </span>
              </div>
              <Textarea
                {...baseFieldProps}
                rows={4}
                className="resize-none font-mono text-xs"
                placeholder='{"key": "value"}'
              />
            </div>
          );

        case 'markdown':
          return (
            <div className="rounded-lg border border-muted p-3">
              <div className="mb-2 flex items-center space-x-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Markdown Editor
                </span>
              </div>
              <Textarea
                {...baseFieldProps}
                rows={4}
                className="resize-none font-mono text-xs"
                placeholder="# Write in markdown..."
              />
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
            <div className="rounded-lg border border-muted p-3">
              <div className="mb-2 flex items-center space-x-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Code Editor ({codeConfig.language})
                </span>
              </div>
              <CodeEditor
                value={(fieldValue as string) || ''}
                onChange={value => handleInputChange(field.id, value)}
                language={codeConfig.language || 'javascript'}
                placeholder="// Enter your code here..."
                disabled={field.advanced?.disabled || field.advanced?.readonly}
                className="w-full"
              />
            </div>
          );

        case 'submit':
          const buttonColors = getButtonColors();
          const hasOtherFields = fields.some(f => f.type !== 'submit');
          const isDisabled = isSubmitting || !hasOtherFields;

          return (
            <Button
              type="submit"
              className={`w-full ${buttonColors.bg} ${buttonColors.hover} ${buttonColors.text} ${
                isDisabled ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={isDisabled}
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {field.label || 'Submit'}
                </>
              )}
            </Button>
          );

        default:
          return (
            <Input
              {...baseFieldProps}
              placeholder="Unsupported field type"
              disabled
              className="bg-muted"
            />
          );
      }
    };

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
      <div 
        key={field.id} 
        className="space-y-2"
        style={layoutStyles}
      >
        {field.type !== 'divider' && field.type !== 'submit' && (
          <Label htmlFor={field.id} className="flex items-center space-x-2">
            <span>{field.label}</span>
            {field.required && <span className="text-destructive">*</span>}
            {field.advanced?.tooltip && (
              <CustomTooltip content={field.advanced.tooltip}>
                <span className="text-xs text-muted-foreground cursor-help">
                  ℹ️
                </span>
              </CustomTooltip>
            )}
          </Label>
        )}

        {renderFieldContent()}

        {fieldError && <p className="text-sm text-destructive">{fieldError}</p>}

        {field.advanced?.helpText && (
          <p className="text-xs text-muted-foreground">
            {field.advanced.helpText}
          </p>
        )}

        {field.advanced?.description && (
          <p className="text-xs text-muted-foreground italic">
            {field.advanced.description}
          </p>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className="mx-auto w-[60%] p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CardTitle className="text-2xl font-bold">{formTitle}</CardTitle>
              <p className="text-muted-foreground">
                This is how your form will appear to users
              </p>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {fields.length === 0 ? (
                  <motion.div
                    key="empty-preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="py-8 text-center"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    </motion.div>
                    <motion.h3
                      className="mb-2 text-lg font-medium"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      No fields to display
                    </motion.h3>
                    <motion.p
                      className="text-muted-foreground"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      Add some fields to your form to see the preview
                    </motion.p>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {fields
                      .map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, x: -20, y: 10 }}
                          animate={{ opacity: 1, x: 0, y: 0 }}
                          exit={{ opacity: 0, x: 20, y: -10 }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.1,
                            ease: 'easeOut',
                          }}
                          layout
                        >
                          {renderField(field)}
                        </motion.div>
                      ))}
                  </AnimatePresence>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {fields.length > 0 &&
                  !fields.some(field => field.type === 'submit') && (
                    <motion.div
                      className="border-t pt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Submit Form
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Preview;

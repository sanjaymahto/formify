import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Field, useFormStore } from '@/lib/store';
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
  Layers,
  Grid3X3,
  Columns,
  Section,
  Folder,
  PenTool,
  Send,
} from 'lucide-react';

interface PreviewProps {
  fields: Field[];
  formTitle?: string;
}

const Preview: React.FC<PreviewProps> = ({ fields, formTitle = 'Untitled Form' }) => {
  const storeFormData = useFormStore(state => state.formData);
  const updateFormData = useFormStore(state => state.updateFormData);
  const shouldShowField = useFormStore(state => state.shouldShowField);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (fieldId: string, value: any) => {
    updateFormData(fieldId, value);
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateField = (field: Field, value: any): string => {
    if (
      field.required &&
      (!value || (Array.isArray(value) && value.length === 0))
    ) {
      return field.advanced?.errorMessage || `${field.label} is required`;
    }

    if (value && field.validation) {
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
    alert('Form submitted successfully!');

    setIsSubmitting(false);
  };

  const renderField = (field: Field) => {
    if (field.advanced?.hidden) return null;

    const fieldError = errors[field.id];
    const fieldValue = storeFormData[field.id];

    const baseFieldProps = {
      id: field.id,
      value: fieldValue || '',
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => handleInputChange(field.id, e.target.value),
      placeholder: field.placeholder,
      disabled: field.advanced?.disabled || field.advanced?.readonly,
      className: `w-full ${fieldError ? 'border-destructive' : ''}`,
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
              {...baseFieldProps}
              type={field.type === 'password' ? 'password' : 'text'}
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
              value={fieldValue || ''}
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
                    checked={Array.isArray(fieldValue) ? fieldValue.includes(option) : false}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(fieldValue) ? fieldValue : [];
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
              value={fieldValue || ''}
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
                checked={fieldValue || false}
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
          return (
            <div className="border-muted-foreground/25 hover:border-primary/50 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors">
              <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                Click to upload {field.type} files
              </p>
              {field.fileConfig?.maxSize && (
                <p className="text-xs text-muted-foreground">
                  Max size: {field.fileConfig.maxSize}MB
                </p>
              )}
              <Input
                type="file"
                accept={field.fileConfig?.accept}
                multiple={field.fileConfig?.multiple}
                onChange={e => handleInputChange(field.id, e.target.files)}
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
                className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
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
                {...baseFieldProps} 
                type="time" 
                className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
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
                {...baseFieldProps}
                type="datetime-local"
                className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
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
                        {starValue - 0.5 <= currentRating && currentRating < starValue && (
                          <div className="absolute inset-0 overflow-hidden">
                            <Star
                              className="h-5 w-5 fill-current text-yellow-400"
                              style={{ clipPath: 'inset(0 50% 0 0)' }}
                            />
                          </div>
                        )}
                        <div 
                          className="absolute inset-0 cursor-pointer"
                          onClick={() => handleInputChange(field.id, starValue - 0.5)}
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
                  {field.ratingConfig.labels?.[Math.floor((fieldValue as number) - 1)] ||
                    `${fieldValue} stars`}
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
                value={fieldValue !== undefined ? fieldValue : (field.sliderConfig?.defaultValue ?? 0)}
                onChange={e =>
                  handleInputChange(field.id, parseInt(e.target.value))
                }
                disabled={field.advanced?.disabled}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                <span>{field.sliderConfig?.min || 0}</span>
                <span>{fieldValue !== undefined ? fieldValue : (field.sliderConfig?.defaultValue ?? 0)}</span>
                <span>{field.sliderConfig?.max || 100}</span>
              </div>
              {field.sliderConfig?.showValue && (
                <div className="text-center text-sm text-muted-foreground">
                  {fieldValue !== undefined ? fieldValue : (field.sliderConfig?.defaultValue ?? 0)}
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



        case 'section':
          return (
            <div className="bg-muted/50 rounded-lg border border-muted p-4">
              <div className="mb-2 flex items-center space-x-2">
                <Section className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{field.label}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {field.advanced?.helpText || 'Section content area'}
              </div>
            </div>
          );



        case 'accordion':
          return (
            <div className="rounded-lg border border-muted p-3">
              <div className="mb-3 flex items-center space-x-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{field.label}</span>
              </div>
              <div className="space-y-1">
                <div className="flex cursor-pointer items-center justify-between rounded bg-muted p-2">
                  <span className="text-sm">Section 1</span>
                  <span className="text-xs">▼</span>
                </div>
                <div className="rounded bg-background p-2">
                  <Input placeholder="Section 1 content" />
                </div>
                <div className="flex cursor-pointer items-center justify-between rounded bg-muted p-2">
                  <span className="text-sm">Section 2</span>
                  <span className="text-xs">▶</span>
                </div>
              </div>
            </div>
          );

        case 'grid':
          return (
            <div className="rounded-lg border border-muted p-3">
              <div className="mb-3 flex items-center space-x-2">
                <Grid3X3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{field.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Grid item 1" />
                <Input placeholder="Grid item 2" />
                <Input placeholder="Grid item 3" />
                <Input placeholder="Grid item 4" />
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
          return (
            <div className="rounded-lg border border-muted p-3">
              <div className="mb-2 flex items-center space-x-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Code Editor
                </span>
              </div>
              <Textarea
                {...baseFieldProps}
                rows={4}
                className="resize-none bg-muted font-mono text-xs"
                placeholder="// Enter your code here"
              />
            </div>
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

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={field.id} className="flex items-center space-x-2">
          <span>{field.label}</span>
          {field.required && <span className="text-destructive">*</span>}
        </Label>

        {renderFieldContent()}

        {fieldError && <p className="text-sm text-destructive">{fieldError}</p>}

        {field.advanced?.helpText && (
          <p className="text-xs text-muted-foreground">
            {field.advanced.helpText}
          </p>
        )}
      </div>
    );
  };

  return (
    <motion.div 
      className="mx-auto max-w-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
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
                      .filter(field => shouldShowField(field)) // Only show fields that meet conditional logic
                      .map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, x: -20, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: 20, y: -10 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: index * 0.1,
                          ease: "easeOut"
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
                {fields.length > 0 && (
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

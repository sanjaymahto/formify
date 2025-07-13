'use client';

import { useFormStore, Field } from '@/lib/store';
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
import { Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

export function FormPreview() {
  const fields = useFormStore(state => state.fields);
  const [formData, setFormData] = useState<Record<string, string | number | boolean | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (fieldId: string, value: string | number | boolean | string[]) => {
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValue = String(formData[field.id]);
        if (!emailRegex.test(emailValue)) {
          newErrors[field.id] = 'Please enter a valid email address';
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
      alert('Form submitted successfully! Check console for data.');
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
            value={getStringValue()}
            onChange={e => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.type}`}
            className={baseClasses}
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
                  checked={Array.isArray(fieldValue) ? fieldValue.includes(option) : false}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(fieldValue) ? fieldValue : [];
                    const newValues = checked
                      ? [...currentValues, option]
                      : currentValues.filter(val => val !== option);
                    handleInputChange(field.id, newValues);
                  }}
                  className={fieldError ? 'border-red-500' : ''}
                />
                <Label htmlFor={`${field.id}-${index}`} className="text-sm text-gray-600">
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
              onCheckedChange={checked => handleInputChange(field.id, checked as boolean)}
              className={fieldError ? 'border-red-500' : ''}
            />
            <Label className="text-sm text-gray-600">
              {field.label}
            </Label>
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
              className={`${baseClasses} bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden`}
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
              value={fieldValue as string}
              onChange={e => handleInputChange(field.id, e.target.value)}
              className={`${baseClasses} bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden`}
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
              value={fieldValue as string}
              onChange={e => handleInputChange(field.id, e.target.value)}
              className={`${baseClasses} bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden`}
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

      case 'file':
      case 'image':
        return (
          <Input
            type="file"
            onChange={e => handleInputChange(field.id, e.target.files?.[0]?.name || '')}
            className={baseClasses}
            accept={field.type === 'image' ? 'image/*' : undefined}
          />
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
                          starValue <= currentRating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={() => handleInputChange(field.id, starValue)}
                      >
                        ★
                      </button>
                      {starValue - 0.5 <= currentRating && currentRating < starValue && (
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
                        onClick={() => handleInputChange(field.id, starValue - 0.5)}
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
                        starValue <= currentRating ? 'text-yellow-400' : 'text-gray-300'
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
              value={fieldValue !== undefined ? fieldValue as number : (field.sliderConfig?.defaultValue ?? 0)}
              onChange={e => handleInputChange(field.id, parseInt(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
            />
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
              <span>{field.sliderConfig?.min || 0}</span>
              <span>{fieldValue !== undefined ? fieldValue as number : (field.sliderConfig?.defaultValue ?? 0)}</span>
              <span>{field.sliderConfig?.max || 100}</span>
            </div>
            {field.sliderConfig?.showValue && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {fieldValue !== undefined ? fieldValue as number : (field.sliderConfig?.defaultValue ?? 0)}
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
              className="h-4 w-4"
            />
            <Label className="text-sm text-gray-600">
              {field.label}
            </Label>
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

      case 'rich-text':
        return (
          <Textarea
            value={fieldValue as string}
            onChange={e => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || 'Enter rich text'}
            className={baseClasses}
            rows={4}
          />
        );

      case 'signature':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Signature pad - Click to sign</p>
          </div>
        );

      case 'divider':
        return <hr className="my-4 border-gray-300" />;

      case 'section':
        return (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">{field.label}</h3>
            {field.advanced?.description && (
              <p className="text-sm text-gray-600 mt-1">{field.advanced.description}</p>
            )}
          </div>
        );

      case 'html':
        return (
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: field.advanced?.defaultValue?.toString() || '' }}
          />
        );

      case 'code':
        return (
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{field.advanced?.defaultValue?.toString() || ''}</code>
          </pre>
        );

      case 'accordion':
      case 'grid':
      case 'columns':
      case 'group':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">{field.label} - Layout container</p>
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
    <div className="mx-auto max-w-2xl p-6">
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

          {fields.map(field => (
            <div key={field.id} className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">
                {field.label}
                {field.required && <span className="ml-1 text-red-500">*</span>}
              </Label>
              {renderField(field)}
              {errors[field.id] && (
                <p className="text-sm text-red-500">{errors[field.id]}</p>
              )}
            </div>
          ))}

          <div className="border-t pt-6">
            <Button type="submit" className="w-full">
              Submit Form
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

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
import { useState } from 'react';

export function FormPreview() {
  const { fields } = useFormStore();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (fieldId: string, value: any) => {
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
        if (!emailRegex.test(formData[field.id])) {
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

    switch (field.type) {
      case 'text':
        return (
          <Input
            type="text"
            value={fieldValue}
            onChange={e => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || 'Enter text'}
            className={baseClasses}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={fieldValue}
            onChange={e => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || 'Enter text'}
            className={baseClasses}
            rows={3}
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            value={fieldValue}
            onChange={e => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || 'Enter email'}
            className={baseClasses}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={fieldValue}
            onChange={e => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || 'Enter number'}
            className={baseClasses}
          />
        );

      case 'select':
        return (
          <Select
            value={fieldValue}
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

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={fieldValue}
              onCheckedChange={checked => handleInputChange(field.id, checked)}
              className={fieldError ? 'border-red-500' : ''}
            />
            <Label className="text-sm text-gray-600">
              I agree to the terms
            </Label>
          </div>
        );

      case 'radio':
        return (
          <RadioGroup
            value={fieldValue}
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

      default:
        return (
          <Input
            type="text"
            value={fieldValue}
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

import React, { useState } from 'react';
import { Field } from '@/lib/store';
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
  Search,
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
}

const Preview: React.FC<PreviewProps> = ({ fields }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
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

      const error = validateField(field, formData[field.id]);
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

    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');

    setIsSubmitting(false);
  };

  const renderField = (field: Field) => {
    if (field.advanced?.hidden) return null;

    const fieldError = errors[field.id];
    const fieldValue = formData[field.id];

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

        case 'rich-text':
          return (
            <div className="rounded-lg border border-muted p-3">
              <div className="mb-2 flex items-center space-x-2">
                <Button variant="ghost" size="sm" type="button">
                  B
                </Button>
                <Button variant="ghost" size="sm" type="button">
                  I
                </Button>
                <Button variant="ghost" size="sm" type="button">
                  U
                </Button>
                <Button variant="ghost" size="sm" type="button">
                  Link
                </Button>
              </div>
              <Textarea
                {...baseFieldProps}
                rows={4}
                className="resize-none border-0 focus-visible:ring-0"
              />
            </div>
          );

        case 'date':
          return (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                {...baseFieldProps}
                type="date"
                min={field.dateConfig?.minDate}
                max={field.dateConfig?.maxDate}
              />
            </div>
          );

        case 'time':
          return (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input {...baseFieldProps} type="time" />
            </div>
          );

        case 'datetime':
          return (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                {...baseFieldProps}
                type="datetime-local"
                min={field.dateConfig?.minDate}
                max={field.dateConfig?.maxDate}
              />
            </div>
          );

        case 'signature':
          return (
            <div className="rounded-lg border border-muted p-4">
              <div className="mb-2 flex items-center space-x-2">
                <PenTool className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Signature Pad
                </span>
              </div>
              <div
                className="border-muted-foreground/25 hover:border-primary/50 flex h-24 cursor-pointer items-center justify-center rounded border-2 border-dashed bg-muted transition-colors"
                style={{
                  width: field.signatureConfig?.width || 300,
                  height: field.signatureConfig?.height || 150,
                  backgroundColor:
                    field.signatureConfig?.backgroundColor || '#f8f9fa',
                }}
              >
                <span className="text-sm text-muted-foreground">
                  Click to sign
                </span>
              </div>
            </div>
          );

        case 'rating':
          return (
            <div className="flex items-center space-x-1">
              {Array.from({ length: field.ratingConfig?.max || 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 cursor-pointer transition-colors ${
                    i < (fieldValue || 0)
                      ? 'fill-current text-yellow-400'
                      : 'text-muted-foreground/50'
                  }`}
                  onClick={() => handleInputChange(field.id, i + 1)}
                />
              ))}
              {field.ratingConfig?.showText && fieldValue && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {field.ratingConfig.labels?.[fieldValue - 1] ||
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
                min={0}
                max={100}
                step={1}
                value={fieldValue || 50}
                onChange={e =>
                  handleInputChange(field.id, parseInt(e.target.value))
                }
                disabled={field.advanced?.disabled}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted"
              />
              <div className="text-center text-sm text-muted-foreground">
                {fieldValue || 50}
              </div>
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

        case 'html':
          return (
            <div
              className="rounded-lg border border-muted p-3"
              dangerouslySetInnerHTML={{
                __html:
                  field.htmlConfig?.content || '<p>Custom HTML content</p>',
              }}
            />
          );

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

        case 'autocomplete':
          return (
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                {...baseFieldProps}
                placeholder="Start typing to search..."
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

        case 'group':
          return (
            <div className="bg-muted/50 rounded-lg border border-muted p-3">
              <div className="mb-2 flex items-center space-x-2">
                <Folder className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{field.label}</span>
              </div>
              <div className="space-y-2">
                <div className="border-muted-foreground/25 h-6 rounded border-2 border-dashed bg-background"></div>
                <div className="border-muted-foreground/25 h-6 rounded border-2 border-dashed bg-background"></div>
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

        case 'columns':
          return (
            <div className="rounded-lg border border-muted p-3">
              <div className="mb-3 flex items-center space-x-2">
                <Columns className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{field.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Column 1" />
                <Input placeholder="Column 2" />
              </div>
            </div>
          );

        case 'json':
          return (
            <div className="rounded-lg border border-muted p-3">
              <div className="mb-2 flex items-center space-x-2">
                <FileJson className="h-4 w-4 text-muted-foreground" />
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
                <FileCode className="h-4 w-4 text-muted-foreground" />
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
    <div className="mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Form Preview</CardTitle>
          <p className="text-muted-foreground">
            This is how your form will appear to users
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.length === 0 ? (
              <div className="py-8 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">
                  No fields to display
                </h3>
                <p className="text-muted-foreground">
                  Add some fields to your form to see the preview
                </p>
              </div>
            ) : (
              fields.map(renderField)
            )}

            {fields.length > 0 && (
              <div className="border-t pt-4">
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
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Preview;

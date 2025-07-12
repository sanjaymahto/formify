'use client';

import React from 'react';
import { useFormStore, Field } from '@/lib/store';
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
  Palette,
  FileText,
  Code,
  Tags,
  Search,
  Layers,
  Grid3X3,
  Columns,
  Minus,
  Section,
  Folder,
  Image,
  PenTool,
} from 'lucide-react';

interface FieldRendererProps {
  field: Field;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const updateField = useFormStore(state => state.updateField);

  const handleLabelChange = (value: string) => {
    updateField(field.id, { label: value });
  };

  const handleRequiredChange = (checked: boolean) => {
    updateField(field.id, { required: checked });
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
          <Select disabled>
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
          <RadioGroup disabled className="space-y-2">
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

      case 'autocomplete':
        return (
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={field.placeholder}
              disabled
              className="bg-muted"
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
              console.log("Hello World");
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
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
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
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <div className="cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="mb-3">{renderFieldContent()}</div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={field.required}
              onCheckedChange={handleRequiredChange}
              onClick={e => e.stopPropagation()}
            />
            <Label className="text-xs text-muted-foreground">Required</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Canvas() {
  const { fields, selectedFieldId, setSelectedField, removeField } =
    useFormStore();

  return (
    <div className="flex-1 overflow-y-auto bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-4">
        {fields.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12" />
            </div>
            <h3 className="mb-2 text-lg font-medium">No fields added yet</h3>
            <p className="text-muted-foreground">
              Drag and drop components from the sidebar to start building your
              form
            </p>
          </div>
        ) : (
          fields.map((field, index) => (
            <FieldRenderer
              key={field.id}
              field={field}
              isSelected={selectedFieldId === field.id}
              onSelect={() => setSelectedField(field.id)}
              onDelete={() => removeField(field.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

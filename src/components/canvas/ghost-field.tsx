'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Upload,
  Star,
  Send,
} from 'lucide-react';

interface GhostFieldProps {
  fieldType: string;
}

export const GhostField: React.FC<GhostFieldProps> = ({ fieldType }) => {
  const getDefaultLabel = (type: string): string => {
    switch (type) {
      case 'text':
        return 'Text Input';
      case 'email':
        return 'Email Address';
      case 'password':
        return 'Password';
      case 'phone':
        return 'Phone Number';
      case 'url':
        return 'Website URL';
      case 'number':
        return 'Number Input';
      case 'textarea':
        return 'Text Area';
      case 'select':
        return 'Dropdown Selection';
      case 'multi-select':
        return 'Multiple Choice';
      case 'radio':
        return 'Radio Buttons';
      case 'checkbox':
        return 'Checkbox';
      case 'file':
        return 'File Upload';
      case 'image':
        return 'Image Upload';
      case 'date':
        return 'Date Picker';
      case 'time':
        return 'Time Picker';
      case 'rating':
        return 'Rating';
      case 'slider':
        return 'Slider';
      case 'divider':
        return 'Divider';
      case 'submit':
        return 'Submit Button';
      default:
        return 'Field';
    }
  };

  const getDefaultPlaceholder = (type: string): string => {
    switch (type) {
      case 'text':
        return 'Enter text...';
      case 'email':
        return 'Enter your email...';
      case 'password':
        return 'Enter your password...';
      case 'phone':
        return 'Enter phone number...';
      case 'url':
        return 'Enter website URL...';
      case 'number':
        return 'Enter a number...';
      case 'textarea':
        return 'Enter your message...';
      case 'select':
        return 'Select an option...';
      case 'multi-select':
        return 'Select options...';
      case 'radio':
        return 'Choose an option...';
      case 'checkbox':
        return 'Check this option...';
      case 'file':
        return 'Choose a file...';
      case 'image':
        return 'Choose an image...';
      case 'date':
        return 'Select a date...';
      case 'time':
        return 'Select a time...';
      case 'rating':
        return 'Rate this...';
      case 'slider':
        return 'Slide to select...';
      default:
        return 'Enter value...';
    }
  };

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
          <RadioGroup className="space-y-2">
            {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  id={`ghost-${index}`}
                  disabled
                />
                <Label
                  htmlFor={`ghost-${index}`}
                  className="text-muted-foreground"
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
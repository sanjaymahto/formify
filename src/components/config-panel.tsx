'use client';

import { useFormStore, Field } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, X, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function ConfigPanel() {
  const { fields, selectedFieldId, updateField, setSelectedField } =
    useFormStore();
  const selectedField = fields.find(f => f.id === selectedFieldId);

  if (!selectedField) {
    return (
      <aside className="flex w-80 flex-col border-l border-black/5 bg-white">
        <div className="flex h-16 items-center justify-between border-b border-black/5 bg-white p-4 text-black">
          <h2 className="text-lg font-semibold">Properties</h2>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center text-gray-500">
            <Settings className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-sm">
              Select a field to configure its properties
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const handleUpdate = (updates: Partial<Field>) => {
    updateField(selectedField.id, updates);
  };

  const addOption = () => {
    const currentOptions = selectedField.options || [];
    handleUpdate({
      options: [...currentOptions, `Option ${currentOptions.length + 1}`],
    });
  };

  const updateOption = (index: number, value: string) => {
    const currentOptions = selectedField.options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    handleUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const currentOptions = selectedField.options || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    handleUpdate({ options: newOptions });
  };

  return (
    <aside className="flex w-80 flex-col border-l border-black/5 bg-white">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-black/5 bg-white p-4 text-black">
        <h2 className="text-lg font-semibold">Field Properties</h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setSelectedField(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Configuration Form */}
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        {/* Field Type Display */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Field Type
          </Label>
          <div className="rounded-md bg-gray-50 px-3 py-2 text-sm capitalize text-gray-500">
            {selectedField.type.replace('-', ' ')}
          </div>
        </div>

        <Separator />

        {/* Label */}
        <div className="space-y-2">
          <Label htmlFor="label" className="text-sm font-medium text-gray-700">
            Label
          </Label>
          <Input
            id="label"
            value={selectedField.label}
            onChange={e => handleUpdate({ label: e.target.value })}
            placeholder="Enter field label"
            className="w-full"
          />
        </div>

        {/* Placeholder (for text inputs) */}
        {['text', 'textarea', 'email', 'number'].includes(
          selectedField.type
        ) && (
          <div className="space-y-2">
            <Label
              htmlFor="placeholder"
              className="text-sm font-medium text-gray-700"
            >
              Placeholder
            </Label>
            <Input
              id="placeholder"
              value={selectedField.placeholder || ''}
              onChange={e => handleUpdate({ placeholder: e.target.value })}
              placeholder="Enter placeholder text"
              className="w-full"
            />
          </div>
        )}

        {/* Required Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">
              Required
            </Label>
            <p className="text-xs text-gray-500">Make this field mandatory</p>
          </div>
          <Switch
            checked={selectedField.required}
            onCheckedChange={checked => handleUpdate({ required: checked })}
          />
        </div>

        {/* Options (for select and radio) */}
        {['select', 'radio'].includes(selectedField.type) && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">
                  Options
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="h-8 px-3"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {(selectedField.options || []).map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={e => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {(!selectedField.options ||
                  selectedField.options.length === 0) && (
                  <p className="py-2 text-center text-xs text-gray-500">
                    No options added yet
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Field Preview */}
        <Separator />
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Preview</Label>
          <Card className="bg-gray-50 p-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">
                {selectedField.label}
                {selectedField.required && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </Label>
              {/* Render a preview of the field */}
              {selectedField.type === 'text' && (
                <Input
                  type="text"
                  placeholder={selectedField.placeholder || 'Enter text'}
                  disabled
                  className="w-full"
                />
              )}
              {selectedField.type === 'textarea' && (
                <textarea
                  placeholder={selectedField.placeholder || 'Enter text'}
                  disabled
                  className="min-h-[60px] w-full rounded-md border bg-white px-3 py-2 text-sm"
                  rows={2}
                />
              )}
              {selectedField.type === 'email' && (
                <Input
                  type="email"
                  placeholder={selectedField.placeholder || 'Enter email'}
                  disabled
                  className="w-full"
                />
              )}
              {selectedField.type === 'number' && (
                <Input
                  type="number"
                  placeholder={selectedField.placeholder || 'Enter number'}
                  disabled
                  className="w-full"
                />
              )}
              {selectedField.type === 'select' && (
                <select
                  disabled
                  className="w-full rounded-md border bg-white px-3 py-2 text-sm"
                >
                  <option>
                    {selectedField.placeholder || 'Select an option'}
                  </option>
                  {selectedField.options?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              {selectedField.type === 'checkbox' && (
                <div className="flex items-center space-x-2">
                  <input type="checkbox" disabled className="h-4 w-4" />
                  <span className="text-sm text-gray-600">Checkbox option</span>
                </div>
              )}
              {selectedField.type === 'radio' && (
                <div className="space-y-2">
                  {selectedField.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input type="radio" disabled className="h-4 w-4" />
                      <span className="text-sm text-gray-600">{option}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </aside>
  );
}

import React from 'react';
import { useFormStore, Field } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Type,
  FileText,
  List,
  Upload,
  Calendar,
  Star,
  Sliders,
  Palette,
  ToggleLeft,
  MapPin,
  CreditCard,
  Shield,
  Code,
  Calculator,
  Eye,
  Tags,
  Search,
  Layers,
  Grid3X3,
  Columns,
  Minus,
  Section,
  Folder,
  Database,
  FileJson,
  FileCode,
  BarChart3,
  PenTool,
} from 'lucide-react';

interface PropertyPanelProps {
  field: Field | null;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ field }) => {
  const updateField = useFormStore(state => state.updateField);

  if (!field) {
    return (
      <div className="w-80 border-l border-border bg-background p-4">
        <div className="py-8 text-center">
          <Settings className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Select a field to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const handleUpdate = (updates: Partial<Field>) => {
    updateField(field.id, updates);
  };

  const renderBasicProperties = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Basic Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={field.label}
            onChange={e => handleUpdate({ label: e.target.value })}
            placeholder="Field label"
          />
        </div>

        {field.type !== 'divider' && field.type !== 'section' && (
          <div className="space-y-2">
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={field.placeholder || ''}
              onChange={e => handleUpdate({ placeholder: e.target.value })}
              placeholder="Placeholder text"
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="required"
            checked={field.required}
            onCheckedChange={checked =>
              handleUpdate({ required: checked as boolean })
            }
          />
          <Label htmlFor="required">Required field</Label>
        </div>
      </CardContent>
    </Card>
  );

  const renderOptionsProperties = () => {
    if (!['select', 'radio', 'multi-select'].includes(field.type)) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {(field.options || []).map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={e => {
                      const newOptions = [...(field.options || [])];
                      newOptions[index] = e.target.value;
                      handleUpdate({ options: newOptions });
                    }}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newOptions = (field.options || []).filter(
                        (_, i) => i !== index
                      );
                      handleUpdate({ options: newOptions });
                    }}
                    className="h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOptions = [
                    ...(field.options || []),
                    `Option ${(field.options?.length || 0) + 1}`,
                  ];
                  handleUpdate({ options: newOptions });
                }}
                className="w-full"
              >
                Add Option
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFileProperties = () => {
    if (!['file', 'image'].includes(field.type)) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Upload className="h-4 w-4" />
            <span>File Upload Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maxSize">Max File Size (MB)</Label>
            <Input
              id="maxSize"
              type="number"
              value={field.fileConfig?.maxSize || 10}
              onChange={e =>
                handleUpdate({
                  fileConfig: {
                    ...field.fileConfig,
                    maxSize: parseInt(e.target.value) || 10,
                  },
                })
              }
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="multiple"
              checked={field.fileConfig?.multiple || false}
              onCheckedChange={checked =>
                handleUpdate({
                  fileConfig: {
                    ...field.fileConfig,
                    multiple: checked as boolean,
                  },
                })
              }
            />
            <Label htmlFor="multiple">Allow multiple files</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accept">Accepted File Types</Label>
            <Input
              id="accept"
              value={field.fileConfig?.accept || '*/*'}
              onChange={e =>
                handleUpdate({
                  fileConfig: {
                    ...field.fileConfig,
                    accept: e.target.value,
                  },
                })
              }
              placeholder="e.g., .pdf,.doc,.docx"
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderDateProperties = () => {
    if (!['date', 'time', 'datetime'].includes(field.type)) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>Date/Time Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="format">Date Format</Label>
            <Select
              value={field.dateConfig?.format || 'YYYY-MM-DD'}
              onValueChange={value =>
                handleUpdate({
                  dateConfig: {
                    ...field.dateConfig,
                    format: value,
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD HH:mm">
                  YYYY-MM-DD HH:mm
                </SelectItem>
                <SelectItem value="HH:mm">HH:mm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minDate">Minimum Date</Label>
            <Input
              id="minDate"
              type="date"
              value={field.dateConfig?.minDate || ''}
              onChange={e =>
                handleUpdate({
                  dateConfig: {
                    ...field.dateConfig,
                    minDate: e.target.value,
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxDate">Maximum Date</Label>
            <Input
              id="maxDate"
              type="date"
              value={field.dateConfig?.maxDate || ''}
              onChange={e =>
                handleUpdate({
                  dateConfig: {
                    ...field.dateConfig,
                    maxDate: e.target.value,
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRatingProperties = () => {
    if (field.type !== 'rating') return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Star className="h-4 w-4" />
            <span>Rating Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maxRating">Maximum Rating</Label>
            <Input
              id="maxRating"
              type="number"
              min="1"
              max="10"
              value={field.ratingConfig?.max || 5}
              onChange={e =>
                handleUpdate({
                  ratingConfig: {
                    ...field.ratingConfig,
                    max: parseInt(e.target.value) || 5,
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Size</Label>
            <Select
              value={field.ratingConfig?.size || 'md'}
              onValueChange={value =>
                handleUpdate({
                  ratingConfig: {
                    ...field.ratingConfig,
                    size: value as 'sm' | 'md' | 'lg',
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="showText"
              checked={field.ratingConfig?.showText || false}
              onCheckedChange={checked =>
                handleUpdate({
                  ratingConfig: {
                    ...field.ratingConfig,
                    showText: checked as boolean,
                  },
                })
              }
            />
            <Label htmlFor="showText">Show text labels</Label>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSliderProperties = () => {
    if (field.type !== 'slider') return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Sliders className="h-4 w-4" />
            <span>Slider Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minValue">Minimum Value</Label>
              <Input
                id="minValue"
                type="number"
                value={field.sliderConfig?.min || 0}
                onChange={e =>
                  handleUpdate({
                    sliderConfig: {
                      ...field.sliderConfig,
                      min: parseInt(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxValue">Maximum Value</Label>
              <Input
                id="maxValue"
                type="number"
                value={field.sliderConfig?.max || 100}
                onChange={e =>
                  handleUpdate({
                    sliderConfig: {
                      ...field.sliderConfig,
                      max: parseInt(e.target.value) || 100,
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="step">Step</Label>
            <Input
              id="step"
              type="number"
              min="0.1"
              step="0.1"
              value={field.sliderConfig?.step || 1}
              onChange={e =>
                handleUpdate({
                  sliderConfig: {
                    ...field.sliderConfig,
                    step: parseFloat(e.target.value) || 1,
                  },
                })
              }
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="showValue"
              checked={field.sliderConfig?.showValue || false}
              onCheckedChange={checked =>
                handleUpdate({
                  sliderConfig: {
                    ...field.sliderConfig,
                    showValue: checked as boolean,
                  },
                })
              }
            />
            <Label htmlFor="showValue">Show current value</Label>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSignatureProperties = () => {
    if (field.type !== 'signature') return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <PenTool className="h-4 w-4" />
            <span>Signature Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                value={field.signatureConfig?.width || 300}
                onChange={e =>
                  handleUpdate({
                    signatureConfig: {
                      ...field.signatureConfig,
                      width: parseInt(e.target.value) || 300,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                value={field.signatureConfig?.height || 150}
                onChange={e =>
                  handleUpdate({
                    signatureConfig: {
                      ...field.signatureConfig,
                      height: parseInt(e.target.value) || 150,
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="penColor">Pen Color</Label>
            <Input
              id="penColor"
              type="color"
              value={field.signatureConfig?.penColor || '#000000'}
              onChange={e =>
                handleUpdate({
                  signatureConfig: {
                    ...field.signatureConfig,
                    penColor: e.target.value,
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bgColor">Background Color</Label>
            <Input
              id="bgColor"
              type="color"
              value={field.signatureConfig?.backgroundColor || '#ffffff'}
              onChange={e =>
                handleUpdate({
                  signatureConfig: {
                    ...field.signatureConfig,
                    backgroundColor: e.target.value,
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderValidationProperties = () => {
    if (['divider', 'section', 'progress'].includes(field.type)) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Validation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {['text', 'email', 'password', 'textarea', 'phone', 'url'].includes(
            field.type
          ) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="minLength">Minimum Length</Label>
                <Input
                  id="minLength"
                  type="number"
                  value={field.validation?.minLength || ''}
                  onChange={e =>
                    handleUpdate({
                      validation: {
                        ...field.validation,
                        minLength: parseInt(e.target.value) || undefined,
                      },
                    })
                  }
                  placeholder="No minimum"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxLength">Maximum Length</Label>
                <Input
                  id="maxLength"
                  type="number"
                  value={field.validation?.maxLength || ''}
                  onChange={e =>
                    handleUpdate({
                      validation: {
                        ...field.validation,
                        maxLength: parseInt(e.target.value) || undefined,
                      },
                    })
                  }
                  placeholder="No maximum"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pattern">Pattern (Regex)</Label>
                <Input
                  id="pattern"
                  value={field.validation?.pattern || ''}
                  onChange={e =>
                    handleUpdate({
                      validation: {
                        ...field.validation,
                        pattern: e.target.value || undefined,
                      },
                    })
                  }
                  placeholder="Custom validation pattern"
                />
              </div>
            </>
          )}

          {field.type === 'number' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="min">Minimum Value</Label>
                <Input
                  id="min"
                  type="number"
                  value={field.validation?.min || ''}
                  onChange={e =>
                    handleUpdate({
                      validation: {
                        ...field.validation,
                        min: parseFloat(e.target.value) || undefined,
                      },
                    })
                  }
                  placeholder="No minimum"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max">Maximum Value</Label>
                <Input
                  id="max"
                  type="number"
                  value={field.validation?.max || ''}
                  onChange={e =>
                    handleUpdate({
                      validation: {
                        ...field.validation,
                        max: parseFloat(e.target.value) || undefined,
                      },
                    })
                  }
                  placeholder="No maximum"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderAdvancedProperties = () => {
    if (['divider', 'section'].includes(field.type)) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Advanced</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="helpText">Help Text</Label>
            <Textarea
              id="helpText"
              value={field.advanced?.helpText || ''}
              onChange={e =>
                handleUpdate({
                  advanced: {
                    ...field.advanced,
                    helpText: e.target.value,
                  },
                })
              }
              placeholder="Additional help text for users"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="errorMessage">Error Message</Label>
            <Input
              id="errorMessage"
              value={field.advanced?.errorMessage || ''}
              onChange={e =>
                handleUpdate({
                  advanced: {
                    ...field.advanced,
                    errorMessage: e.target.value,
                  },
                })
              }
              placeholder="Custom error message"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customClass">Custom CSS Class</Label>
            <Input
              id="customClass"
              value={field.advanced?.customClass || ''}
              onChange={e =>
                handleUpdate({
                  advanced: {
                    ...field.advanced,
                    customClass: e.target.value,
                  },
                })
              }
              placeholder="custom-field-class"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hidden"
              checked={field.advanced?.hidden || false}
              onCheckedChange={checked =>
                handleUpdate({
                  advanced: {
                    ...field.advanced,
                    hidden: checked as boolean,
                  },
                })
              }
            />
            <Label htmlFor="hidden">Hidden field</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="readonly"
              checked={field.advanced?.readonly || false}
              onCheckedChange={checked =>
                handleUpdate({
                  advanced: {
                    ...field.advanced,
                    readonly: checked as boolean,
                  },
                })
              }
            />
            <Label htmlFor="readonly">Read-only</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="disabled"
              checked={field.advanced?.disabled || false}
              onCheckedChange={checked =>
                handleUpdate({
                  advanced: {
                    ...field.advanced,
                    disabled: checked as boolean,
                  },
                })
              }
            />
            <Label htmlFor="disabled">Disabled</Label>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-80 overflow-y-auto border-l border-border bg-background p-4">
      <div className="space-y-4">
        <div>
          <h2 className="mb-2 text-lg font-semibold">Field Properties</h2>
          <p className="text-sm text-muted-foreground">
            Configure the selected field
          </p>
        </div>

        {renderBasicProperties()}
        {renderOptionsProperties()}
        {renderFileProperties()}
        {renderDateProperties()}
        {renderRatingProperties()}
        {renderSliderProperties()}
        {renderSignatureProperties()}
        {renderValidationProperties()}
        {renderAdvancedProperties()}
      </div>
    </div>
  );
};

export default PropertyPanel;

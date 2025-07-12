import React from 'react';
import { useFormStore, Field } from '@/lib/store';
import { useSettingsStore } from '@/lib/settings-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Upload,
  Calendar,
  Star,
  Sliders,
  Code,
  Grid3X3,
  PenTool,
  FileText,
} from 'lucide-react';

interface PropertyPanelProps {
  field: Field | null;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ field }) => {
  const fields = useFormStore(state => state.fields);
  const updateField = useFormStore(state => state.updateField);
  const { colorPalette } = useSettingsStore();

  const getCheckboxColors = () => {
    const colors = {
      default: {
        border: 'border-blue-500',
        bg: 'bg-blue-500',
        focus: 'focus:ring-blue-500/20',
        hover: 'hover:border-blue-500/50',
        cssColor: '#3b82f6',
      },
      blue: {
        border: 'border-blue-500',
        bg: 'bg-blue-500',
        focus: 'focus:ring-blue-500/20',
        hover: 'hover:border-blue-500/50',
        cssColor: '#3b82f6',
      },
      green: {
        border: 'border-green-500',
        bg: 'bg-green-500',
        focus: 'focus:ring-green-500/20',
        hover: 'hover:border-green-500/50',
        cssColor: '#10b981',
      },
      purple: {
        border: 'border-purple-500',
        bg: 'bg-purple-500',
        focus: 'focus:ring-purple-500/20',
        hover: 'hover:border-purple-500/50',
        cssColor: '#8b5cf6',
      },
      orange: {
        border: 'border-orange-500',
        bg: 'bg-orange-500',
        focus: 'focus:ring-orange-500/20',
        hover: 'hover:border-orange-500/50',
        cssColor: '#f97316',
      },
      pink: {
        border: 'border-pink-500',
        bg: 'bg-pink-500',
        focus: 'focus:ring-pink-500/20',
        hover: 'hover:border-pink-500/50',
        cssColor: '#ec4899',
      },
      red: {
        border: 'border-red-500',
        bg: 'bg-red-500',
        focus: 'focus:ring-red-500/20',
        hover: 'hover:border-red-500/50',
        cssColor: '#ef4444',
      },
      teal: {
        border: 'border-teal-500',
        bg: 'bg-teal-500',
        focus: 'focus:ring-teal-500/20',
        hover: 'hover:border-teal-500/50',
        cssColor: '#14b8a6',
      },
      indigo: {
        border: 'border-indigo-500',
        bg: 'bg-indigo-500',
        focus: 'focus:ring-indigo-500/20',
        hover: 'hover:border-indigo-500/50',
        cssColor: '#6366f1',
      },
      yellow: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-500',
        focus: 'focus:ring-yellow-500/20',
        hover: 'hover:border-yellow-500/50',
        cssColor: '#eab308',
      },
    };
    return colors[colorPalette] || colors.default;
  };

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
          <input
            type="checkbox"
            id="required"
            checked={field.required}
            onChange={(e) => handleUpdate({ required: e.target.checked })}
            className={`h-4 w-4 rounded-md border border-border bg-background cursor-pointer transition-colors ${
              field.required 
                ? `${getCheckboxColors().bg} ${getCheckboxColors().border}` 
                : 'border-border'
            } ${getCheckboxColors().focus} ${getCheckboxColors().hover}`}
            style={{
              accentColor: field.required ? getCheckboxColors().cssColor : undefined
            }}
          />
          <Label htmlFor="required" className="cursor-pointer select-none">
            Required field
          </Label>
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
            <input
              type="checkbox"
              id="multiple"
              checked={field.fileConfig?.multiple || false}
              onChange={(e) =>
                handleUpdate({
                  fileConfig: {
                    ...field.fileConfig,
                    multiple: e.target.checked,
                  },
                })
              }
              className={`h-4 w-4 rounded-md border border-border bg-background cursor-pointer transition-colors ${
                field.fileConfig?.multiple 
                  ? `${getCheckboxColors().bg} ${getCheckboxColors().border}` 
                  : 'border-border'
              } ${getCheckboxColors().focus} ${getCheckboxColors().hover}`}
              style={{
                accentColor: field.fileConfig?.multiple ? getCheckboxColors().cssColor : undefined
              }}
            />
            <Label htmlFor="multiple" className="cursor-pointer select-none">
              Allow multiple files
            </Label>
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
              value={field.ratingConfig?.maxRating || 5}
              onChange={e =>
                handleUpdate({
                  ratingConfig: {
                    ...field.ratingConfig,
                    maxRating: parseInt(e.target.value) || 5,
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Size</Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allowHalf"
                checked={field.ratingConfig?.allowHalf || false}
                onChange={(e) =>
                  handleUpdate({
                    ratingConfig: {
                      ...field.ratingConfig,
                      allowHalf: e.target.checked,
                    },
                  })
                }
                className={`h-4 w-4 rounded-md border border-border bg-background cursor-pointer transition-colors ${
                  field.ratingConfig?.allowHalf 
                    ? `${getCheckboxColors().bg} ${getCheckboxColors().border}` 
                    : 'border-border'
                } ${getCheckboxColors().focus} ${getCheckboxColors().hover}`}
                style={{
                  accentColor: field.ratingConfig?.allowHalf ? getCheckboxColors().cssColor : undefined
                }}
              />
              <Label htmlFor="allowHalf" className="cursor-pointer select-none">
                Allow half stars
              </Label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showLabels"
              checked={field.ratingConfig?.showLabels || false}
              onChange={(e) =>
                handleUpdate({
                  ratingConfig: {
                    ...field.ratingConfig,
                    showLabels: e.target.checked,
                  },
                })
              }
              className={`h-4 w-4 rounded-md border border-border bg-background cursor-pointer transition-colors ${
                field.ratingConfig?.showLabels 
                  ? `${getCheckboxColors().bg} ${getCheckboxColors().border}` 
                  : 'border-border'
              } ${getCheckboxColors().focus} ${getCheckboxColors().hover}`}
              style={{
                accentColor: field.ratingConfig?.showLabels ? getCheckboxColors().cssColor : undefined
              }}
            />
            <Label htmlFor="showLabels" className="cursor-pointer select-none">
              Show labels
            </Label>
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
            <input
              type="checkbox"
              id="showValue"
              checked={field.sliderConfig?.showValue || false}
              onChange={(e) =>
                handleUpdate({
                  sliderConfig: {
                    ...field.sliderConfig,
                    showValue: e.target.checked,
                  },
                })
              }
              className={`h-4 w-4 rounded-md border border-border bg-background cursor-pointer transition-colors ${
                field.sliderConfig?.showValue 
                  ? `${getCheckboxColors().bg} ${getCheckboxColors().border}` 
                  : 'border-border'
              } ${getCheckboxColors().focus} ${getCheckboxColors().hover}`}
              style={{
                accentColor: field.sliderConfig?.showValue ? getCheckboxColors().cssColor : undefined
              }}
            />
            <Label htmlFor="showValue" className="cursor-pointer select-none">
              Show current value
            </Label>
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

  const renderTextProperties = () => {
    if (!['text', 'email', 'password', 'phone', 'url', 'number', 'textarea'].includes(field.type)) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <FileText className="h-4 w-4" />
            <span>Text Input Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inputMode">Input Mode</Label>
            <Select
              value={field.textConfig?.inputMode || 'text'}
              onValueChange={value =>
                handleUpdate({
                  textConfig: {
                    ...field.textConfig,
                    inputMode: value as 'text' | 'email' | 'tel' | 'url' | 'numeric' | 'decimal' | 'search',
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="tel">Telephone</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="numeric">Numeric</SelectItem>
                <SelectItem value="decimal">Decimal</SelectItem>
                <SelectItem value="search">Search</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="autoComplete">Auto Complete</Label>
            <Input
              id="autoComplete"
              value={field.textConfig?.autoComplete || ''}
              onChange={e =>
                handleUpdate({
                  textConfig: {
                    ...field.textConfig,
                    autoComplete: e.target.value,
                  },
                })
              }
              placeholder="e.g., name, email, tel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pattern">Pattern (Regex)</Label>
            <Input
              id="pattern"
              value={field.textConfig?.pattern || ''}
              onChange={e =>
                handleUpdate({
                  textConfig: {
                    ...field.textConfig,
                    pattern: e.target.value,
                  },
                })
              }
              placeholder="e.g., [A-Za-z]{3,}"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minLength">Min Length</Label>
              <Input
                id="minLength"
                type="number"
                value={field.textConfig?.minLength || ''}
                onChange={e =>
                  handleUpdate({
                    textConfig: {
                      ...field.textConfig,
                      minLength: parseInt(e.target.value) || undefined,
                    },
                  })
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLength">Max Length</Label>
              <Input
                id="maxLength"
                type="number"
                value={field.textConfig?.maxLength || ''}
                onChange={e =>
                  handleUpdate({
                    textConfig: {
                      ...field.textConfig,
                      maxLength: parseInt(e.target.value) || undefined,
                    },
                  })
                }
                placeholder="No limit"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoFocus"
              checked={field.textConfig?.autoFocus || false}
              onChange={(e) =>
                handleUpdate({
                  textConfig: {
                    ...field.textConfig,
                    autoFocus: e.target.checked,
                  },
                })
              }
              className={`h-4 w-4 rounded-md border border-border bg-background cursor-pointer transition-colors ${
                field.textConfig?.autoFocus 
                  ? `${getCheckboxColors().bg} ${getCheckboxColors().border}` 
                  : 'border-border'
              } ${getCheckboxColors().focus} ${getCheckboxColors().hover}`}
              style={{
                accentColor: field.textConfig?.autoFocus ? getCheckboxColors().cssColor : undefined
              }}
            />
            <Label htmlFor="autoFocus" className="cursor-pointer select-none">
              Auto focus
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="spellCheck"
              checked={field.textConfig?.spellCheck !== false}
              onChange={(e) =>
                handleUpdate({
                  textConfig: {
                    ...field.textConfig,
                    spellCheck: e.target.checked,
                  },
                })
              }
              className={`h-4 w-4 rounded-md border border-border bg-background cursor-pointer transition-colors ${
                field.textConfig?.spellCheck !== false 
                  ? `${getCheckboxColors().bg} ${getCheckboxColors().border}` 
                  : 'border-border'
              } ${getCheckboxColors().focus} ${getCheckboxColors().hover}`}
              style={{
                accentColor: field.textConfig?.spellCheck !== false ? getCheckboxColors().cssColor : undefined
              }}
            />
            <Label htmlFor="spellCheck" className="cursor-pointer select-none">
              Spell check
            </Label>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderLayoutProperties = () => {
    if (['divider', 'section'].includes(field.type)) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Grid3X3 className="h-4 w-4" />
            <span>Layout & Styling</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                value={field.layout?.width || ''}
                onChange={e =>
                  handleUpdate({
                    layout: {
                      ...field.layout,
                      width: e.target.value,
                    },
                  })
                }
                placeholder="e.g., 100%, 200px"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                value={field.layout?.height || ''}
                onChange={e =>
                  handleUpdate({
                    layout: {
                      ...field.layout,
                      height: e.target.value,
                    },
                  })
                }
                placeholder="e.g., 100px, auto"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display">Display</Label>
            <Select
              value={field.layout?.display || 'block'}
              onValueChange={value =>
                handleUpdate({
                  layout: {
                    ...field.layout,
                                         display: value as 'block' | 'inline' | 'inline-block' | 'flex' | 'grid',
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="block">Block</SelectItem>
                <SelectItem value="inline">Inline</SelectItem>
                <SelectItem value="inline-block">Inline Block</SelectItem>
                <SelectItem value="flex">Flex</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="margin">Margin</Label>
            <Input
              id="margin"
              value={field.layout?.margin || ''}
              onChange={e =>
                handleUpdate({
                  layout: {
                    ...field.layout,
                    margin: e.target.value,
                  },
                })
              }
              placeholder="e.g., 10px, 1rem 2rem"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="padding">Padding</Label>
            <Input
              id="padding"
              value={field.layout?.padding || ''}
              onChange={e =>
                handleUpdate({
                  layout: {
                    ...field.layout,
                    padding: e.target.value,
                  },
                })
              }
              placeholder="e.g., 10px, 1rem 2rem"
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderConditionalProperties = () => {
    if (['divider', 'section'].includes(field.type)) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Code className="h-4 w-4" />
            <span>Conditional Logic</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Show if</Label>
            <div className="grid grid-cols-3 gap-2">
              <Select
                value={field.conditional?.showIf?.fieldId || ''}
                onValueChange={value =>
                  handleUpdate({
                    conditional: {
                      ...field.conditional,
                      showIf: {
                        ...field.conditional?.showIf,
                        fieldId: value,
                      },
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Field" />
                </SelectTrigger>
                <SelectContent>
                  {fields.filter(f => f.id !== field.id).map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={field.conditional?.showIf?.operator || 'equals'}
                onValueChange={value =>
                  handleUpdate({
                    conditional: {
                      ...field.conditional,
                      showIf: {
                        ...field.conditional?.showIf,
                                                 operator: value as 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than',
                      },
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not_equals">Not Equals</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="not_contains">Not Contains</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={field.conditional?.showIf?.value?.toString() || ''}
                onChange={e =>
                  handleUpdate({
                    conditional: {
                      ...field.conditional,
                      showIf: {
                        ...field.conditional?.showIf,
                        value: e.target.value,
                      },
                    },
                  })
                }
                placeholder="Value"
              />
            </div>
          </div>
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
            <Label htmlFor="defaultValue">Default Value</Label>
            <Input
              id="defaultValue"
              value={field.advanced?.defaultValue?.toString() || ''}
              onChange={e =>
                handleUpdate({
                  advanced: {
                    ...field.advanced,
                    defaultValue: e.target.value,
                  },
                })
              }
              placeholder="Default value"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tooltip">Tooltip</Label>
            <Input
              id="tooltip"
              value={field.advanced?.tooltip || ''}
              onChange={e =>
                handleUpdate({
                  advanced: {
                    ...field.advanced,
                    tooltip: e.target.value,
                  },
                })
              }
              placeholder="Tooltip text"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hidden"
              checked={field.advanced?.hidden || false}
              onChange={(e) =>
                handleUpdate({
                  advanced: {
                    ...field.advanced,
                    hidden: e.target.checked,
                  },
                })
              }
              className={`h-4 w-4 rounded-md border border-border bg-background cursor-pointer transition-colors ${
                field.advanced?.hidden 
                  ? `${getCheckboxColors().bg} ${getCheckboxColors().border}` 
                  : 'border-border'
              } ${getCheckboxColors().focus} ${getCheckboxColors().hover}`}
              style={{
                accentColor: field.advanced?.hidden ? getCheckboxColors().cssColor : undefined
              }}
            />
            <Label htmlFor="hidden" className="cursor-pointer select-none">
              Hidden field
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="readonly"
              checked={field.advanced?.readonly || false}
              onChange={(e) =>
                handleUpdate({
                  advanced: {
                    ...field.advanced,
                    readonly: e.target.checked,
                  },
                })
              }
              className={`h-4 w-4 rounded-md border border-border bg-background cursor-pointer transition-colors ${
                field.advanced?.readonly 
                  ? `${getCheckboxColors().bg} ${getCheckboxColors().border}` 
                  : 'border-border'
              } ${getCheckboxColors().focus} ${getCheckboxColors().hover}`}
              style={{
                accentColor: field.advanced?.readonly ? getCheckboxColors().cssColor : undefined
              }}
            />
            <Label htmlFor="readonly" className="cursor-pointer select-none">
              Read-only
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="disabled"
              checked={field.advanced?.disabled || false}
              onChange={(e) =>
                handleUpdate({
                  advanced: {
                    ...field.advanced,
                    disabled: e.target.checked,
                  },
                })
              }
              className={`h-4 w-4 rounded-md border border-border bg-background cursor-pointer transition-colors ${
                field.advanced?.disabled 
                  ? `${getCheckboxColors().bg} ${getCheckboxColors().border}` 
                  : 'border-border'
              } ${getCheckboxColors().focus} ${getCheckboxColors().hover}`}
              style={{
                accentColor: field.advanced?.disabled ? getCheckboxColors().cssColor : undefined
              }}
            />
            <Label htmlFor="disabled" className="cursor-pointer select-none">
              Disabled
            </Label>
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
        {renderTextProperties()}
        {renderOptionsProperties()}
        {renderFileProperties()}
        {renderDateProperties()}
        {renderRatingProperties()}
        {renderSliderProperties()}
        {renderSignatureProperties()}
        {renderValidationProperties()}
        {renderLayoutProperties()}
        {renderConditionalProperties()}
        {renderAdvancedProperties()}
      </div>
    </div>
  );
};

export default PropertyPanel;

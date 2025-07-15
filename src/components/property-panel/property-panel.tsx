import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFormStore } from '@/lib/store';
import { Field } from '@/types';
import { useSettingsStore } from '@/lib/settings-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CardSection,
  CheckboxWrapper,
  FlexRow,
  Grid2Col,
  SpaceY,
} from '@/components/ui';
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
  X,
} from 'lucide-react';
import { PropertyPanelProps } from '@/types/components/property-panel';
import { getCheckboxColors } from '@/utils/color-utils';

interface ExtendedPropertyPanelProps extends PropertyPanelProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const PropertyPanel: React.FC<ExtendedPropertyPanelProps> = ({ 
  field, 
  onClose, 
  isMobile = false 
}) => {
  const fields = useFormStore(state => state.fields);
  const updateField = useFormStore(state => state.updateField);
  const { colorPalette } = useSettingsStore();

  const checkboxColors = getCheckboxColors(colorPalette);

  if (!field) {
    return (
      <motion.div
        className="flex h-full w-full flex-col border-l border-border bg-background md:w-80"
        initial={{ x: isMobile ? '100%' : '85%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex-1 overflow-y-auto p-4">
          <motion.div
            className="py-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Settings className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            </motion.div>
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Select a field to edit its properties
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
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
        {field.type !== 'divider' && (
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={field.label}
              onChange={e => handleUpdate({ label: e.target.value })}
              placeholder="Field label"
            />
          </div>
        )}

        {!['code', 'progress', 'divider', 'submit'].includes(field.type) && (
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

        {/* Only show required checkbox for input fields */}
        {!['code', 'progress', 'divider', 'submit'].includes(field.type) && (
          <CheckboxWrapper
            id="required"
            checked={field.required}
            onChange={checked => handleUpdate({ required: checked })}
            label="Required field"
            colors={checkboxColors}
          />
        )}
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

          <CheckboxWrapper
            id="multiple"
            checked={field.fileConfig?.multiple || false}
            onChange={checked =>
              handleUpdate({
                fileConfig: {
                  ...field.fileConfig,
                  multiple: checked,
                },
              })
            }
            label="Allow multiple files"
            colors={checkboxColors}
          />

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
          <Grid2Col>
            <SpaceY>
              <Label htmlFor="minRating">Minimum Rating</Label>
              <Input
                id="minRating"
                type="number"
                min="1"
                max="10"
                value={field.ratingConfig?.minRating || 1}
                onChange={e =>
                  handleUpdate({
                    ratingConfig: {
                      ...field.ratingConfig,
                      minRating: parseInt(e.target.value) || 1,
                    },
                  })
                }
              />
            </SpaceY>
            <SpaceY>
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
            </SpaceY>
          </Grid2Col>

          <div className="space-y-2">
            <Label>Options</Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allowHalf"
                checked={field.ratingConfig?.allowHalf || false}
                onChange={e =>
                  handleUpdate({
                    ratingConfig: {
                      ...field.ratingConfig,
                      allowHalf: e.target.checked,
                    },
                  })
                }
                className={`h-4 w-4 cursor-pointer rounded-md border border-border bg-background transition-colors ${
                  field.ratingConfig?.allowHalf
                    ? `${checkboxColors.bg} ${checkboxColors.border}`
                    : 'border-border'
                } ${checkboxColors.focus} ${checkboxColors.hover}`}
                style={{
                  accentColor: field.ratingConfig?.allowHalf
                    ? checkboxColors.cssColor
                    : undefined,
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
              onChange={e =>
                handleUpdate({
                  ratingConfig: {
                    ...field.ratingConfig,
                    showLabels: e.target.checked,
                  },
                })
              }
              className={`h-4 w-4 cursor-pointer rounded-md border border-border bg-background transition-colors ${
                field.ratingConfig?.showLabels
                  ? `${checkboxColors.bg} ${checkboxColors.border}`
                  : 'border-border'
              } ${checkboxColors.focus} ${checkboxColors.hover}`}
              style={{
                accentColor: field.ratingConfig?.showLabels
                  ? checkboxColors.cssColor
                  : undefined,
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
              onChange={e =>
                handleUpdate({
                  sliderConfig: {
                    ...field.sliderConfig,
                    showValue: e.target.checked,
                  },
                })
              }
              className={`h-4 w-4 cursor-pointer rounded-md border border-border bg-background transition-colors ${
                field.sliderConfig?.showValue
                  ? `${checkboxColors.bg} ${checkboxColors.border}`
                  : 'border-border'
              } ${checkboxColors.focus} ${checkboxColors.hover}`}
              style={{
                accentColor: field.sliderConfig?.showValue
                  ? checkboxColors.cssColor
                  : undefined,
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

  const renderValidationProperties = () => {
    if (
      [
        'divider',
        'progress',
        'password',
        'textarea',
        'url',
        'phone',
        'select',
        'radio',
        'checkbox',
        'multi-select',
        'toggle',
        'rating',
        'slider',
        'color',
        'date',
        'time',
        'datetime',
        'file',
        'image',
        'grid',
      ].includes(field.type)
    )
      return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Validation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {['text', 'email'].includes(field.type) && (
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
    if (!['text', 'phone', 'url'].includes(field.type)) return null;

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
        </CardContent>
      </Card>
    );
  };

  const renderLayoutProperties = () => {
    // Only show layout properties for fields that can have layout, not structural elements
    if (['divider', 'section', 'html', 'code'].includes(field.type))
      return null;

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
                    display: value as
                      | 'block'
                      | 'inline'
                      | 'inline-block'
                      | 'flex'
                      | 'grid',
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
    // Only show conditional properties for interactive fields
    if (['divider', 'section', 'html', 'code', 'progress'].includes(field.type))
      return null;

    // Get available fields for conditional logic
    const availableFields = fields.filter(f => f.id !== field.id);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Code className="h-4 w-4" />
            <span>Conditional Logic</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Show If Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <Label className="text-sm font-medium">
                Show this field when:
              </Label>
            </div>

            <div className="bg-muted/30 space-y-3 rounded-lg border p-3">
              <div className="grid grid-cols-1 gap-3">
                {/* Field Selection */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Field</Label>
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
                    <SelectTrigger className="h-9">
                      <SelectValue>
                        {field.conditional?.showIf?.fieldId
                          ? availableFields.find(
                              f => f.id === field.conditional?.showIf?.fieldId
                            )?.label || 'Unknown field'
                          : 'Select a field'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.length > 0 ? (
                        availableFields.map(f => (
                          <SelectItem key={f.id} value={f.id}>
                            <span
                              className="max-w-[120px] truncate"
                              title={f.label}
                            >
                              {f.label.length > 20
                                ? `${f.label.substring(0, 20)}...`
                                : f.label}
                            </span>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="">
                          No other fields available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Operator Selection */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Condition
                  </Label>
                  <Select
                    value={field.conditional?.showIf?.operator || 'equals'}
                    onValueChange={value =>
                      handleUpdate({
                        conditional: {
                          ...field.conditional,
                          showIf: {
                            ...field.conditional?.showIf,
                            operator: value as
                              | 'equals'
                              | 'not_equals'
                              | 'contains'
                              | 'not_contains'
                              | 'greater_than'
                              | 'less_than',
                          },
                        },
                      })
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">equals</SelectItem>
                      <SelectItem value="not_equals">does not equal</SelectItem>
                      <SelectItem value="contains">contains</SelectItem>
                      <SelectItem value="not_contains">
                        does not contain
                      </SelectItem>
                      <SelectItem value="greater_than">
                        is greater than
                      </SelectItem>
                      <SelectItem value="less_than">is less than</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Value Input */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Value</Label>
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
                    placeholder="Enter value"
                    className="h-9"
                  />
                </div>
              </div>

              {/* Clear Show If */}
              {field.conditional?.showIf?.fieldId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleUpdate({
                      conditional: {
                        ...field.conditional,
                        showIf: undefined,
                      },
                    })
                  }
                  className="h-7 text-xs text-muted-foreground hover:text-destructive"
                >
                  Clear condition
                </Button>
              )}
            </div>
          </div>

          {/* Hide If Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <Label className="text-sm font-medium">
                Hide this field when:
              </Label>
            </div>

            <div className="bg-muted/30 space-y-3 rounded-lg border p-3">
              <div className="grid grid-cols-1 gap-3">
                {/* Field Selection */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Field</Label>
                  <Select
                    value={field.conditional?.hideIf?.fieldId || ''}
                    onValueChange={value =>
                      handleUpdate({
                        conditional: {
                          ...field.conditional,
                          hideIf: {
                            ...field.conditional?.hideIf,
                            fieldId: value,
                          },
                        },
                      })
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue>
                        {field.conditional?.hideIf?.fieldId
                          ? availableFields.find(
                              f => f.id === field.conditional?.hideIf?.fieldId
                            )?.label || 'Unknown field'
                          : 'Select a field'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.length > 0 ? (
                        availableFields.map(f => (
                          <SelectItem key={f.id} value={f.id}>
                            <span
                              className="max-w-[120px] truncate"
                              title={f.label}
                            >
                              {f.label.length > 20
                                ? `${f.label.substring(0, 20)}...`
                                : f.label}
                            </span>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="">
                          No other fields available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Operator Selection */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Condition
                  </Label>
                  <Select
                    value={field.conditional?.hideIf?.operator || 'equals'}
                    onValueChange={value =>
                      handleUpdate({
                        conditional: {
                          ...field.conditional,
                          hideIf: {
                            ...field.conditional?.hideIf,
                            operator: value as
                              | 'equals'
                              | 'not_equals'
                              | 'contains'
                              | 'not_contains'
                              | 'greater_than'
                              | 'less_than',
                          },
                        },
                      })
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">equals</SelectItem>
                      <SelectItem value="not_equals">does not equal</SelectItem>
                      <SelectItem value="contains">contains</SelectItem>
                      <SelectItem value="not_contains">
                        does not contain
                      </SelectItem>
                      <SelectItem value="greater_than">
                        is greater than
                      </SelectItem>
                      <SelectItem value="less_than">is less than</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Value Input */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Value</Label>
                  <Input
                    value={field.conditional?.hideIf?.value?.toString() || ''}
                    onChange={e =>
                      handleUpdate({
                        conditional: {
                          ...field.conditional,
                          hideIf: {
                            ...field.conditional?.hideIf,
                            value: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="Enter value"
                    className="h-9"
                  />
                </div>
              </div>

              {/* Clear Hide If */}
              {field.conditional?.hideIf?.fieldId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleUpdate({
                      conditional: {
                        ...field.conditional,
                        hideIf: undefined,
                      },
                    })
                  }
                  className="h-7 text-xs text-muted-foreground hover:text-destructive"
                >
                  Clear condition
                </Button>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
            <div className="mb-1 font-medium">How conditional logic works:</div>
            <ul className="space-y-1 text-blue-600">
              <li>
                • <strong>Show when:</strong> Field appears only when the
                condition is true
              </li>
              <li>
                • <strong>Hide when:</strong> Field is hidden when the condition
                is true
              </li>
              <li>
                • Conditions are evaluated based on the selected field's current
                value
              </li>
              <li>• You can use both conditions together for complex logic</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderGridProperties = () => {
    if (field.type !== 'grid') return null;

    const gridConfig = field.gridConfig || {
      columns: [
        { id: '1', name: 'Name', type: 'text' as const, required: true },
        { id: '2', name: 'Email', type: 'email' as const, required: true },
        { id: '3', name: 'Phone', type: 'phone' as const, required: false },
      ],
      rows: [],
      allowAddRows: true,
      allowDeleteRows: true,
      maxRows: 10,
      minRows: 1,
    };

    const addColumn = () => {
      const newColumn = {
        id: `col-${Date.now()}`,
        name: `Column ${gridConfig.columns.length + 1}`,
        type: 'text' as const,
        required: false,
      };
      handleUpdate({
        gridConfig: {
          ...gridConfig,
          columns: [...gridConfig.columns, newColumn],
        },
      });
    };

    const removeColumn = (columnId: string) => {
      handleUpdate({
        gridConfig: {
          ...gridConfig,
          columns: gridConfig.columns.filter(col => col.id !== columnId),
        },
      });
    };

    const updateColumn = (
      columnId: string,
      updates: Partial<(typeof gridConfig.columns)[0]>
    ) => {
      handleUpdate({
        gridConfig: {
          ...gridConfig,
          columns: gridConfig.columns.map(col =>
            col.id === columnId ? { ...col, ...updates } : col
          ),
        },
      });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Grid3X3 className="h-4 w-4" />
            <span>Grid Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Columns</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addColumn}
                className="h-8 px-3"
              >
                Add Column
              </Button>
            </div>

            <div className="space-y-2">
              {gridConfig.columns.map((column, index) => (
                <div
                  key={column.id}
                  className="flex items-center space-x-2 rounded border p-2"
                >
                  <div className="flex-1 space-y-2">
                    <Input
                      value={column.name}
                      onChange={e =>
                        updateColumn(column.id, { name: e.target.value })
                      }
                      placeholder="Column name"
                      className="h-8 text-sm"
                    />
                    <Select
                      value={column.type}
                      onValueChange={value =>
                        updateColumn(column.id, { type: value as any })
                      }
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="time">Time</SelectItem>
                        <SelectItem value="datetime">Date & Time</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="url">URL</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={column.required}
                      onChange={e =>
                        updateColumn(column.id, { required: e.target.checked })
                      }
                      className="h-4 w-4"
                    />
                    <Label className="text-xs">Required</Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeColumn(column.id)}
                    className="h-6 w-6 p-0 text-destructive"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Table Settings</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={gridConfig.allowAddRows}
                  onChange={e =>
                    handleUpdate({
                      gridConfig: {
                        ...gridConfig,
                        allowAddRows: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
                <Label className="text-xs">Allow Add Rows</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={gridConfig.allowDeleteRows}
                  onChange={e =>
                    handleUpdate({
                      gridConfig: {
                        ...gridConfig,
                        allowDeleteRows: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
                <Label className="text-xs">Allow Delete Rows</Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Min Rows</Label>
              <Input
                type="number"
                min="1"
                value={gridConfig.minRows || 1}
                onChange={e =>
                  handleUpdate({
                    gridConfig: {
                      ...gridConfig,
                      minRows: parseInt(e.target.value) || 1,
                    },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Max Rows</Label>
              <Input
                type="number"
                min="1"
                value={gridConfig.maxRows || 10}
                onChange={e =>
                  handleUpdate({
                    gridConfig: {
                      ...gridConfig,
                      maxRows: parseInt(e.target.value) || 10,
                    },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStructuralProperties = () => {
    if (!['group', 'columns'].includes(field.type)) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <span>Structural Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={field.advanced?.description || ''}
              onChange={e =>
                handleUpdate({
                  advanced: {
                    ...field.advanced,
                    description: e.target.value,
                  },
                })
              }
              placeholder="Description of this element"
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderHtmlCodeProperties = () => {
    if (!['code'].includes(field.type)) return null;

    const codeConfig = field.codeConfig || {
      language: 'javascript',
      theme: 'one-dark',
      lineNumbers: true,
      autoComplete: true,
      syntaxHighlighting: true,
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Code className="h-4 w-4" />
            <span>Code Content</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Programming Language</Label>
            <Select
              value={codeConfig.language || 'javascript'}
              onValueChange={value =>
                handleUpdate({
                  codeConfig: {
                    ...codeConfig,
                    language: value,
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="c">C</SelectItem>
                <SelectItem value="php">PHP</SelectItem>
                <SelectItem value="sql">SQL</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
                <SelectItem value="rust">Rust</SelectItem>
                <SelectItem value="go">Go</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={field.advanced?.defaultValue?.toString() || ''}
              onChange={e =>
                handleUpdate({
                  advanced: {
                    ...field.advanced,
                    defaultValue: e.target.value,
                  },
                })
              }
              placeholder="// Enter code here..."
              rows={8}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={field.advanced?.description || ''}
              onChange={e =>
                handleUpdate({
                  advanced: {
                    ...field.advanced,
                    description: e.target.value,
                  },
                })
              }
              placeholder="Description of this content"
            />
          </div>

          <div className="space-y-2">
            <Label>Editor Settings</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={codeConfig.lineNumbers}
                  onChange={e =>
                    handleUpdate({
                      codeConfig: {
                        ...codeConfig,
                        lineNumbers: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
                <Label className="text-xs">Line Numbers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={codeConfig.autoComplete}
                  onChange={e =>
                    handleUpdate({
                      codeConfig: {
                        ...codeConfig,
                        autoComplete: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
                <Label className="text-xs">Auto Complete</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderAdvancedProperties = () => {
    // Only show advanced properties for interactive fields
    if (['code', 'progress', 'divider', 'grid', 'avatar'].includes(field.type))
      return null;

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
              onChange={e =>
                handleUpdate({
                  advanced: {
                    ...field.advanced,
                    hidden: e.target.checked,
                  },
                })
              }
              className={`h-4 w-4 cursor-pointer rounded-md border border-border bg-background transition-colors ${
                field.advanced?.hidden
                  ? `${checkboxColors.bg} ${checkboxColors.border}`
                  : 'border-border'
              } ${checkboxColors.focus} ${checkboxColors.hover}`}
              style={{
                accentColor: field.advanced?.hidden
                  ? checkboxColors.cssColor
                  : undefined,
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
              onChange={e =>
                handleUpdate({
                  advanced: {
                    ...field.advanced,
                    readonly: e.target.checked,
                  },
                })
              }
              className={`h-4 w-4 cursor-pointer rounded-md border border-border bg-background transition-colors ${
                field.advanced?.readonly
                  ? `${checkboxColors.bg} ${checkboxColors.border}`
                  : 'border-border'
              } ${checkboxColors.focus} ${checkboxColors.hover}`}
              style={{
                accentColor: field.advanced?.readonly
                  ? checkboxColors.cssColor
                  : undefined,
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
              onChange={e =>
                handleUpdate({
                  advanced: {
                    ...field.advanced,
                    disabled: e.target.checked,
                  },
                })
              }
              className={`h-4 w-4 cursor-pointer rounded-md border border-border bg-background transition-colors ${
                field.advanced?.disabled
                  ? `${checkboxColors.bg} ${checkboxColors.border}`
                  : 'border-border'
              } ${checkboxColors.focus} ${checkboxColors.hover}`}
              style={{
                accentColor: field.advanced?.disabled
                  ? checkboxColors.cssColor
                  : undefined,
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
    <motion.div
      className="flex h-full w-full flex-col border-l border-border bg-background md:w-80"
      initial={{ x: isMobile ? '100%' : 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Mobile header with close button */}
      {isMobile && (
        <div className="flex items-center justify-between border-b border-border p-4 mobile-modal-header">
          <div className="flex items-center space-x-2">
            <Sliders className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Field Properties</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 hover:bg-destructive/10 hover:text-destructive close-button"
            title="Close properties"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Desktop title - hidden on mobile */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="mb-2 text-lg font-semibold">Field Properties</h2>
              <p className="text-sm text-muted-foreground">
                Configure the selected field
              </p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {field.type !== 'divider' && renderBasicProperties()}
              {['text', 'phone', 'url'].includes(field.type) &&
                renderTextProperties()}
              {field.type !== 'submit' && renderOptionsProperties()}
              {field.type !== 'submit' && renderFileProperties()}
              {field.type !== 'submit' && renderRatingProperties()}
              {field.type !== 'submit' && renderSliderProperties()}
              {field.type !== 'submit' && renderGridProperties()}
              {field.type !== 'submit' && renderStructuralProperties()}
              {field.type !== 'submit' && renderHtmlCodeProperties()}
              {field.type !== 'submit' && renderLayoutProperties()}
              {field.type !== 'submit' && renderConditionalProperties()}
              {field.type !== 'submit' && renderAdvancedProperties()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PropertyPanel;

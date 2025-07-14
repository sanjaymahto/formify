'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useFormStore } from '@/lib/store';
import { FieldType } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  FIELD_CATEGORIES,
  DEFAULT_FIELD_LABELS,
  DEFAULT_FIELD_PLACEHOLDERS,
} from '@/constants';

export default function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const addField = useFormStore(state => state.addField);
  const setSelectedField = useFormStore(state => state.setSelectedField);
  const fields = useFormStore(state => state.fields);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-96 overflow-y-auto border-r border-border bg-background p-4">
        <div className="space-y-4">
          <div>
            <h2 className="mb-4 text-lg font-semibold">Form Components</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Loading components...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent, fieldType: FieldType) => {
    // Don't allow dragging submit button if one already exists or if no other fields exist
    if (
      fieldType === 'submit' &&
      (fields.some(field => field.type === 'submit') ||
        !fields.some(field => field.type !== 'submit'))
    ) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('fieldType', fieldType);
  };

  const handleAddField = (fieldType: FieldType) => {
    // Don't allow adding submit button if one already exists or if no other fields exist
    if (
      fieldType === 'submit' &&
      (fields.some(field => field.type === 'submit') ||
        !fields.some(field => field.type !== 'submit'))
    ) {
      return;
    }

    const field = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: fieldType,
      label: getDefaultLabel(fieldType),
      placeholder: getDefaultPlaceholder(fieldType),
      required: false,
      options:
        fieldType === 'select' ||
        fieldType === 'radio' ||
        fieldType === 'multi-select'
          ? ['Option 1', 'Option 2', 'Option 3']
          : undefined,
    };
    addField(field);
    setSelectedField(field.id); // Auto-select the newly added field
  };

  const getDefaultLabel = (type: FieldType): string => {
    return DEFAULT_FIELD_LABELS[type] || 'Field';
  };

  const getDefaultPlaceholder = (type: FieldType): string => {
    return DEFAULT_FIELD_PLACEHOLDERS[type] || '';
  };

  return (
    <motion.div
      className="flex h-full w-80 flex-col border-r border-border bg-background"
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="mb-4 text-lg font-semibold">Form Components</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Drag and drop components to build your form
            </p>
          </motion.div>

          {FIELD_CATEGORIES.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.4 + categoryIndex * 0.1,
                ease: 'easeOut',
              }}
            >
              <motion.h3
                className="text-sm font-medium uppercase tracking-wide text-muted-foreground"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + categoryIndex * 0.1 }}
              >
                {category.name}
              </motion.h3>
              <div className="grid grid-cols-2 gap-2">
                {category.fields.map((field, fieldIndex) => {
                  const IconComponent = field.icon;
                  const isSubmitButton = field.type === 'submit';
                  const submitButtonExists = fields.some(
                    f => f.type === 'submit'
                  );
                  const hasOtherFields = fields.some(f => f.type !== 'submit');
                  const isDisabled =
                    isSubmitButton && (submitButtonExists || !hasOtherFields);

                  return (
                    <motion.div
                      key={field.type}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.6 + categoryIndex * 0.1 + fieldIndex * 0.05,
                        ease: 'easeOut',
                      }}
                      whileHover={{
                        scale: isDisabled ? 1 : 1.02,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{
                        scale: isDisabled ? 1 : 0.98,
                        transition: { duration: 0.1 },
                      }}
                    >
                      <Card
                        className={`transition-shadow ${
                          isDisabled
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer hover:shadow-md active:cursor-grabbing'
                        }`}
                        draggable={!isDisabled}
                        onDragStart={e => handleDragStart(e, field.type)}
                        onClick={() =>
                          !isDisabled && handleAddField(field.type)
                        }
                      >
                        <CardContent className="flex flex-col items-center space-y-1 p-2">
                          <IconComponent
                            className={`h-4 w-4 ${
                              isDisabled
                                ? 'text-muted-foreground/50'
                                : 'text-muted-foreground'
                            }`}
                          />
                          <span
                            className={`text-center text-xs font-medium ${
                              isDisabled ? 'text-muted-foreground/50' : ''
                            }`}
                          >
                            {field.label}
                          </span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
              {categoryIndex < FIELD_CATEGORIES.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.7 + categoryIndex * 0.1,
                  }}
                >
                  <Separator className="my-4" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

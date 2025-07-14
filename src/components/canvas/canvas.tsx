'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFormStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TemplateSelector } from '@/components/template-selector/template-selector';
import { FormTitle } from '@/components/form/form-title';
import { SavedForms } from '@/components/form/saved-forms';
import {
  FileText,
  Sparkles,
} from 'lucide-react';
import { FieldRenderer } from './field-renderer';
import { GhostField } from './ghost-field';
import { handleImageUpload } from './image-handlers';
import {
  handleDragStart,
  handleDragOver,
  handleDragEnter,
  handleDragLeave,
  handleDrop,
  type DragDropState,
} from './drag-drop-handlers';
import { setupKeyboardHandlers } from './keyboard-handlers';

export default function Canvas() {
  const {
    fields,
    selectedFieldId,
    setSelectedField,
    removeField,
    addField,
    reorderFields,
    coverImage,
    logoImage,
    setCoverImage,
    setLogoImage,
    shouldShowField,
  } = useFormStore();

  // Drag and drop state
  const [dragState, setDragState] = useState<DragDropState>({
    draggedFieldId: null,
    dragOverFieldId: null,
    isDragOverCanvas: false,
    ghostFieldType: null,
    ghostInsertIndex: null,
  });

  // UI state
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Image handlers
  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, setCoverImage);
    }
  };

  const handleRemoveCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCoverImage(null);
  };

  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, setLogoImage);
    }
  };

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLogoImage(null);
  };

  // Utility functions
  const scrollToField = (fieldId: string) => {
    const fieldElement = fieldRefs.current[fieldId];
    if (fieldElement && scrollContainerRef.current) {
      fieldElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const moveField = (fieldId: string, newIndex: number) => {
    const currentIndex = fields.findIndex(f => f.id === fieldId);
    if (currentIndex !== -1 && newIndex !== currentIndex) {
      reorderFields(currentIndex, newIndex);
    }
  };

  // Drag and drop handlers
  const handleDragStartWrapper = (fieldId: string) => {
    handleDragStart(fieldId, setDragState);
  };

  const handleDragOverWrapper = (e: React.DragEvent, fieldId?: string) => {
    handleDragOver(
      e,
      fieldId,
      (id) => setDragState(prev => ({ ...prev, dragOverFieldId: id })),
      (isDragOver) => setDragState(prev => ({ ...prev, isDragOverCanvas: isDragOver })),
      (type) => setDragState(prev => ({ ...prev, ghostFieldType: type })),
      (index) => setDragState(prev => ({ ...prev, ghostInsertIndex: index })),
      fields
    );
  };

  const handleDragEnterWrapper = (e: React.DragEvent) => {
    handleDragEnter(e, (isDragOver) => setDragState(prev => ({ ...prev, isDragOverCanvas: isDragOver })));
  };

  const handleDragLeaveWrapper = (e: React.DragEvent) => {
    handleDragLeave(e, (isDragOver) => setDragState(prev => ({ ...prev, isDragOverCanvas: isDragOver })));
  };

  const handleDropWrapper = (e: React.DragEvent, targetFieldId?: string) => {
    handleDrop(
      e,
      targetFieldId,
      addField,
      moveField,
      (id) => setDragState(prev => ({ ...prev, draggedFieldId: id })),
      (id) => setDragState(prev => ({ ...prev, dragOverFieldId: id })),
      (isDragOver) => setDragState(prev => ({ ...prev, isDragOverCanvas: isDragOver })),
      (type) => setDragState(prev => ({ ...prev, ghostFieldType: type })),
      (index) => setDragState(prev => ({ ...prev, ghostInsertIndex: index })),
      fields
    );
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = setupKeyboardHandlers(
      fields,
      selectedFieldId,
      setSelectedField,
      removeField,
      addField,
      moveField,
      scrollToField,
      setShowKeyboardShortcuts
    );

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fields, selectedFieldId, setSelectedField, removeField, addField, moveField, scrollToField, setShowKeyboardShortcuts]);

  // Global drag handlers
  useEffect(() => {
    const handleGlobalDragStart = (e: DragEvent) => {
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
      }
    };

    const handleGlobalDragEnd = () => {
      setDragState({
        draggedFieldId: null,
        dragOverFieldId: null,
        isDragOverCanvas: false,
        ghostFieldType: null,
        ghostInsertIndex: null,
      });
    };

    document.addEventListener('dragstart', handleGlobalDragStart);
    document.addEventListener('dragend', handleGlobalDragEnd);

    return () => {
      document.removeEventListener('dragstart', handleGlobalDragStart);
      document.removeEventListener('dragend', handleGlobalDragEnd);
    };
  }, []);

  // Separate submit buttons from other fields
  const submitFields = fields.filter(field => field.type === 'submit');
  const otherFields = fields.filter(field => field.type !== 'submit');

  return (
    <motion.div
      className="flex h-full flex-col bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main content area with scroll */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-6"
        onDragEnter={handleDragEnterWrapper}
        onDragOver={e => handleDragOverWrapper(e)}
        onDragLeave={handleDragLeaveWrapper}
        onDrop={e => handleDropWrapper(e)}
      >
        <motion.div
          className="mx-auto max-w-4xl space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onDragEnter={handleDragEnterWrapper}
          onDragOver={e => handleDragOverWrapper(e)}
          onDragLeave={handleDragLeaveWrapper}
          onDrop={e => handleDropWrapper(e)}
        >
          {/* Cover Image Placeholder */}
          <div className="relative w-full h-48 rounded-xl overflow-hidden mb-[-3.5rem] cursor-pointer group" onClick={handleCoverClick}>
            {coverImage ? (
              <img src={coverImage} alt="Cover" className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-muted-foreground/10 text-muted-foreground text-lg font-medium">
                Click to upload cover image
              </div>
            )}
            {coverImage && (
              <button
                type="button"
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemoveCover}
                title="Remove cover image"
                tabIndex={0}
              >
                ×
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
          </div>

          {/* Logo Placeholder */}
          <div className="relative flex justify-start z-10 group" style={{ marginTop: '-2.5rem', marginBottom: '1.5rem' }}>
            <div className="relative ml-6" onClick={handleLogoClick}>
              {logoImage ? (
                <img src={logoImage} alt="Logo" className="w-20 h-20 rounded-full border-4 border-neutral-300 dark:border-neutral-700 bg-background object-cover shadow-lg cursor-pointer" />
              ) : (
                <div className="w-20 h-20 rounded-full border-4 border-neutral-300 dark:border-neutral-700 bg-background flex items-center justify-center text-3xl text-muted-foreground shadow-lg cursor-pointer">
                  +
                </div>
              )}
              {logoImage && (
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleRemoveLogo}
                  title="Remove logo"
                  style={{ transform: 'translate(40%, -40%)' }}
                  tabIndex={0}
                >
                  ×
                </button>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
          </div>

          {/* Form Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <FormTitle />
          </motion.div>

          <AnimatePresence mode="wait">
            {fields.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className={`flex flex-col items-center justify-center py-12 text-center transition-all duration-200 ${
                  dragState.isDragOverCanvas
                    ? 'bg-primary/5 border-primary/30 rounded-lg border-2 border-dashed'
                    : ''
                }`}
                onDragOver={e => handleDragOverWrapper(e)}
                onDrop={e => handleDropWrapper(e)}
              >
                <motion.div
                  className="mb-4 text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <FileText className="mx-auto h-12 w-12" />
                </motion.div>
                <motion.h3
                  className="mb-2 text-lg font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  No fields added yet
                </motion.h3>
                <motion.p
                  className="mb-4 text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  Drag and drop components from the sidebar to start building
                  your form
                </motion.p>
                <motion.p
                  className="mb-6 font-medium text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  or
                </motion.p>
                <motion.p
                  className="mb-4 text-xs text-muted-foreground/70"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  💡 Tip: Use arrow keys to navigate fields, F1 for keyboard shortcuts
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => setShowTemplateSelector(true)}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Choose a Template
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <div className="flex items-center gap-4 my-6">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground font-medium">OR</span>
                    <Separator className="flex-1" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <SavedForms />
                </motion.div>
              </motion.div>
            ) : (
              <AnimatePresence>
                {otherFields
                  .filter(field => shouldShowField(field))
                  .map((field, index) => (
                    <motion.div
                      key={field.id}
                      ref={el => {
                        fieldRefs.current[field.id] = el;
                      }}
                      initial={{ opacity: 0, x: -20, y: 10 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      exit={{ opacity: 0, x: 20, y: -10, height: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: 'easeOut',
                      }}
                      layout
                    >
                      {/* Drop zone above each field */}
                      <div
                        className={`h-2 transition-all duration-200 ${
                          dragState.dragOverFieldId === field.id
                            ? 'bg-primary/20'
                            : 'bg-transparent'
                        }`}
                        onDragOver={e => handleDragOverWrapper(e, field.id)}
                        onDrop={e => handleDropWrapper(e, field.id)}
                      />

                      {/* Ghost field above */}
                      {dragState.ghostFieldType && dragState.ghostInsertIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <GhostField fieldType={dragState.ghostFieldType} />
                        </motion.div>
                      )}

                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FieldRenderer
                          field={field}
                          isSelected={selectedFieldId === field.id}
                          onSelect={() => setSelectedField(field.id)}
                          onDelete={() => removeField(field.id)}
                          onDragStart={handleDragStartWrapper}
                          onDragOver={handleDragOverWrapper}
                          onDragLeave={handleDragLeaveWrapper}
                          onDrop={handleDropWrapper}
                          isDragOver={dragState.dragOverFieldId === field.id}
                          isDragging={dragState.draggedFieldId === field.id}
                        />
                      </motion.div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            )}
          </AnimatePresence>

          {/* Ghost field at the end */}
          {dragState.ghostFieldType && dragState.ghostInsertIndex === otherFields.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <GhostField fieldType={dragState.ghostFieldType} />
            </motion.div>
          )}

          {/* Drop zone at the end */}
          <div
            className={`h-2 transition-all duration-200 ${
              dragState.isDragOverCanvas && !dragState.dragOverFieldId
                ? 'bg-primary/20'
                : 'bg-transparent'
            }`}
            onDragOver={e => handleDragOverWrapper(e)}
            onDrop={e => handleDropWrapper(e)}
          />

          {/* Extra space at bottom for dragging */}
          <div className="h-32" />
        </motion.div>

        <AnimatePresence>
          {showTemplateSelector && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TemplateSelector
                onClose={() => setShowTemplateSelector(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed submit buttons at bottom */}
      {submitFields.length > 0 && (
        <motion.div
          className="border-t bg-background p-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="mx-auto max-w-4xl space-y-4">
            {submitFields.map((field, index) => (
              <motion.div
                key={field.id}
                ref={el => {
                  fieldRefs.current[field.id] = el;
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <FieldRenderer
                  field={field}
                  isSelected={selectedFieldId === field.id}
                  onSelect={() => setSelectedField(field.id)}
                  onDelete={() => removeField(field.id)}
                  onDragStart={handleDragStartWrapper}
                  onDragOver={handleDragOverWrapper}
                  onDragLeave={handleDragLeaveWrapper}
                  onDrop={handleDropWrapper}
                  isDragOver={dragState.dragOverFieldId === field.id}
                  isDragging={dragState.draggedFieldId === field.id}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

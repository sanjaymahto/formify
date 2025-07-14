'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFormStore, SavedForm } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  FolderOpen,
  Trash2,
  Save,
  Clock,
  FileText,
  X,
  Check,
} from 'lucide-react';
import { showToast, showConfirm } from '@/lib/utils';

export function SavedForms() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveFormName, setSaveFormName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const getSavedForms = useFormStore(state => state.getSavedForms);
  const saveFormAs = useFormStore(state => state.saveFormAs);
  const loadSavedForm = useFormStore(state => state.loadSavedForm);
  const deleteSavedForm = useFormStore(state => state.deleteSavedForm);
  const fields = useFormStore(state => state.fields);
  const formTitle = useFormStore(state => state.formTitle);

  const [savedForms, setSavedForms] = useState<SavedForm[]>([]);

  // Update saved forms when component mounts and when session changes
  useEffect(() => {
    const updateSavedForms = () => {
      const forms = getSavedForms();
      console.log('SavedForms: Updating saved forms:', forms);
      setSavedForms(forms);
    };

    updateSavedForms();

    // Listen for storage changes to update the UI
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'formkit-session') {
        updateSavedForms();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [getSavedForms]);

  // Function to refresh saved forms after operations
  const refreshSavedForms = () => {
    // Force a re-render by updating the state
    setSavedForms([]);
    setTimeout(() => {
      setSavedForms(getSavedForms());
    }, 0);
  };

  const handleSaveForm = async () => {
    if (!saveFormName.trim()) {
      showToast('Please enter a form name', 'error');
      return;
    }

    setIsSaving(true);
    try {
      saveFormAs(saveFormName.trim());
      refreshSavedForms();
      showToast('Form saved successfully!', 'success');
      setShowSaveDialog(false);
      setSaveFormName('');
    } catch {
      showToast('Failed to save form', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadForm = async (savedForm: SavedForm) => {
    if (fields.length > 0) {
      const confirmed = await showConfirm(
        'Loading this form will replace your current form. Are you sure you want to continue?'
      );
      if (!confirmed) return;
    }

    try {
      loadSavedForm(savedForm);
      showToast('Form loaded successfully!', 'success');
    } catch {
      showToast('Failed to load form', 'error');
    }
  };

  const handleDeleteForm = async (savedForm: SavedForm) => {
    const confirmed = await showConfirm(
      `Are you sure you want to delete "${savedForm.name}"? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        deleteSavedForm(savedForm.id);
        refreshSavedForms();
        showToast('Form deleted successfully!', 'success');
      } catch {
        showToast('Failed to delete form', 'error');
      }
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getFieldCount = (savedForm: SavedForm) => {
    return savedForm.formData.fields?.length || 0;
  };

  return (
    <div className="mx-auto mb-6 w-full max-w-4xl">
      <div className="mb-4 text-center">
        <h3 className="mb-2 flex items-center justify-center gap-2 text-lg font-semibold">
          <FolderOpen className="h-5 w-5 text-primary" />
          Load Saved Form
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Continue working on a previously saved form
        </p>
        {fields.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
            className="mx-auto mb-4 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Current Form
          </Button>
        )}
      </div>

      <Card className="border-border/50 bg-card/50 w-full border backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Saved Form
              <span className="bg-primary/10 rounded-full px-2 py-0.5 text-xs font-medium text-primary">
                {savedForms.length}
              </span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? 'Hide' : 'Show'}
            </Button>
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="pt-0">
                {savedForms.length === 0 ? (
                  <div className="py-6 text-center text-muted-foreground">
                    <div className="bg-muted/50 mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full">
                      <FileText className="h-8 w-8 opacity-60" />
                    </div>
                    <p className="mb-1 text-sm font-medium">
                      No saved form yet
                    </p>
                    <p className="text-xs">
                      {fields.length > 0
                        ? 'Save your current form to get started'
                        : 'Create a form and save it to see it here'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedForms.map(savedForm => (
                      <motion.div
                        key={savedForm.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="border-border/50 hover:bg-muted/30 group relative rounded-lg border p-4 transition-all duration-200 hover:border-border"
                      >
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <h4 className="truncate text-sm font-medium transition-colors group-hover:text-primary">
                                {savedForm.name}
                              </h4>
                              <span className="bg-primary/10 rounded-full px-2 py-0.5 text-xs font-medium text-muted-foreground text-primary">
                                {getFieldCount(savedForm)} fields
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(savedForm.timestamp)}
                              </div>
                              {savedForm.isAutoSave && (
                                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600">
                                  Auto-saved
                                </span>
                              )}
                              {savedForm.formData.name &&
                                savedForm.formData.name !== savedForm.name && (
                                  <div className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    {savedForm.formData.name}
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="ml-4 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLoadForm(savedForm)}
                              className="flex h-8 items-center gap-1 px-3"
                            >
                              <FolderOpen className="h-3 w-3" />
                              Load
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteForm(savedForm)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Save Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="border-border/50 mx-4 w-full max-w-md rounded-xl border bg-background p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <Save className="h-5 w-5 text-primary" />
                    Save Form
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Give your form a name to save it for later
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSaveDialog(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="form-name" className="text-sm font-medium">
                    Form Name
                  </Label>
                  <Input
                    id="form-name"
                    value={saveFormName}
                    onChange={e => setSaveFormName(e.target.value)}
                    placeholder={formTitle || 'Enter form name'}
                    className="mt-1"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleSaveForm();
                      } else if (e.key === 'Escape') {
                        setShowSaveDialog(false);
                      }
                    }}
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSaveDialog(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveForm}
                    disabled={isSaving || !saveFormName.trim()}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Save Form
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

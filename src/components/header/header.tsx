'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { useFormStore } from '@/lib/store';
import { useSettingsStore } from '@/lib/settings-store';
import {
  Eye,
  Edit3,
  Save,
  Sun,
  Moon,
  Clock,
  CheckCircle,
  X,
  Undo2,
  Redo2,
  Keyboard,
  Menu,
  Sliders,
} from 'lucide-react';
import { ExportImportButtons } from '@/components/export-import/export-import';
import { useAutoSave } from '@/hooks/use-auto-save';
import { SettingsButton } from '@/components/settings/settings-button';
import { showToast } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import KeyboardShortcutsModal from '@/components/keyboard-modal/keyboard-shortcuts-modal';

interface HeaderProps {
  onSidebarToggle?: () => void;
  onPropertyPanelToggle?: () => void;
  isMobile?: boolean;
}

const Header = ({ 
  onSidebarToggle, 
  onPropertyPanelToggle, 
  isMobile = false
}: HeaderProps) => {
  const isPreviewMode = useFormStore(state => state.isPreviewMode);
  const togglePreviewMode = useFormStore(state => state.togglePreviewMode);
  const fields = useFormStore(state => state.fields);
  const formTitle = useFormStore(state => state.formTitle);
  const toggleAutoSave = useFormStore(state => state.toggleAutoSave);
  const autoSaveEnabled = useFormStore(state => state.autoSaveEnabled);
  const lastSaved = useFormStore(state => state.lastSaved);
  const saveForm = useFormStore(state => state.saveForm);
  const clearForm = useFormStore(state => state.clearForm);
  const undo = useFormStore(state => state.undo);
  const redo = useFormStore(state => state.redo);
  const historyIndex = useFormStore(state => state.historyIndex);
  const history = useFormStore(state => state.history);
  const clearHistory = useFormStore(state => state.clearHistory);
  const selectedFieldId = useFormStore(state => state.selectedFieldId);
  const { theme, updateSettings, colorPalette } = useSettingsStore();
  const { isDirty } = useAutoSave();

  // Keyboard shortcuts modal state
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Calculate undo/redo availability
  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not in preview mode
      if (isPreviewMode) return;

      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          undo();
        }
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (
        (e.ctrlKey && e.key === 'y') ||
        (e.ctrlKey && e.shiftKey && e.key === 'z')
      ) {
        e.preventDefault();
        if (canRedo) {
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewMode, canUndo, canRedo, undo, redo]);

  // Clear history when component unmounts (session ends)
  useEffect(() => {
    return () => {
      // Clear undo/redo history when the session ends
      clearHistory();
    };
  }, [clearHistory]);

  // Clear history when page is about to unload (browser close/refresh)
  useEffect(() => {
    const handleBeforeUnload = () => {
      clearHistory();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [clearHistory]);

  // Handle save form with toast notification
  const handleSaveForm = () => {
    try {
      saveForm();
      showToast('Form saved successfully!', 'success');
    } catch (error) {
      console.error('Save failed:', error);
      showToast('Failed to save form', 'error');
    }
  };

  // Handle close form with auto-save
  const handleCloseForm = () => {
    try {
      // Auto-save the form before closing
      if (fields.length > 0) {
        saveForm();
        showToast('Form auto-saved before closing', 'info');
      }
      // Clear the form to start a new one
      clearForm();
      // Clear undo/redo history for the new session
      clearHistory();
      showToast('Form cleared - ready to create a new form', 'success');
    } catch (error) {
      console.error('Close failed:', error);
      showToast('Failed to save form before closing', 'error');
    }
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // F1 or Ctrl+? to show keyboard shortcuts
      if (e.key === 'F1' || (e.ctrlKey && e.key === '?')) {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
        return;
      }

      // Ctrl+S to save form
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSaveForm();
        return;
      }

      // Ctrl+P to toggle preview mode
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        togglePreviewMode();
        return;
      }

      // Ctrl+T to toggle theme
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        updateSettings({ theme: theme === 'light' ? 'dark' : 'light' });
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveForm, togglePreviewMode, updateSettings, theme]);

  // Get theme toggle colors based on color palette
  const getThemeToggleColors = () => {
    const colors = {
      default: {
        light: 'text-gray-600 dark:text-gray-400',
        dark: 'text-gray-600 dark:text-gray-400',
      },
      blue: {
        light: 'text-blue-600 dark:text-blue-400',
        dark: 'text-blue-600 dark:text-blue-400',
      },
      green: {
        light: 'text-green-600 dark:text-green-400',
        dark: 'text-green-600 dark:text-green-400',
      },
      purple: {
        light: 'text-purple-600 dark:text-purple-400',
        dark: 'text-purple-600 dark:text-purple-400',
      },
      orange: {
        light: 'text-orange-600 dark:text-orange-400',
        dark: 'text-orange-600 dark:text-orange-400',
      },
      pink: {
        light: 'text-pink-600 dark:text-pink-400',
        dark: 'text-pink-600 dark:text-pink-400',
      },
      red: {
        light: 'text-red-600 dark:text-red-400',
        dark: 'text-red-600 dark:text-red-400',
      },
      teal: {
        light: 'text-teal-600 dark:text-teal-400',
        dark: 'text-teal-600 dark:text-teal-400',
      },
      indigo: {
        light: 'text-indigo-600 dark:text-indigo-400',
        dark: 'text-indigo-600 dark:text-indigo-400',
      },
      yellow: {
        light: 'text-yellow-600 dark:text-yellow-400',
        dark: 'text-yellow-600 dark:text-yellow-400',
      },
    };
    return colors[colorPalette];
  };

  const themeColors = getThemeToggleColors();

  //Last saved form time
  const formatLastSaved = (timestamp: number | null) => {
    if (!timestamp) return null;
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <motion.header
      className="flex h-16 items-center justify-between border-b border-border bg-background p-4 text-foreground"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Left side - Logo and title */}
      <motion.div
        className="flex items-center space-x-2 md:space-x-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Mobile sidebar toggle */}
        {isMobile && !isPreviewMode && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onSidebarToggle}
              className="h-8 w-8 md:hidden"
              title="Toggle sidebar"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <span className="text-lg font-bold tracking-tight text-foreground md:text-xl">
              formify*
            </span>
          </Link>
        </motion.div>

        {/* Divider - hidden on mobile */}
        <motion.div
          className="hidden h-6 w-px bg-border md:block"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        ></motion.div>

        {/* Form title and info - hidden on mobile */}
        <motion.div
          className="hidden flex-col md:flex"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h1
            className="max-w-xs truncate text-lg font-semibold"
            title={isPreviewMode ? 'Form Preview' : formTitle}
          >
            {isPreviewMode ? 'Form Preview' : formTitle}
          </h1>
        </motion.div>

        {/* Form info - hidden on mobile */}
        <motion.div
          className="hidden items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 md:flex"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <span className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-800">
            {fields.length} field{fields.length !== 1 ? 's' : ''}
          </span>
          {!isPreviewMode && (
            <div className="flex items-center space-x-2">
              {isDirty ? (
                <span className="flex items-center text-xs text-orange-600 dark:text-orange-400">
                  <Clock className="mr-1 h-3 w-3" />
                  Unsaved changes
                </span>
              ) : lastSaved ? (
                <span className="flex items-center text-xs text-green-600 dark:text-green-400">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  {formatLastSaved(lastSaved)}
                </span>
              ) : null}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Right side - Actions */}
      <motion.div
        className="flex items-center space-x-2 md:space-x-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Desktop actions - hidden on mobile */}
        <div className="hidden md:flex md:items-center md:space-x-3">
          {!isPreviewMode && <ExportImportButtons />}

          {!isPreviewMode && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAutoSave}
                className={`h-8 cursor-pointer px-2 text-xs ${autoSaveEnabled ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}
                title={`Auto-save is ${autoSaveEnabled ? 'enabled' : 'disabled'}`}
              >
                <Save className="mr-1 h-3 w-3" />
                Auto-save {autoSaveEnabled ? 'ON' : 'OFF'}
              </Button>
            </motion.div>
          )}

          {!isPreviewMode && (
            <motion.div
              className="flex items-center space-x-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={undo}
                  disabled={!canUndo}
                  className="h-8 w-8 cursor-pointer border-2 transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={redo}
                  disabled={!canRedo}
                  className="h-8 w-8 cursor-pointer border-2 transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Mobile property panel toggle */}
        {isMobile && !isPreviewMode && selectedFieldId && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onPropertyPanelToggle}
              className="h-8 w-8 md:hidden"
              title="Toggle properties"
            >
              <Sliders className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* Common actions - visible on all screen sizes */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowKeyboardShortcuts(true)}
            className="h-8 w-8 cursor-pointer border-2 transition-all duration-200 hover:scale-110"
            title="Keyboard shortcuts (F1)"
          >
            <Keyboard className="h-4 w-4" />
          </Button>
        </motion.div>

        <SettingsButton
          className="h-8 w-8 p-0"
          tooltipText="Customize app appearance and settings"
        />

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              updateSettings({ theme: theme === 'light' ? 'dark' : 'light' })
            }
            className="bg-background/50 h-8 w-8 cursor-pointer border-2 backdrop-blur-sm transition-all duration-200 hover:scale-110"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className={`h-4 w-4 ${themeColors.dark}`} />
            ) : (
              <Sun className={`h-4 w-4 ${themeColors.light}`} />
            )}
          </Button>
        </motion.div>

        {fields.length > 0 && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant={isPreviewMode ? 'default' : 'outline'}
              size="icon"
              onClick={togglePreviewMode}
              className="h-8 w-8 cursor-pointer border-2 transition-all duration-200 hover:scale-110"
              data-preview-toggle
              title={
                isPreviewMode
                  ? 'Switch to edit mode (Ctrl+P)'
                  : 'Switch to preview mode (Ctrl+P)'
              }
            >
              {isPreviewMode ? (
                <Edit3 className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </motion.div>
        )}

        {/* Close form button - desktop only */}
        {!isPreviewMode && fields.length > 0 && (
          <motion.div
            className="hidden md:block"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={handleCloseForm}
              className="h-8 w-8 cursor-pointer border-2 transition-all duration-200 hover:scale-110 hover:border-red-300 hover:bg-red-50 dark:hover:border-red-700 dark:hover:bg-red-950/20"
              title="Close current form and start a new one"
            >
              <X className="h-4 w-4 text-red-600 dark:text-red-400" />
            </Button>
          </motion.div>
        )}

        {/* Mobile close form button */}
        {isMobile && !isPreviewMode && fields.length > 0 && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseForm}
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive close-button"
              title="Close form"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        <AnimatePresence>
          {isPreviewMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveForm}
                className="flex cursor-pointer items-center space-x-2"
                title="Save form (Ctrl+S)"
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save Form</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Keyboard shortcuts modal */}
      <KeyboardShortcutsModal
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
    </motion.header>
  );
};

export { Header };

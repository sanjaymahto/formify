'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { useFormStore } from '@/lib/store';
import { useSettingsStore } from '@/lib/settings-store';
import { Eye, Edit3, Save, Sun, Moon, Clock, CheckCircle } from 'lucide-react';
import { ExportImportButtons } from './export-import';
import { useAutoSave } from '@/hooks/use-auto-save';
import { SettingsButton } from './settings-button';
import { showToast } from '@/lib/utils';
import Link from 'next/link';

const Header = () => {
  const isPreviewMode = useFormStore(state => state.isPreviewMode);
  const togglePreviewMode = useFormStore(state => state.togglePreviewMode);
  const fields = useFormStore(state => state.fields);
  const formTitle = useFormStore(state => state.formTitle);
  const toggleAutoSave = useFormStore(state => state.toggleAutoSave);
  const autoSaveEnabled = useFormStore(state => state.autoSaveEnabled);
  const lastSaved = useFormStore(state => state.lastSaved);
  const saveForm = useFormStore(state => state.saveForm);
  const { theme, updateSettings, colorPalette } = useSettingsStore();
  const { isDirty } = useAutoSave();

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
      <motion.div
        className="flex items-center space-x-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <span className="text-xl font-bold tracking-tight text-foreground">
              formify*
            </span>
          </Link>
        </motion.div>
        <motion.div
          className="h-6 w-px bg-border"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        ></motion.div>
        <motion.div
          className="flex flex-col"
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
        <motion.div
          className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
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

      <motion.div
        className="flex items-center space-x-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
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

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant={isPreviewMode ? 'default' : 'outline'}
            size="sm"
            onClick={togglePreviewMode}
            className="flex cursor-pointer items-center space-x-2"
            title={
              isPreviewMode
                ? 'Switch to edit mode (Ctrl+P)'
                : 'Switch to preview mode (Ctrl+P)'
            }
          >
            {isPreviewMode ? (
              <>
                <Edit3 className="h-4 w-4" />
                <span>Edit</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </>
            )}
          </Button>
        </motion.div>

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
                <span>Save Form</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
};

export { Header };

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useFormStore } from '@/lib/store';
import { useSettingsStore } from '@/lib/settings-store';
import { Eye, Edit3, Save, Sun, Moon, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { ExportImportButtons } from './export-import';
import { useAutoSave } from '@/hooks/use-auto-save';
import { SettingsButton } from './settings-button';
import { TemplateSelector } from './template-selector';
import Link from 'next/link';

const Header = () => {
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const isPreviewMode = useFormStore(state => state.isPreviewMode);
  const togglePreviewMode = useFormStore(state => state.togglePreviewMode);
  const fields = useFormStore(state => state.fields);
  const formTitle = useFormStore(state => state.formTitle);
  const toggleAutoSave = useFormStore(state => state.toggleAutoSave);
  const autoSaveEnabled = useFormStore(state => state.autoSaveEnabled);
  const lastSaved = useFormStore(state => state.lastSaved);
  const { theme, updateSettings, colorPalette } = useSettingsStore();
  const { isDirty } = useAutoSave();

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
    <header className="flex h-16 items-center justify-between border-b border-border bg-background p-4 text-foreground">
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
        >
          <span className="text-xl font-bold tracking-tight text-foreground">
            formify*
          </span>
        </Link>
        <div className="h-6 w-px bg-border"></div>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">
            {isPreviewMode ? 'Form Preview' : formTitle}
          </h1>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
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
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {!isPreviewMode && <ExportImportButtons />}

        {!isPreviewMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplateSelector(true)}
            className="flex items-center gap-2 cursor-pointer"
            title="Choose a template to get started quickly"
          >
            <Sparkles className="h-4 w-4" />
            Templates
          </Button>
        )}

        {!isPreviewMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAutoSave}
            className={`h-8 px-2 text-xs cursor-pointer ${autoSaveEnabled ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}
            title={`Auto-save is ${autoSaveEnabled ? 'enabled' : 'disabled'}`}
          >
            <Save className="mr-1 h-3 w-3" />
            Auto-save {autoSaveEnabled ? 'ON' : 'OFF'}
          </Button>
        )}

        <SettingsButton
          className="h-8 w-8 p-0"
          tooltipText="Customize app appearance and settings"
        />

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            updateSettings({ theme: theme === 'light' ? 'dark' : 'light' })
          }
          className="bg-background/50 h-8 w-8 border-2 backdrop-blur-sm transition-all duration-200 hover:scale-110 cursor-pointer"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className={`h-4 w-4 ${themeColors.dark}`} />
          ) : (
            <Sun className={`h-4 w-4 ${themeColors.light}`} />
          )}
        </Button>

        <Button
          variant={isPreviewMode ? 'default' : 'outline'}
          size="sm"
          onClick={togglePreviewMode}
          className="flex items-center space-x-2 cursor-pointer"
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

        {isPreviewMode && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 cursor-pointer"
            title="Save form (Ctrl+S)"
          >
            <Save className="h-4 w-4" />
            <span>Save Form</span>
          </Button>
        )}
      </div>
      
      {showTemplateSelector && (
        <TemplateSelector onClose={() => setShowTemplateSelector(false)} />
      )}
    </header>
  );
};

export { Header };

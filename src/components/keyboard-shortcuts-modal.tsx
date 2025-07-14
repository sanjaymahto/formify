'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { X, Keyboard, Mouse, Eye, Edit3, Sun } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  const shortcuts = [
    {
      category: 'Canvas Mode (Form Builder)',
      icon: <Edit3 className="h-4 w-4" />,
      shortcuts: [
        { key: '↑ ↓', description: 'Navigate between form fields' },
        { key: 'Enter', description: 'Edit selected field label' },
        { key: 'Escape', description: 'Deselect field or cancel drag' },
        { key: 'Ctrl+A', description: 'Select first field' },
        { key: 'Delete / Backspace', description: 'Remove selected field' },
        { key: 'Ctrl+D', description: 'Duplicate selected field' },
        { key: 'Space', description: 'Toggle required field' },
      ]
    },
    {
      category: 'Preview Mode',
      icon: <Eye className="h-4 w-4" />,
      shortcuts: [
        { key: 'Tab', description: 'Navigate between form inputs' },
        { key: 'Enter', description: 'Submit form (if submit button focused)' },
        { key: 'Escape', description: 'Exit preview mode' },
      ]
    },
    {
      category: 'Global Shortcuts',
      icon: <Keyboard className="h-4 w-4" />,
      shortcuts: [
        { key: 'Ctrl+P', description: 'Toggle preview/edit mode' },
        { key: 'Ctrl+S', description: 'Save form' },
        { key: 'Ctrl+Z', description: 'Undo last action' },
        { key: 'Ctrl+Y', description: 'Redo last action' },
        { key: 'F1 / Ctrl+?', description: 'Show keyboard shortcuts' },
      ]
    },
    {
      category: 'Theme & Settings',
      icon: <Sun className="h-4 w-4" />,
      shortcuts: [
        { key: 'Ctrl+T', description: 'Toggle theme (light/dark)' },
      ]
    }
  ];

  const renderKey = (key: string) => {
    const isMultiKey = key.includes('+') || key.includes('/');
    
    if (isMultiKey) {
      const keys = key.split(' / ');
      return (
        <div className="flex gap-1">
          {keys.map((k, index) => (
            <React.Fragment key={index}>
              <kbd className="px-2 py-1 text-xs bg-muted rounded border font-mono">
                {k}
              </kbd>
              {index < keys.length - 1 && <span className="text-muted-foreground">/</span>}
            </React.Fragment>
          ))}
        </div>
      );
    }

    return (
      <kbd className="px-2 py-1 text-xs bg-muted rounded border font-mono">
        {key}
      </kbd>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="max-w-4xl w-full mx-4 bg-background rounded-lg shadow-xl border"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Keyboard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
                  <p className="text-sm text-muted-foreground">
                    Master your form building workflow
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {shortcuts.map((category, index) => (
                  <motion.div
                    key={category.category}
                    className="space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-muted rounded-md">
                        {category.icon}
                      </div>
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        {category.category}
                      </h3>
                    </div>
                    <div className="space-y-2 pl-8">
                      {category.shortcuts.map((shortcut, shortcutIndex) => (
                        <div
                          key={shortcutIndex}
                          className="flex items-center justify-between py-1"
                        >
                          <span className="text-sm text-muted-foreground">
                            {shortcut.description}
                          </span>
                          <div className="flex items-center gap-2">
                            {renderKey(shortcut.key)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Tips Section */}
              <motion.div
                className="mt-8 p-4 bg-muted/50 rounded-lg border"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-primary/10 rounded-md mt-0.5">
                    <Mouse className="h-4 w-4 text-primary" />
                  </div>
                                     <div className="space-y-2">
                     <h4 className="font-medium text-sm">Pro Tips</h4>
                     <ul className="text-sm text-muted-foreground space-y-1">
                       <li>• Canvas shortcuts work when building your form</li>
                       <li>• Preview shortcuts work when testing your form</li>
                       <li>• Press F1 anytime to see this help modal</li>
                       <li>• Ctrl+D is great for duplicating similar fields</li>
                       <li>• Use Tab to navigate form inputs in preview mode</li>
                     </ul>
                   </div>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground">
                Press <kbd className="px-1.5 py-0.5 text-xs bg-background rounded border">Esc</kbd> to close
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs"
              >
                Got it
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcutsModal; 
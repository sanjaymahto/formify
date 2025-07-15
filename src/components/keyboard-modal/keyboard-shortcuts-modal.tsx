'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { X, Keyboard, Mouse } from 'lucide-react';
import { KEYBOARD_SHORTCUTS } from '@/constants';

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

  const renderKey = (key: string) => {
    const isMultiKey = key.includes('+') || key.includes('/');

    if (isMultiKey) {
      const keys = key.split(' / ');
      return (
        <div className="flex gap-1">
          {keys.map((k, index) => (
            <React.Fragment key={index}>
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs md:px-2 md:py-1">
                {k}
              </kbd>
              {index < keys.length - 1 && (
                <span className="text-muted-foreground">/</span>
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }

    return (
      <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs md:px-2 md:py-1">
        {key}
      </kbd>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 md:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="mx-2 w-full max-w-4xl rounded-lg border bg-background shadow-xl md:mx-4"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4 md:p-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="bg-primary/10 rounded-lg p-1.5 md:p-2">
                  <Keyboard className="h-4 w-4 text-primary md:h-5 md:w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold md:text-xl">Keyboard Shortcuts</h2>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    Master your form building workflow
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                title="Close shortcuts"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto p-4 md:max-h-[70vh] md:p-6">
              <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
                {KEYBOARD_SHORTCUTS.map((category, index) => (
                  <motion.div
                    key={category.category}
                    className="space-y-2 md:space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="rounded-md bg-muted p-1 md:p-1.5">
                        <category.icon className="h-3 w-3 md:h-4 md:w-4" />
                      </div>
                      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground md:text-sm">
                        {category.category}
                      </h3>
                    </div>
                    <div className="space-y-1 pl-6 md:space-y-2 md:pl-8">
                      {category.shortcuts.map((shortcut, shortcutIndex) => (
                        <div
                          key={shortcutIndex}
                          className="flex flex-col gap-1 py-1 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span className="text-xs text-muted-foreground md:text-sm">
                            {shortcut.description}
                          </span>
                          <div className="flex items-center gap-1 md:gap-2">
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
                className="bg-muted/50 mt-6 rounded-lg border p-3 md:mt-8 md:p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="bg-primary/10 mt-0.5 rounded-md p-1 md:p-1.5">
                    <Mouse className="h-3 w-3 text-primary md:h-4 md:w-4" />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <h4 className="text-xs font-medium md:text-sm">Pro Tips</h4>
                    <ul className="space-y-0.5 text-xs text-muted-foreground md:space-y-1 md:text-sm">
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
            <div className="bg-muted/30 flex flex-col items-center justify-between gap-3 border-t p-4 md:flex-row md:gap-0 md:p-6">
              <p className="text-xs text-muted-foreground text-center md:text-left">
                Press{' '}
                <kbd className="rounded border bg-background px-1 py-0.5 text-xs md:px-1.5">
                  Esc
                </kbd>{' '}
                to close
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="w-full text-xs md:w-auto"
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

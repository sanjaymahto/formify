'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Eye,
  Edit3,
  Save,
  Sliders,
} from 'lucide-react';

interface MobileNavProps {
  onSidebarToggle: () => void;
  onPropertyPanelToggle: () => void;
  isPreviewMode: boolean;
  togglePreviewMode: () => void;
  saveForm: () => void;
  fields: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  selectedFieldId: string | null;
}

export function MobileNav({
  onSidebarToggle,
  onPropertyPanelToggle,
  isPreviewMode,
  togglePreviewMode,
  saveForm,
  fields,
  selectedFieldId,
}: MobileNavProps) {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-around p-2">
        {/* Add Fields */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="h-12 w-12 mobile-nav-button"
            title="Add fields"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </motion.div>

        {/* Properties */}
        {selectedFieldId && !isPreviewMode && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onPropertyPanelToggle}
              className="h-12 w-12 mobile-nav-button"
              title="Field properties"
            >
              <Sliders className="h-5 w-5" />
            </Button>
          </motion.div>
        )}

        {/* Preview/Edit Toggle */}
        {fields.length > 0 && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant={isPreviewMode ? 'default' : 'outline'}
              size="icon"
              onClick={togglePreviewMode}
              className="h-12 w-12 mobile-nav-button"
              title={isPreviewMode ? 'Switch to edit mode' : 'Switch to preview mode'}
            >
              {isPreviewMode ? (
                <Edit3 className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
        )}

        {/* Save Form */}
        {fields.length > 0 && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={saveForm}
              className="h-12 w-12 mobile-nav-button"
              title="Save form"
            >
              <Save className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
} 
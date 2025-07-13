'use client';

import { motion, AnimatePresence } from 'motion/react';
import Canvas from '@/components/canvas';
import Sidebar from '@/components/sidebar';
import PropertyPanel from '@/components/property-panel';
import Preview from '@/components/preview';
import { Header } from '@/components/header';
import { useFormStore } from '@/lib/store';
import { useAutoSave } from '@/hooks/use-auto-save';

export default function BuilderPage() {
  const isPreviewMode = useFormStore(state => state.isPreviewMode);
  const fields = useFormStore(state => state.fields);
  const selectedFieldId = useFormStore(state => state.selectedFieldId);
  const formTitle = useFormStore(state => state.formTitle);

  // Initialize auto-save
  useAutoSave();

  return (
    <motion.div 
      className="flex h-screen flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {!isPreviewMode && (
            <motion.div
              key="sidebar"
              initial={{ x: -384, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -384, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>
        
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {isPreviewMode ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Preview fields={fields} formTitle={formTitle} />
              </motion.div>
            ) : (
              <motion.div
                key="canvas"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Canvas />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        
        <AnimatePresence mode="wait">
          {!isPreviewMode && selectedFieldId && (
            <motion.div
              key="property-panel"
              initial={{ x: '85%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '85%', opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <PropertyPanel
                field={fields.find(f => f.id === selectedFieldId) || null}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

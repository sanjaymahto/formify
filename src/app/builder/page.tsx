'use client';

import { motion, AnimatePresence } from 'motion/react';
import Canvas from '@/components/canvas/canvas';
import Sidebar from '@/components/sidebar/sidebar';
import PropertyPanel from '@/components/property-panel/property-panel';
import Preview from '@/components/preview/preview';
import { Header } from '@/components/header/header';
import { MobileNav } from '@/components/mobile-nav/mobile-nav';
import { useFormStore } from '@/lib/store';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useState, useEffect } from 'react';

export default function BuilderPage() {
  const isPreviewMode = useFormStore(state => state.isPreviewMode);
  const fields = useFormStore(state => state.fields);
  const selectedFieldId = useFormStore(state => state.selectedFieldId);
  const formTitle = useFormStore(state => state.formTitle);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [propertyPanelOpen, setPropertyPanelOpen] = useState(false);

  // Initialize auto-save
  useAutoSave();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
        setPropertyPanelOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div
      className="flex h-screen flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header 
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        onPropertyPanelToggle={() => setPropertyPanelOpen(!propertyPanelOpen)}
        isMobile={isMobile}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden on mobile unless open */}
        <AnimatePresence mode="wait">
          {!isPreviewMode && (sidebarOpen || !isMobile) && (
            <motion.div
              key="sidebar"
              initial={{ x: isMobile ? -320 : -384, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isMobile ? -320 : -384, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`${
                isMobile 
                  ? 'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-80' 
                  : 'relative w-80'
              }`}
            >
              <Sidebar onClose={() => setSidebarOpen(false)} isMobile={isMobile} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile overlay for sidebar */}
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          <AnimatePresence mode="wait">
            {isPreviewMode ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <Preview fields={fields} formTitle={formTitle} />
              </motion.div>
            ) : (
              <motion.div
                key="canvas"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <Canvas />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Property Panel - Hidden on mobile unless open */}
        <AnimatePresence mode="wait">
          {!isPreviewMode && selectedFieldId && (propertyPanelOpen || !isMobile) && (
            <motion.div
              key="property-panel"
              initial={{ x: isMobile ? '100%' : '85%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isMobile ? '100%' : '85%', opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`${
                isMobile 
                  ? 'fixed right-0 top-16 z-40 h-[calc(100vh-4rem)] w-80' 
                  : 'relative w-80'
              }`}
            >
              <PropertyPanel
                field={fields.find(f => f.id === selectedFieldId) || null}
                onClose={() => setPropertyPanelOpen(false)}
                isMobile={isMobile}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile overlay for property panel */}
        {isMobile && propertyPanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50"
            onClick={() => setPropertyPanelOpen(false)}
          />
        )}
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNav
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          onPropertyPanelToggle={() => setPropertyPanelOpen(!propertyPanelOpen)}
          isPreviewMode={isPreviewMode}
          togglePreviewMode={useFormStore.getState().togglePreviewMode}
          saveForm={useFormStore.getState().saveForm}
          fields={fields}
          selectedFieldId={selectedFieldId}
        />
      )}
    </motion.div>
  );
}

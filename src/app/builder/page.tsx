'use client';

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
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {!isPreviewMode && <Sidebar />}
        <main className="flex-1 overflow-auto">
          {isPreviewMode ? <Preview fields={fields} formTitle={formTitle} /> : <Canvas />}
        </main>
        {!isPreviewMode && (
          <PropertyPanel
            field={fields.find(f => f.id === selectedFieldId) || null}
          />
        )}
      </div>
    </div>
  );
}

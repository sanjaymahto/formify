import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FormTemplate } from './templates';

// Utility function to get timestamp only on client side
const getClientTimestamp = (): number => {
  if (typeof window === 'undefined') {
    return 0; // Return 0 for server-side rendering
  }
  return Date.now();
};

// Utility function to generate unique ID only on client side
const generateUniqueId = (): string => {
  if (typeof window === 'undefined') {
    return 'temp-id'; // Return temporary ID for server-side rendering
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file' // File upload
  | 'rich-text' // Rich text editor
  | 'date' // Date picker
  | 'time' // Time picker
  | 'datetime' // Date and time picker
  | 'signature' // Signature field
  | 'rating' // Star rating
  | 'slider' // Range slider
  | 'phone' // Phone number
  | 'url' // URL field
  | 'color' // Color picker
  | 'toggle' // Toggle switch
  | 'divider' // Visual divider
  | 'html' // Custom HTML
  | 'multi-select' // Multi-select dropdown
  | 'tags' // Tags input
  | 'autocomplete' // Autocomplete field
  | 'accordion' // Accordion field
  | 'grid' // Grid layout
  | 'columns' // Column layout
  | 'section' // Section divider
  | 'group' // Field group
  | 'code' // Code editor
  | 'image' // Image upload
  | 'other'; // Other file types

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select and radio fields
}

export interface FormData {
  fields: Field[];
  version: string;
  name?: string;
  description?: string;
  createdAt: string;
}

export interface AutoSaveData {
  formData: FormData;
  timestamp: number;
  version: number;
}

interface AddCommandData {
  field: Field;
  index: number;
}

interface RemoveCommandData {
  field: Field;
  index: number;
}

interface UpdateCommandData {
  id: string;
  oldField: Field;
  updates: Partial<Field>;
  index: number;
}

interface ReorderCommandData {
  fromIndex: number;
  toIndex: number;
  oldFields: Field[];
}

interface ClearCommandData {
  oldFields: Field[];
}

interface LoadTemplateCommandData {
  oldFields: Field[];
  template: FormTemplate;
}

type CommandData =
  | AddCommandData
  | RemoveCommandData
  | UpdateCommandData
  | ReorderCommandData
  | ClearCommandData
  | LoadTemplateCommandData;

interface Command {
  type: 'add' | 'remove' | 'update' | 'reorder' | 'clear' | 'load-template';
  data: CommandData;
  timestamp: number;
}

export interface FormState {
  fields: Field[];
  selectedFieldId: string | null;
  isPreviewMode: boolean;
  history: Command[];
  historyIndex: number;
  lastSaved: number | null;
  isDirty: boolean;
  autoSaveEnabled: boolean;
  addField: (field: Field) => void;
  updateField: (id: string, updates: Partial<Field>) => void;
  removeField: (id: string) => void;
  reorderFields: (fromIndex: number, toIndex: number) => void;
  setSelectedField: (id: string | null) => void;
  togglePreviewMode: () => void;
  exportForm: () => FormData;
  importForm: (formData: FormData) => void;
  loadTemplate: (template: FormTemplate) => void;
  clearForm: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveForm: () => void;
  getAutoSaveData: () => AutoSaveData | null;
  loadAutoSaveData: (autoSaveData: AutoSaveData) => void;
  toggleAutoSave: () => void;
}

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      fields: [],
      selectedFieldId: null,
      isPreviewMode: false,
      history: [],
      historyIndex: -1,
      lastSaved: null,
      isDirty: false,
      autoSaveEnabled: true,

      addField: field => {
        const state = get();
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push({
          type: 'add',
          data: { field, index: state.fields.length },
          timestamp: getClientTimestamp(),
        });

        set(state => ({
          fields: [...state.fields, field],
          selectedFieldId: field.id,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          isDirty: true,
        }));
      },

      updateField: (id, updates) => {
        const state = get();
        const fieldIndex = state.fields.findIndex(f => f.id === id);
        if (fieldIndex === -1) return;

        const oldField = state.fields[fieldIndex];
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push({
          type: 'update',
          data: { id, oldField, updates, index: fieldIndex },
          timestamp: getClientTimestamp(),
        });

        set(state => ({
          fields: state.fields.map(field =>
            field.id === id ? { ...field, ...updates } : field
          ),
          history: newHistory,
          historyIndex: newHistory.length - 1,
          isDirty: true,
        }));
      },

      removeField: id => {
        const state = get();
        const fieldIndex = state.fields.findIndex(f => f.id === id);
        if (fieldIndex === -1) return;

        const removedField = state.fields[fieldIndex];
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push({
          type: 'remove',
          data: { field: removedField, index: fieldIndex },
          timestamp: getClientTimestamp(),
        });

        set(state => ({
          fields: state.fields.filter(field => field.id !== id),
          selectedFieldId:
            state.selectedFieldId === id ? null : state.selectedFieldId,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          isDirty: true,
        }));
      },

      reorderFields: (fromIndex, toIndex) => {
        const state = get();
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push({
          type: 'reorder',
          data: { fromIndex, toIndex, oldFields: [...state.fields] },
          timestamp: getClientTimestamp(),
        });

        set(state => {
          const newFields = [...state.fields];
          const [movedField] = newFields.splice(fromIndex, 1);
          newFields.splice(toIndex, 0, movedField);
          return {
            fields: newFields,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            isDirty: true,
          };
        });
      },

      setSelectedField: id => set({ selectedFieldId: id }),

      togglePreviewMode: () =>
        set(state => ({
          isPreviewMode: !state.isPreviewMode,
          selectedFieldId: null,
        })),

      exportForm: () => {
        const state = get();
        const formData: FormData = {
          fields: state.fields,
          version: '1.0.0',
          name: 'My Form',
          description: 'Form created with FormKit',
          createdAt: new Date().toISOString(),
        };
        return formData;
      },

      importForm: (formData: FormData) => {
        const state = get();
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push({
          type: 'clear',
          data: { oldFields: [...state.fields] },
          timestamp: getClientTimestamp(),
        });

        set({
          fields: formData.fields,
          selectedFieldId: null,
          isPreviewMode: false,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          isDirty: true,
        });
      },

      loadTemplate: (template: FormTemplate) => {
        const state = get();
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push({
          type: 'load-template',
          data: { oldFields: [...state.fields], template },
          timestamp: getClientTimestamp(),
        });

        set({
          fields: template.formData.fields,
          selectedFieldId: null,
          isPreviewMode: false,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          isDirty: true,
        });
      },

      clearForm: () => {
        const state = get();
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push({
          type: 'clear',
          data: { oldFields: [...state.fields] },
          timestamp: getClientTimestamp(),
        });

        set({
          fields: [],
          selectedFieldId: null,
          isPreviewMode: false,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          isDirty: true,
        });
      },

      saveForm: () => {
        const state = get();
        const formData = state.exportForm();
        const autoSaveData: AutoSaveData = {
          formData,
          timestamp: Date.now(),
          version: 1,
        };

        // Save to localStorage
        localStorage.setItem('formkit-autosave', JSON.stringify(autoSaveData));

        set({
          lastSaved: Date.now(),
          isDirty: false,
        });
      },

      getAutoSaveData: () => {
        try {
          const saved = localStorage.getItem('formkit-autosave');
          if (saved) {
            return JSON.parse(saved) as AutoSaveData;
          }
        } catch (error) {
          console.error('Failed to load auto-save data:', error);
        }
        return null;
      },

      loadAutoSaveData: (autoSaveData: AutoSaveData) => {
        const state = get();
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push({
          type: 'clear',
          data: { oldFields: [...state.fields] },
          timestamp: getClientTimestamp(),
        });

        set({
          fields: autoSaveData.formData.fields,
          selectedFieldId: null,
          isPreviewMode: false,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          lastSaved: autoSaveData.timestamp,
          isDirty: false,
        });
      },

      toggleAutoSave: () =>
        set(state => ({
          autoSaveEnabled: !state.autoSaveEnabled,
        })),

      undo: () => {
        const state = get();
        if (!state.canUndo()) return;

        const command = state.history[state.historyIndex];
        const newHistoryIndex = state.historyIndex - 1;

        switch (command.type) {
          case 'add': {
            const data = command.data as AddCommandData;
            set(state => ({
              fields: state.fields.filter((_, index) => index !== data.index),
              selectedFieldId:
                state.selectedFieldId === data.field.id
                  ? null
                  : state.selectedFieldId,
              historyIndex: newHistoryIndex,
              isDirty: true,
            }));
            break;
          }
          case 'remove': {
            const data = command.data as RemoveCommandData;
            set(state => {
              const newFields = [...state.fields];
              newFields.splice(data.index, 0, data.field);
              return {
                fields: newFields,
                historyIndex: newHistoryIndex,
                isDirty: true,
              };
            });
            break;
          }
          case 'update': {
            const data = command.data as UpdateCommandData;
            set(state => ({
              fields: state.fields.map((field, index) =>
                index === data.index ? data.oldField : field
              ),
              historyIndex: newHistoryIndex,
              isDirty: true,
            }));
            break;
          }
          case 'reorder': {
            const data = command.data as ReorderCommandData;
            set({
              fields: data.oldFields,
              historyIndex: newHistoryIndex,
              isDirty: true,
            });
            break;
          }
          case 'clear': {
            const data = command.data as ClearCommandData;
            set({
              fields: data.oldFields,
              historyIndex: newHistoryIndex,
              isDirty: true,
            });
            break;
          }
          case 'load-template': {
            const data = command.data as LoadTemplateCommandData;
            set({
              fields: data.oldFields,
              historyIndex: newHistoryIndex,
              isDirty: true,
            });
            break;
          }
        }
      },

      redo: () => {
        const state = get();
        if (!state.canRedo()) return;

        const command = state.history[state.historyIndex + 1];
        const newHistoryIndex = state.historyIndex + 1;

        switch (command.type) {
          case 'add': {
            const data = command.data as AddCommandData;
            set(state => ({
              fields: [...state.fields, data.field],
              selectedFieldId: data.field.id,
              historyIndex: newHistoryIndex,
              isDirty: true,
            }));
            break;
          }
          case 'remove': {
            const data = command.data as RemoveCommandData;
            set(state => ({
              fields: state.fields.filter(field => field.id !== data.field.id),
              selectedFieldId:
                state.selectedFieldId === data.field.id
                  ? null
                  : state.selectedFieldId,
              historyIndex: newHistoryIndex,
              isDirty: true,
            }));
            break;
          }
          case 'update': {
            const data = command.data as UpdateCommandData;
            set(state => ({
              fields: state.fields.map(field =>
                field.id === data.id ? { ...field, ...data.updates } : field
              ),
              historyIndex: newHistoryIndex,
              isDirty: true,
            }));
            break;
          }
          case 'reorder': {
            const data = command.data as ReorderCommandData;
            set(state => {
              const newFields = [...state.fields];
              const [movedField] = newFields.splice(data.fromIndex, 1);
              newFields.splice(data.toIndex, 0, movedField);
              return {
                fields: newFields,
                historyIndex: newHistoryIndex,
                isDirty: true,
              };
            });
            break;
          }
          case 'clear':
            set({
              fields: [],
              selectedFieldId: null,
              isPreviewMode: false,
              historyIndex: newHistoryIndex,
              isDirty: true,
            });
            break;
          case 'load-template': {
            const data = command.data as LoadTemplateCommandData;
            set({
              fields: data.template.formData.fields,
              selectedFieldId: null,
              isPreviewMode: false,
              historyIndex: newHistoryIndex,
              isDirty: true,
            });
            break;
          }
        }
      },

      canUndo: () => {
        const state = get();
        return state.historyIndex >= 0;
      },

      canRedo: () => {
        const state = get();
        return state.historyIndex < state.history.length - 1;
      },
    }),
    {
      name: 'form-builder-storage',
      partialize: state => ({
        fields: state.fields,
        history: state.history,
        historyIndex: state.historyIndex,
        lastSaved: state.lastSaved,
        autoSaveEnabled: state.autoSaveEnabled,
      }),
    }
  )
);

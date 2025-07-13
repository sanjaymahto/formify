import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FormTemplate } from './templates';

// Utility function to get timestamp 
const getClientTimestamp = (): number => {
  if (typeof window === 'undefined') {
    return 0; // Return 0 for server-side rendering
  }
  return Date.now();
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
  
  // Advanced field properties
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string; // Regex pattern
    customValidation?: string; // Custom validation function
  };
  
  // File upload specific properties
  fileConfig?: {
    maxSize?: number; // MB
    multiple?: boolean;
    accept?: string; // File types
    maxFiles?: number;
    minFiles?: number;
  };
  
  // Date/time specific properties
  dateConfig?: {
    format?: string;
    minDate?: string;
    maxDate?: string;
    defaultDate?: string;
    timezone?: string;
  };
  
  // Rating specific properties
  ratingConfig?: {
    minRating?: number;
    maxRating?: number;
    allowHalf?: boolean;
    showLabels?: boolean;
    labels?: string[];
  };
  
  // Slider specific properties
  sliderConfig?: {
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number;
    showValue?: boolean;
    showMarks?: boolean;
    marks?: { value: number; label: string }[];
  };
  
  // Signature specific properties
  signatureConfig?: {
    width?: number;
    height?: number;
    penColor?: string;
    backgroundColor?: string;
    lineWidth?: number;
  };
  
  // Text input specific properties
  textConfig?: {
    autoFocus?: boolean;
    spellCheck?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
  };
  
  // Layout and styling properties
  layout?: {
    width?: string; // CSS width (e.g., '100%', '200px')
    height?: string; // CSS height
    margin?: string; // CSS margin
    padding?: string; // CSS padding
    display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid';
    flexDirection?: 'row' | 'column';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    gridTemplateColumns?: string;
    gridGap?: string;
  };
  
  // Conditional logic properties
  conditional?: {
    showIf?: {
      fieldId?: string;
      operator?: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';
      value?: string | number | boolean;
    };
    hideIf?: {
      fieldId?: string;
      operator?: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';
      value?: string | number | boolean;
    };
  };
  
  // Advanced properties
  advanced?: {
    helpText?: string;
    errorMessage?: string;
    hidden?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    defaultValue?: string | number | boolean;
    description?: string;
    tooltip?: string;
    dataAttributes?: Record<string, string>;
    customValidation?: string;
    onChange?: string; // Custom onChange handler
    onBlur?: string; // Custom onBlur handler
    onFocus?: string; // Custom onFocus handler
  };
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

// Conditional logic evaluation function
const evaluateCondition = (condition: any, formData: Record<string, any>): boolean => {
  if (!condition?.fieldId || !condition?.operator || condition?.value === undefined) {
    return true; // No condition = always show
  }
  
  const fieldValue = formData[condition.fieldId];
  
  switch (condition.operator) {
    case 'equals':
      return fieldValue === condition.value;
    case 'not_equals':
      return fieldValue !== condition.value;
    case 'contains':
      return String(fieldValue).includes(String(condition.value));
    case 'not_contains':
      return !String(fieldValue).includes(String(condition.value));
    case 'greater_than':
      return Number(fieldValue) > Number(condition.value);
    case 'less_than':
      return Number(fieldValue) < Number(condition.value);
    default:
      return true;
  }
};

// Check if a field should be visible based on conditional logic
const shouldShowField = (field: Field, formData: Record<string, any>): boolean => {
  if (field.conditional?.showIf) {
    return evaluateCondition(field.conditional.showIf, formData);
  }
  if (field.conditional?.hideIf) {
    return !evaluateCondition(field.conditional.hideIf, formData);
  }
  return true;
};

export interface FormState {
  fields: Field[];
  formTitle: string;
  selectedFieldId: string | null;
  isPreviewMode: boolean;
  history: Command[];
  historyIndex: number;
  lastSaved: number | null;
  isDirty: boolean;
  autoSaveEnabled: boolean;
  formData: Record<string, any>; // Track current form values for conditional logic
  addField: (field: Field) => void;
  updateField: (id: string, updates: Partial<Field>) => void;
  removeField: (id: string) => void;
  reorderFields: (fromIndex: number, toIndex: number) => void;
  setSelectedField: (id: string | null) => void;
  setFormTitle: (title: string) => void;
  togglePreviewMode: () => void;
  updateFormData: (fieldId: string, value: any) => void; // Update form data for conditional logic
  shouldShowField: (field: Field) => boolean; // Check if field should be visible
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
      formTitle: 'Untitled Form',
      selectedFieldId: null,
      isPreviewMode: false,
      history: [],
      historyIndex: -1,
      lastSaved: null,
      isDirty: false,
      autoSaveEnabled: true,
      formData: {}, // Initialize empty form data

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

      setFormTitle: (title: string) => {
        const currentState = get();
        const newHistory = currentState.history.slice(0, currentState.historyIndex + 1);
        newHistory.push({
          type: 'update',
          data: { 
            id: 'form-title', 
            oldField: { id: 'form-title', type: 'text', label: currentState.formTitle, required: false },
            updates: { label: title },
            index: -1 
          },
          timestamp: getClientTimestamp(),
        });

        set(() => ({
          formTitle: title,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          isDirty: true,
        }));
      },

      togglePreviewMode: () =>
        set(state => ({
          isPreviewMode: !state.isPreviewMode,
          selectedFieldId: null,
        })),

      updateFormData: (fieldId: string, value: any) => {
        set(state => ({
          formData: {
            ...state.formData,
            [fieldId]: value,
          },
        }));
      },

      shouldShowField: (field: Field) => {
        const state = get();
        return shouldShowField(field, state.formData);
      },

      exportForm: () => {
        const state = get();
        const formData: FormData = {
          fields: state.fields,
          version: '1.0.0',
          name: state.formTitle,
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
          formTitle: formData.name || 'Untitled Form',
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
          formTitle: template.formData.name || template.name,
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
          formTitle: 'Untitled Form',
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
          formTitle: autoSaveData.formData.name || 'Untitled Form',
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

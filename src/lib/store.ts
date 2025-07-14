import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FormTemplate } from './templates';
import { v4 as uuidv4 } from 'uuid';

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
  | 'date' // Date picker
  | 'time' // Time picker
  | 'datetime' // Date and time picker
  | 'rating' // Star rating
  | 'slider' // Range slider
  | 'phone' // Phone number
  | 'url' // URL field
  | 'color' // Color picker
  | 'toggle' // Toggle switch
  | 'divider' // Visual divider
  | 'multi-select' // Multi-select dropdown
  | 'tags' // Tags input
  | 'grid' // Grid table with editable columns
  | 'code' // Code editor
  | 'image' // Image upload
  | 'submit' // Submit button
  | 'other'; // Other file types

export type GridColumnType =
  | 'text'
  | 'number'
  | 'date'
  | 'time'
  | 'datetime'
  | 'email'
  | 'phone'
  | 'url'
  | 'select'
  | 'checkbox';

export interface GridColumn {
  id: string;
  name: string;
  type: GridColumnType;
  required?: boolean;
  placeholder?: string;
  options?: string[]; // For select type columns
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface GridRow {
  id: string;
  data: Record<string, any>;
}

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
    justifyContent?:
      | 'flex-start'
      | 'center'
      | 'flex-end'
      | 'space-between'
      | 'space-around';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    gridTemplateColumns?: string;
    gridGap?: string;
  };

  // Conditional logic properties
  conditional?: {
    showIf?: {
      fieldId?: string;
      operator?:
        | 'equals'
        | 'not_equals'
        | 'contains'
        | 'not_contains'
        | 'greater_than'
        | 'less_than';
      value?: string | number | boolean;
    };
    hideIf?: {
      fieldId?: string;
      operator?:
        | 'equals'
        | 'not_equals'
        | 'contains'
        | 'not_contains'
        | 'greater_than'
        | 'less_than';
      value?: string | number | boolean;
    };
  };

  // Grid specific properties
  gridConfig?: {
    columns: GridColumn[];
    rows: GridRow[];
    allowAddRows?: boolean;
    allowDeleteRows?: boolean;
    maxRows?: number;
    minRows?: number;
  };

  // Code specific properties
  codeConfig?: {
    language?: string;
    theme?: string;
    lineNumbers?: boolean;
    autoComplete?: boolean;
    syntaxHighlighting?: boolean;
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

export interface SavedForm {
  id: string;
  formData: FormData;
  timestamp: number;
  version: number;
  name: string;
  isAutoSave?: boolean;
}

export interface AutoSaveData {
  formData: FormData;
  timestamp: number;
  version: number;
}

export interface FormSession {
  currentFormId: string | null;
  forms: Record<string, SavedForm>;
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
const evaluateCondition = (
  condition: any,
  formData: Record<string, any>
): boolean => {
  if (
    !condition?.fieldId ||
    !condition?.operator ||
    condition?.value === undefined || condition?.value === null
  ) {
    return true; // No condition = always show
  }

  const fieldValue = formData[condition.fieldId];

  switch (condition.operator) {
    case 'equals':
      return fieldValue === condition.value;
    case 'not_equals':
      return fieldValue !== condition.value;
    case 'contains':
      return String(fieldValue || '').includes(String(condition.value));
    case 'not_contains':
      return !String(fieldValue || '').includes(String(condition.value));
    case 'greater_than':
      return Number(fieldValue || 0) > Number(condition.value);
    case 'less_than':
      return Number(fieldValue || 0) < Number(condition.value);
    default:
      return true;
  }
};

// Check if a field should be visible based on conditional logic
const shouldShowField = (
  field: Field,
  formData: Record<string, any>
): boolean => {
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
  isLoadingForm: boolean; // Flag to prevent auto-save during form loading
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
  // Unified form management
  createNewForm: () => string;
  startNewForm: () => string;
  getCurrentFormId: () => string | null;
  saveForm: (name?: string) => void;
  saveFormAs: (name: string) => string;
  getSavedForms: () => SavedForm[];
  loadSavedForm: (savedForm: SavedForm) => void;
  deleteSavedForm: (id: string) => void;
  getAutoSaveData: () => SavedForm | null;
  loadAutoSaveData: (autoSaveData: SavedForm) => void;
  toggleAutoSave: () => void;
  clearCurrentForm: () => void;
  clearHistory: () => void;
  getSessionForms: () => Record<string, SavedForm>;
  limitFormsToMax: (forms: Record<string, SavedForm>, maxCount?: number) => Record<string, SavedForm>;
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
      isLoadingForm: false, // Initialize loading flag
      formData: {}, // Initialize empty form data

      addField: field => {
        const state = get();
        const newHistory = state.history.slice(0, state.historyIndex + 1);

        // Ensure submit buttons are always at the end
        let insertIndex = state.fields.length;
        if (field.type === 'submit') {
          // Submit buttons always go at the end
          insertIndex = state.fields.length;
        } else {
          // Other fields go before any existing submit buttons
          const submitButtonIndex = state.fields.findIndex(
            f => f.type === 'submit'
          );
          insertIndex =
            submitButtonIndex !== -1 ? submitButtonIndex : state.fields.length;
        }

        newHistory.push({
          type: 'add',
          data: { field, index: insertIndex },
          timestamp: getClientTimestamp(),
        });

        set(state => {
          const newFields = [...state.fields];
          newFields.splice(insertIndex, 0, field);

          return {
            fields: newFields,
            selectedFieldId: null, // Don't automatically select the newly added field
            history: newHistory,
            historyIndex: newHistory.length - 1,
            isDirty: true,
          };
        });
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
          const movedField = newFields[fromIndex];

          // Don't allow reordering submit buttons
          if (movedField.type === 'submit') {
            return state;
          }

          // Find the last non-submit field index
          const submitButtonIndex = newFields.findIndex(
            f => f.type === 'submit'
          );
          const lastNonSubmitIndex =
            submitButtonIndex !== -1
              ? submitButtonIndex - 1
              : newFields.length - 1;

          // Adjust toIndex to not go beyond submit buttons
          const adjustedToIndex = Math.min(toIndex, lastNonSubmitIndex);

          // Remove the field from its original position
          newFields.splice(fromIndex, 1);

          // Insert it at the adjusted position
          newFields.splice(adjustedToIndex, 0, movedField);

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
        const newHistory = currentState.history.slice(
          0,
          currentState.historyIndex + 1
        );
        newHistory.push({
          type: 'update',
          data: {
            id: 'form-title',
            oldField: {
              id: 'form-title',
              type: 'text',
              label: currentState.formTitle,
              required: false,
            },
            updates: { label: title },
            index: -1,
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
        // Only apply conditional logic in preview mode
        if (!state.isPreviewMode) {
          return true; // Always show fields in builder mode
        }
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
        
        // Set loading flag to prevent auto-save during import
        set({ isLoadingForm: true });
        
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
          isLoadingForm: false, // Clear loading flag after import is complete
        });
      },

      loadTemplate: (template: FormTemplate) => {
        const state = get();
        
        // Set loading flag to prevent auto-save during template loading
        set({ isLoadingForm: true });
        
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
          isLoadingForm: false, // Clear loading flag after template is loaded
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

      createNewForm: () => {
        const state = get();
        const formId = uuidv4();
        
        // Clear current form and set new ID
        set({
          fields: [],
          formTitle: 'Untitled Form',
          selectedFieldId: null,
          isPreviewMode: false,
          history: [],
          historyIndex: -1,
          lastSaved: null,
          isDirty: false,
        });

        // Save current form ID to session
        const session: FormSession = {
          currentFormId: formId,
          forms: state.getSessionForms(), // Preserve existing forms
        };
        localStorage.setItem('formkit-session', JSON.stringify(session));

        return formId;
      },

      getCurrentFormId: () => {
        try {
          const session = localStorage.getItem('formkit-session');
          if (session) {
            const parsedSession: FormSession = JSON.parse(session);
            return parsedSession.currentFormId;
          }
        } catch (error) {
          console.error('Failed to get current form ID:', error);
        }
        return null;
      },

      saveForm: (name?: string) => {
        const state = get();
        const currentFormId = state.getCurrentFormId();
        
        if (!currentFormId) {
          // If no current form ID, create a new one without clearing the current form
          const newFormId = uuidv4();
          
          // Create session with new form ID but preserve current form state
          const session: FormSession = {
            currentFormId: newFormId,
            forms: {},
          };
          localStorage.setItem('formkit-session', JSON.stringify(session));
          
          // Continue with the save process using the new form ID
          const formData = state.exportForm();
          
          // Get current session forms (should be empty for first save)
          const currentForms = state.getSessionForms();
          let allForms;
          const newCurrentFormId = newFormId;

          if (name) {
            // Manual save - create new form entry with unique ID
            const newSavedForm: SavedForm = {
              id: newFormId,
              formData,
              timestamp: Date.now(),
              version: 1,
              name: name || 'Untitled Form',
              isAutoSave: false,
            };
            allForms = { ...currentForms, [newFormId]: newSavedForm };
          } else {
            // Auto-save - update existing form
            const savedForm: SavedForm = {
              id: newFormId,
              formData,
              timestamp: Date.now(),
              version: 1,
              name: state.formTitle || 'Untitled Form',
              isAutoSave: true,
            };
            allForms = { ...currentForms, [newFormId]: savedForm };
          }
          
          // Limit to 10 forms by removing the oldest ones
          const limitedForms = state.limitFormsToMax(allForms, 10);
          
          // Update session with limited forms
          const finalSession: FormSession = {
            currentFormId: newCurrentFormId,
            forms: limitedForms,
          };
          
          console.log('Store: Saving session with forms:', Object.keys(limitedForms).length);
          console.log('Store: Form IDs:', Object.keys(limitedForms));
          
          localStorage.setItem('formkit-session', JSON.stringify(finalSession));

          set({
            lastSaved: Date.now(),
            isDirty: false,
          });
          
          return;
        }

        const formData = state.exportForm();
        
        // Get current session forms
        const currentForms = state.getSessionForms();
        let allForms;
        let newCurrentFormId = currentFormId;

        if (name) {
          // Manual save - create new form entry with unique ID
          const newFormId = uuidv4();
          const newSavedForm: SavedForm = {
            id: newFormId,
            formData,
            timestamp: Date.now(),
            version: 1,
            name: name || 'Untitled Form',
            isAutoSave: false,
          };
          allForms = { ...currentForms, [newFormId]: newSavedForm };
          newCurrentFormId = newFormId; // Set current form to the newly saved one
        } else {
          // Auto-save - update existing form
          const savedForm: SavedForm = {
            id: currentFormId,
            formData,
            timestamp: Date.now(),
            version: 1,
            name: state.formTitle || 'Untitled Form',
            isAutoSave: true,
          };
          allForms = { ...currentForms, [currentFormId]: savedForm };
        }
        
        // Limit to 10 forms by removing the oldest ones
        const limitedForms = state.limitFormsToMax(allForms, 10);
        
        // Update session with limited forms
        const session: FormSession = {
          currentFormId: newCurrentFormId,
          forms: limitedForms,
        };
        
        console.log('Store: Saving session with forms:', Object.keys(limitedForms).length);
        console.log('Store: Form IDs:', Object.keys(limitedForms));
        
        localStorage.setItem('formkit-session', JSON.stringify(session));

        set({
          lastSaved: Date.now(),
          isDirty: false,
        });
      },

      saveFormAs: (name: string) => {
        const state = get();
        const formData = state.exportForm();
        const savedForm: SavedForm = {
          id: uuidv4(),
          formData,
          timestamp: Date.now(),
          version: 1,
          name: name || 'Untitled Form',
          isAutoSave: false,
        };

        // Get current session forms
        const currentForms = state.getSessionForms();
        const allForms = { ...currentForms, [savedForm.id]: savedForm };
        
        // Limit to 10 forms by removing the oldest ones
        const limitedForms = state.limitFormsToMax(allForms, 10);
        
        // Update session with limited forms and set current form to the newly saved one
        const session: FormSession = {
          currentFormId: savedForm.id,
          forms: limitedForms,
        };
        
        localStorage.setItem('formkit-session', JSON.stringify(session));

        set({
          lastSaved: Date.now(),
          isDirty: false,
        });

        return savedForm.id;
      },

      getSessionForms: () => {
        try {
          const session = localStorage.getItem('formkit-session');
          console.log('Store: Raw session data:', session);
          if (session) {
            const parsedSession: FormSession = JSON.parse(session);
            console.log('Store: Parsed session:', parsedSession);
            console.log('Store: Number of forms:', Object.keys(parsedSession.forms || {}).length);
            return parsedSession.forms || {};
          }
        } catch (error) {
          console.error('Failed to load session forms:', error);
        }
        return {};
      },

      getSavedForms: () => {
        const forms = get().getSessionForms();
        const savedForms = Object.values(forms);
        console.log('Store: getSavedForms returning:', savedForms);
        return savedForms;
      },

      loadSavedForm: (savedForm: SavedForm) => {
        const state = get();
        
        // Set loading flag to prevent auto-save during loading
        set({ isLoadingForm: true });
        
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push({
          type: 'clear',
          data: { oldFields: [...state.fields] },
          timestamp: getClientTimestamp(),
        });

        // Update session with current form ID
        const session: FormSession = {
          currentFormId: savedForm.id,
          forms: state.getSessionForms(),
        };
        localStorage.setItem('formkit-session', JSON.stringify(session));

        set({
          fields: savedForm.formData.fields,
          formTitle: savedForm.formData.name || savedForm.name,
          selectedFieldId: null,
          isPreviewMode: false,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          lastSaved: savedForm.timestamp,
          isDirty: false,
          isLoadingForm: false, // Clear loading flag after form is loaded
        });
      },

      deleteSavedForm: (id: string) => {
        const state = get();
        const forms = state.getSessionForms();
        delete forms[id];

        // Update session
        const session: FormSession = {
          currentFormId: state.getCurrentFormId(),
          forms,
        };
        localStorage.setItem('formkit-session', JSON.stringify(session));
      },

      getAutoSaveData: () => {
        const state = get();
        const currentFormId = state.getCurrentFormId();
        if (!currentFormId) return null;

        const forms = state.getSessionForms();
        const currentForm = forms[currentFormId];
        
        if (currentForm && currentForm.isAutoSave) {
          return currentForm;
        }
        return null;
      },

      loadAutoSaveData: (autoSaveData: SavedForm) => {
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

      limitFormsToMax: (forms: Record<string, SavedForm>, maxCount: number = 10) => {
        const formEntries = Object.entries(forms);
        if (formEntries.length <= maxCount) {
          return forms;
        }
        
        // Sort by timestamp (oldest first) and keep only the newest ones
        const sortedForms = formEntries
          .sort(([, a], [, b]) => a.timestamp - b.timestamp)
          .slice(-maxCount); // Keep only the newest forms
        
        return Object.fromEntries(sortedForms);
      },

      clearCurrentForm: () => {
        const state = get();
        // Clear session
        localStorage.removeItem('formkit-session');
        
        set({
          fields: [],
          formTitle: 'Untitled Form',
          selectedFieldId: null,
          isPreviewMode: false,
          history: [],
          historyIndex: -1,
          lastSaved: null,
          isDirty: false,
        });
      },

      // Create a new form while preserving the current one in storage
      startNewForm: () => {
        const state = get();
        const currentFormId = state.getCurrentFormId();
        
        // If there's a current form with changes, auto-save it first
        if (currentFormId && state.isDirty && state.fields.length > 0) {
          state.saveForm(); // Auto-save current form
        }
        
        // Create new form with unique ID
        const newFormId = uuidv4();
        
        // Clear current form state
        set({
          fields: [],
          formTitle: 'Untitled Form',
          selectedFieldId: null,
          isPreviewMode: false,
          history: [],
          historyIndex: -1,
          lastSaved: null,
          isDirty: false,
        });

        // Update session with new form ID but preserve existing forms
        const currentForms = state.getSessionForms();
        const session: FormSession = {
          currentFormId: newFormId,
          forms: currentForms, // Preserve existing forms
        };
        localStorage.setItem('formkit-session', JSON.stringify(session));

        return newFormId;
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

      clearHistory: () => {
        set({
          history: [],
          historyIndex: -1,
        });
      },
    }),
    {
      name: 'form-builder-storage',
      partialize: state => ({
        fields: state.fields,
        lastSaved: state.lastSaved,
        autoSaveEnabled: state.autoSaveEnabled,
      }),
    }
  )
);

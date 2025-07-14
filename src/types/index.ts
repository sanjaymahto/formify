// Field Types
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'date'
  | 'time'
  | 'datetime'
  | 'rating'
  | 'slider'
  | 'phone'
  | 'url'
  | 'color'
  | 'toggle'
  | 'divider'
  | 'multi-select'
  | 'tags'
  | 'grid'
  | 'code'
  | 'image'
  | 'submit'
  | 'other';

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

// Grid Types
export interface GridColumn {
  id: string;
  name: string;
  type: GridColumnType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
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
  data: Record<string, string | number | boolean>;
}

// Field Configuration Types
export interface FieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customValidation?: string;
}

export interface FileConfig {
  maxSize?: number;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  minFiles?: number;
}

export interface DateConfig {
  format?: string;
  minDate?: string;
  maxDate?: string;
  defaultDate?: string;
  timezone?: string;
}

export interface RatingConfig {
  minRating?: number;
  maxRating?: number;
  allowHalf?: boolean;
  showLabels?: boolean;
  labels?: string[];
}

export interface SliderConfig {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  showValue?: boolean;
  showMarks?: boolean;
  marks?: { value: number; label: string }[];
}

export interface SignatureConfig {
  width?: number;
  height?: number;
  penColor?: string;
  backgroundColor?: string;
  lineWidth?: number;
}

export interface TextConfig {
  autoFocus?: boolean;
  spellCheck?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

export interface FieldLayout {
  width?: string;
  height?: string;
  margin?: string;
  padding?: string;
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
}

export interface ConditionalLogic {
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
}

export interface GridConfig {
  columns: GridColumn[];
  rows: GridRow[];
  allowAddRows?: boolean;
  allowDeleteRows?: boolean;
  maxRows?: number;
  minRows?: number;
  showHeaders?: boolean;
  showRowNumbers?: boolean;
  allowSorting?: boolean;
  allowFiltering?: boolean;
  exportOptions?: {
    allowExport?: boolean;
    formats?: ('csv' | 'excel' | 'pdf')[];
  };
}

export interface CodeConfig {
  language?: string;
  theme?: string;
  lineNumbers?: boolean;
  autoComplete?: boolean;
  syntaxHighlighting?: boolean;
}

export interface AdvancedFieldProps {
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
  onChange?: string;
  onBlur?: string;
  onFocus?: string;
}

// Main Field Interface
export interface Field {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: FieldValidation;
  fileConfig?: FileConfig;
  dateConfig?: DateConfig;
  ratingConfig?: RatingConfig;
  sliderConfig?: SliderConfig;
  signatureConfig?: SignatureConfig;
  textConfig?: TextConfig;
  layout?: FieldLayout;
  conditional?: ConditionalLogic;
  gridConfig?: GridConfig;
  codeConfig?: CodeConfig;
  advanced?: AdvancedFieldProps;
}

// Form Types
export interface FormData {
  fields: Field[];
  version: string;
  name?: string;
  description?: string;
  createdAt: string;
  coverImage?: string | null;
  logoImage?: string | null;
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

// Command Types (for undo/redo functionality)
export interface AddCommandData {
  field: Field;
  index: number;
}

export interface RemoveCommandData {
  field: Field;
  index: number;
}

export interface UpdateCommandData {
  id: string;
  oldField: Field;
  updates: Partial<Field>;
  index: number;
}

export interface ReorderCommandData {
  fromIndex: number;
  toIndex: number;
  oldFields: Field[];
}

export interface ClearCommandData {
  oldFields: Field[];
}

export interface LoadTemplateCommandData {
  oldFields: Field[];
  template: FormTemplate;
}

export type CommandData =
  | AddCommandData
  | RemoveCommandData
  | UpdateCommandData
  | ReorderCommandData
  | ClearCommandData
  | LoadTemplateCommandData;

export interface Command {
  type: 'add' | 'remove' | 'update' | 'reorder' | 'clear' | 'load-template';
  data: CommandData;
  timestamp: number;
}

// Form State Types
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
  isLoadingForm: boolean;
  formData: Record<string, string | number | boolean | string[]>;
  coverImage?: string | null;
  logoImage?: string | null;
  setCoverImage: (image: string | null) => void;
  setLogoImage: (image: string | null) => void;
  addField: (field: Field) => void;
  updateField: (id: string, updates: Partial<Field>) => void;
  removeField: (id: string) => void;
  reorderFields: (fromIndex: number, toIndex: number) => void;
  setSelectedField: (id: string | null) => void;
  setFormTitle: (title: string) => void;
  togglePreviewMode: () => void;
  updateFormData: (fieldId: string, value: string | number | boolean | string[]) => void;
  shouldShowField: (field: Field) => boolean;
  exportForm: () => FormData;
  importForm: (formData: FormData) => void;
  loadTemplate: (template: FormTemplate) => void;
  clearForm: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
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

// Template Types
export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  formData: FormData;
}

// Settings Types
export type Theme = 'light' | 'dark' | 'auto';
export type ColorPalette = 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'red' | 'teal' | 'indigo' | 'yellow';
export type FontSize = 'small' | 'medium' | 'large';

export interface Settings {
  theme: Theme;
  colorPalette: ColorPalette;
  fontSize: FontSize;
  highContrast: boolean;
}

// Component Props Types
export interface FieldRendererProps {
  field: Field;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDragStart: (fieldId: string) => void;
  onDragOver: (e: React.DragEvent, fieldId?: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, fieldId?: string) => void;
  isDragOver: boolean;
  isDragging: boolean;
}

export interface PropertyPanelProps {
  field: Field | null;
}

export interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Color Configuration Types
export interface ColorConfig {
  border: string;
  bg: string;
  focus: string;
  hover: string;
  cssColor: string;
}

export interface ColorPaletteConfig {
  [key: string]: ColorConfig;
}

// Field Category Types
export interface FieldCategory {
  name: string;
  fields: FieldDefinition[];
}

export interface FieldDefinition {
  type: FieldType;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Shortcut Types
export interface Shortcut {
  key: string;
  description: string;
}

export interface ShortcutCategory {
  category: string;
  icon: React.ReactNode;
  shortcuts: Shortcut[];
}

// Font Size Configuration
export interface FontSizeConfig {
  value: FontSize;
  label: string;
  description: string;
}

// Theme Configuration
export interface ThemeConfig {
  value: Theme;
  label: string;
  icon: React.ReactNode;
}

// Color Palette Configuration
export interface ColorPaletteConfigItem {
  value: ColorPalette;
  label: string;
  preview: string;
}

// Component Types
export * from './components'; 
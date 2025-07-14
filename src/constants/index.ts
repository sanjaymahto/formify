
import {
  Type,
  Mail,
  Lock,
  Hash,
  FileText,
  Phone,
  Globe,
  List,
  CircleDot,
  CheckSquare,
  Tags,
  ToggleLeft,
  Star,
  Sliders,
  Palette,
  Calendar,
  Clock,
  Upload,
  Image,
  Minus,
  Grid3X3,
  Send,
  Code,
  Sun,
  Moon,
  Monitor,
  Eye,
  Keyboard,
  Edit3,
  User,
} from 'lucide-react';
import { FieldType, ColorPalette, Theme, FontSize } from '@/types';

// Field Categories
export const FIELD_CATEGORIES = [
  {
    name: 'Basic Fields',
    fields: [
      { type: 'text' as FieldType, label: 'Text Input', icon: Type },
      { type: 'email' as FieldType, label: 'Email', icon: Mail },
      { type: 'password' as FieldType, label: 'Password', icon: Lock },
      { type: 'number' as FieldType, label: 'Number', icon: Hash },
      { type: 'textarea' as FieldType, label: 'Text Area', icon: FileText },
      { type: 'phone' as FieldType, label: 'Phone', icon: Phone },
      { type: 'url' as FieldType, label: 'URL', icon: Globe },
    ],
  },
  {
    name: 'Selection Fields',
    fields: [
      { type: 'select' as FieldType, label: 'Dropdown', icon: List },
      { type: 'radio' as FieldType, label: 'Radio Buttons', icon: CircleDot },
      { type: 'checkbox' as FieldType, label: 'Checkbox', icon: CheckSquare },
      { type: 'multi-select' as FieldType, label: 'Multi-Select', icon: Tags },
      { type: 'toggle' as FieldType, label: 'Toggle', icon: ToggleLeft },
      { type: 'rating' as FieldType, label: 'Rating', icon: Star },
      { type: 'slider' as FieldType, label: 'Slider', icon: Sliders },
      { type: 'color' as FieldType, label: 'Color Picker', icon: Palette },
    ],
  },
  {
    name: 'Date & Time',
    fields: [
      { type: 'date' as FieldType, label: 'Date Picker', icon: Calendar },
      { type: 'time' as FieldType, label: 'Time Picker', icon: Clock },
      { type: 'datetime' as FieldType, label: 'Date & Time', icon: Calendar },
    ],
  },
  {
    name: 'File Upload',
    fields: [
      { type: 'file' as FieldType, label: 'File Upload', icon: Upload },
      { type: 'image' as FieldType, label: 'Image Upload', icon: Image },
      { type: 'avatar' as FieldType, label: 'Avatar Upload', icon: User },
    ],
  },
  {
    name: 'Layout & Structure',
    fields: [
      { type: 'divider' as FieldType, label: 'Divider', icon: Minus },
      { type: 'grid' as FieldType, label: 'Grid Table', icon: Grid3X3 },
      { type: 'submit' as FieldType, label: 'Submit Button', icon: Send },
    ],
  },
  {
    name: 'Complex Fields',
    fields: [{ type: 'code' as FieldType, label: 'Code Editor', icon: Code }],
  },
];

// Default Field Labels
export const DEFAULT_FIELD_LABELS: Record<FieldType, string> = {
  text: 'Text Input',
  email: 'Email Address',
  password: 'Password',
  number: 'Number Input',
  textarea: 'Text Area',
  select: 'Dropdown Select',
  radio: 'Radio Buttons',
  checkbox: 'Checkbox',
  file: 'File Upload',
  date: 'Date Picker',
  time: 'Time Picker',
  datetime: 'Date & Time Picker',
  rating: 'Rating',
  slider: 'Slider',
  phone: 'Phone Number',
  url: 'Website URL',
  color: 'Color Picker',
  toggle: 'Toggle Switch',
  divider: 'Divider',
  'multi-select': 'Multi-Select',
  tags: 'Tags Input',
  grid: 'Grid Table',
  code: 'Code Editor',
  image: 'Image Upload',
  avatar: 'Avatar Upload',
  submit: 'Submit',
  other: 'Other Field',
};

// Default Field Placeholders
export const DEFAULT_FIELD_PLACEHOLDERS: Record<FieldType, string> = {
  text: 'Enter text...',
  email: 'Enter email address...',
  password: 'Enter password...',
  number: 'Enter number...',
  textarea: 'Enter your message...',
  select: 'Select an option...',
  radio: '',
  checkbox: '',
  file: 'Choose file...',
  date: 'Select date...',
  time: 'Select time...',
  datetime: 'Select date and time...',
  rating: '',
  slider: '',
  phone: 'Enter phone number...',
  url: 'Enter website URL...',
  color: '',
  toggle: '',
  divider: '',
  'multi-select': 'Select options...',
  tags: 'Add tags...',
  grid: '',
  code: 'Enter code...',
  image: 'Choose image...',
  avatar: 'Upload avatar...',
  submit: '',
  other: 'Enter value...',
};

// Color Palette Configurations
export const COLOR_PALETTES = [
  { value: 'default' as ColorPalette, label: 'Default', preview: '#000000' },
  { value: 'blue' as ColorPalette, label: 'Ocean Blue', preview: '#3b82f6' },
  { value: 'green' as ColorPalette, label: 'Forest Green', preview: '#10b981' },
  { value: 'purple' as ColorPalette, label: 'Royal Purple', preview: '#8b5cf6' },
  { value: 'orange' as ColorPalette, label: 'Sunset Orange', preview: '#f97316' },
  { value: 'pink' as ColorPalette, label: 'Rose Pink', preview: '#ec4899' },
  { value: 'red' as ColorPalette, label: 'Crimson Red', preview: '#ef4444' },
  { value: 'teal' as ColorPalette, label: 'Teal', preview: '#14b8a6' },
  { value: 'indigo' as ColorPalette, label: 'Indigo', preview: '#6366f1' },
  { value: 'yellow' as ColorPalette, label: 'Golden Yellow', preview: '#eab308' },
];

// Color Configurations
export const COLOR_CONFIGS = {
  default: {
    border: 'border-blue-500',
    bg: 'bg-blue-500',
    focus: 'focus:ring-blue-500/20',
    hover: 'hover:border-blue-500/50',
    cssColor: '#3b82f6',
  },
  blue: {
    border: 'border-blue-500',
    bg: 'bg-blue-500',
    focus: 'focus:ring-blue-500/20',
    hover: 'hover:border-blue-500/50',
    cssColor: '#3b82f6',
  },
  green: {
    border: 'border-green-500',
    bg: 'bg-green-500',
    focus: 'focus:ring-green-500/20',
    hover: 'hover:border-green-500/50',
    cssColor: '#10b981',
  },
  purple: {
    border: 'border-purple-500',
    bg: 'bg-purple-500',
    focus: 'focus:ring-purple-500/20',
    hover: 'hover:border-purple-500/50',
    cssColor: '#8b5cf6',
  },
  orange: {
    border: 'border-orange-500',
    bg: 'bg-orange-500',
    focus: 'focus:ring-orange-500/20',
    hover: 'hover:border-orange-500/50',
    cssColor: '#f97316',
  },
  pink: {
    border: 'border-pink-500',
    bg: 'bg-pink-500',
    focus: 'focus:ring-pink-500/20',
    hover: 'hover:border-pink-500/50',
    cssColor: '#ec4899',
  },
  red: {
    border: 'border-red-500',
    bg: 'bg-red-500',
    focus: 'focus:ring-red-500/20',
    hover: 'hover:border-red-500/50',
    cssColor: '#ef4444',
  },
  teal: {
    border: 'border-teal-500',
    bg: 'bg-teal-500',
    focus: 'focus:ring-teal-500/20',
    hover: 'hover:border-teal-500/50',
    cssColor: '#14b8a6',
  },
  indigo: {
    border: 'border-indigo-500',
    bg: 'bg-indigo-500',
    focus: 'focus:ring-indigo-500/20',
    hover: 'hover:border-indigo-500/50',
    cssColor: '#6366f1',
  },
  yellow: {
    border: 'border-yellow-500',
    bg: 'bg-yellow-500',
    focus: 'focus:ring-yellow-500/20',
    hover: 'hover:border-yellow-500/50',
    cssColor: '#eab308',
  },
};

// Font Size Configurations
export const FONT_SIZES = [
  {
    value: 'small' as FontSize,
    label: 'Small',
    description: 'Compact text for dense layouts',
  },
  {
    value: 'medium' as FontSize,
    label: 'Medium',
    description: 'Standard size for most users',
  },
  { 
    value: 'large' as FontSize, 
    label: 'Large', 
    description: 'Enhanced readability' 
  },
];

// Theme Configurations
export const THEMES = [
  { value: 'light' as Theme, label: 'Light', icon: Sun },
  { value: 'dark' as Theme, label: 'Dark', icon: Moon },
  { value: 'auto' as Theme, label: 'Auto', icon: Monitor },
];

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = [
  {
    category: 'Canvas Mode (Form Builder)',
    icon: Edit3,
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
    icon: Eye,
    shortcuts: [
      { key: 'Tab', description: 'Navigate between form inputs' },
      { key: 'Enter', description: 'Submit form (if submit button focused)' },
      { key: 'Escape', description: 'Exit preview mode' },
    ]
  },
  {
    category: 'Global Shortcuts',
    icon: Keyboard,
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
    icon: Sun,
    shortcuts: [
      { key: 'Ctrl+T', description: 'Toggle theme (light/dark)' },
    ]
  }
];

// Template Categories
export const TEMPLATE_CATEGORIES = [
  'Business',
  'Research',
  'Education',
  'Healthcare',
  'Finance',
  'Technology',
  'Marketing',
  'Customer Service',
  'Human Resources',
  'Legal',
  'Real Estate',
  'Travel',
  'Food & Beverage',
  'Entertainment',
  'Sports',
  'Non-Profit',
  'Government',
  'Other',
];

// Form Validation Patterns
export const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

// File Upload Constants
export const FILE_UPLOAD_CONFIG = {
  maxSize: 10, // MB
  acceptedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  acceptedFileTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  maxFiles: 10,
  minFiles: 1,
};

// Grid Configuration Constants
export const GRID_CONFIG = {
  maxColumns: 10,
  minColumns: 1,
  maxRows: 100,
  minRows: 1,
  defaultColumnTypes: ['text', 'number', 'date', 'email', 'select'],
};

// Rating Configuration Constants
export const RATING_CONFIG = {
  minRating: 1,
  maxRating: 10,
  defaultRating: 5,
  allowHalf: true,
  showLabels: true,
};

// Slider Configuration Constants
export const SLIDER_CONFIG = {
  minValue: 0,
  maxValue: 100,
  defaultStep: 1,
  showValue: true,
  showMarks: false,
};

// Code Editor Configuration Constants
export const CODE_EDITOR_CONFIG = {
  supportedLanguages: [
    'javascript',
    'typescript',
    'html',
    'css',
    'json',
    'python',
    'java',
    'cpp',
    'csharp',
    'php',
    'ruby',
    'go',
    'rust',
    'swift',
    'kotlin',
    'scala',
    'r',
    'matlab',
    'sql',
    'yaml',
    'xml',
    'markdown',
  ],
  themes: ['vs', 'vs-dark', 'hc-black'],
  defaultLanguage: 'javascript',
  defaultTheme: 'vs',
};

// Layout Constants
export const LAYOUT_CONFIG = {
  displayOptions: ['block', 'inline', 'inline-block', 'flex', 'grid'],
  flexDirections: ['row', 'column'],
  justifyContentOptions: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
  alignItemsOptions: ['flex-start', 'center', 'flex-end', 'stretch'],
};

// Conditional Logic Operators
export const CONDITIONAL_OPERATORS = [
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'greater_than',
  'less_than',
] as const;

// Form Version
export const FORM_VERSION = '1.0.0';

// Auto-save Configuration
export const AUTO_SAVE_CONFIG = {
  enabled: true,
  interval: 30000, // 30 seconds
  maxAutoSaves: 10,
};

// Session Storage Keys
export const STORAGE_KEYS = {
  formSession: 'form-builder-session',
  settings: 'form-builder-settings',
  autoSave: 'form-builder-auto-save',
  templates: 'form-builder-templates',
};

// Animation Durations
export const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
};

// Z-Index Values
export const Z_INDEX = {
  modal: 50,
  dropdown: 40,
  tooltip: 30,
  header: 20,
  sidebar: 10,
};

// Breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Error Messages
export const ERROR_MESSAGES = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidPhone: 'Please enter a valid phone number',
  invalidUrl: 'Please enter a valid URL',
  invalidNumber: 'Please enter a valid number',
  minLength: (min: number) => `Minimum ${min} characters required`,
  maxLength: (max: number) => `Maximum ${max} characters allowed`,
  minValue: (min: number) => `Value must be at least ${min}`,
  maxValue: (max: number) => `Value must be at most ${max}`,
  fileSize: (size: number) => `File size must be less than ${size}MB`,
  fileType: 'Invalid file type',
  maxFiles: (max: number) => `Maximum ${max} files allowed`,
  minFiles: (min: number) => `Minimum ${min} files required`,
};

// Success Messages
export const SUCCESS_MESSAGES = {
  formSaved: 'Form saved successfully',
  formExported: 'Form exported successfully',
  formImported: 'Form imported successfully',
  fieldAdded: 'Field added successfully',
  fieldUpdated: 'Field updated successfully',
  fieldDeleted: 'Field deleted successfully',
  settingsSaved: 'Settings saved successfully',
};

// Default Form Templates
export const DEFAULT_TEMPLATES = [
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Simple contact form with name, email, and message',
    category: 'Business',
    icon: '📧',
  },
  {
    id: 'registration-form',
    name: 'Registration Form',
    description: 'User registration with password and terms',
    category: 'Business',
    icon: '👤',
  },
  {
    id: 'survey-form',
    name: 'Survey Form',
    description: 'Customer feedback survey with multiple choice questions',
    category: 'Research',
    icon: '📊',
  },
  {
    id: 'job-application',
    name: 'Job Application',
    description: 'Professional job application form',
    category: 'Business',
    icon: '💼',
  },
]; 
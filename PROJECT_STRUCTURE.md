# Form Builder - Project Structure

This document outlines the organized structure of the Form Builder project after refactoring.

## Directory Structure

```
src/
├── app/                    # Next.js app directory
├── components/             # React components organized by feature
│   ├── canvas/            # Canvas component and related files
│   ├── preview/           # Preview and form preview components
│   ├── sidebar/           # Sidebar component
│   ├── property-panel/    # Property panel and config panel
│   ├── keyboard-modal/    # Keyboard shortcuts and modal
│   ├── template-selector/ # Template selection component
│   ├── header/            # Header component
│   ├── settings/          # Settings related components
│   ├── form/              # Form title and saved forms
│   ├── export-import/     # Export/import functionality
│   ├── ui/                # Reusable UI components
│   └── index.ts           # Main component exports
├── types/                 # TypeScript type definitions
│   ├── components/        # Component-specific types
│   └── index.ts           # Main type exports
├── utils/                 # Utility functions
│   ├── field-utils.ts     # Field-related utilities
│   ├── color-utils.ts     # Color palette utilities
│   ├── image-utils.ts     # Image processing utilities
│   ├── dom-utils.ts       # DOM manipulation utilities
│   └── index.ts           # Main utility exports
├── styles/                # CSS styles
│   ├── components/        # Component-specific styles
│   └── index.css          # Main stylesheet
├── lib/                   # Library files (store, settings, etc.)
├── hooks/                 # Custom React hooks
└── constants/             # Application constants
```

## Component Organization

### Canvas (`src/components/canvas/`)

- Main canvas component for form building
- Field rendering and drag-and-drop functionality
- Form layout management

### Preview (`src/components/preview/`)

- Form preview component
- Live form preview functionality
- Form submission handling

### Sidebar (`src/components/sidebar/`)

- Field palette sidebar
- Field categories and search
- Drag-and-drop field sources

### Property Panel (`src/components/property-panel/`)

- Field property configuration
- Field settings and validation
- Advanced field options

### Keyboard Modal (`src/components/keyboard-modal/`)

- Keyboard shortcuts functionality
- Shortcuts modal display
- Global keyboard event handling

### Template Selector (`src/components/template-selector/`)

- Template selection interface
- Template categories and search
- Template loading functionality

### Header (`src/components/header/`)

- Application header
- Navigation and branding
- User interface controls

### Settings (`src/components/settings/`)

- Theme provider
- Settings button
- Settings panel
- Application configuration

### Form (`src/components/form/`)

- Form title component
- Saved forms management
- Form persistence

### Export Import (`src/components/export-import/`)

- Form export functionality
- Form import functionality
- Data serialization

### UI (`src/components/ui/`)

- Reusable UI components
- Button, Input, Select, etc.
- Design system components

## Type Organization

### Component Types (`src/types/components/`)

Each component folder has its own type definitions:

- `canvas.ts` - Canvas component types
- `preview.ts` - Preview component types
- `sidebar.ts` - Sidebar component types
- `property-panel.ts` - Property panel types
- `keyboard-modal.ts` - Keyboard modal types
- `template-selector.ts` - Template selector types
- `header.ts` - Header component types
- `settings.ts` - Settings component types
- `form.ts` - Form component types
- `export-import.ts` - Export/import types

## Utility Organization

### Field Utils (`src/utils/field-utils.ts`)

- Field creation and validation
- Default field configurations
- Field type helpers

### Color Utils (`src/utils/color-utils.ts`)

- Color palette configurations
- Theme color management
- Color scheme utilities

### Image Utils (`src/utils/image-utils.ts`)

- Image compression and processing
- File validation
- Image handling utilities

### DOM Utils (`src/utils/dom-utils.ts`)

- DOM manipulation helpers
- Element positioning
- Viewport utilities

## Style Organization

### Component Styles (`src/styles/components/`)

- `canvas.css` - Canvas component styles
- `sidebar.css` - Sidebar component styles
- `property-panel.css` - Property panel styles
- `preview.css` - Preview component styles

## Benefits of This Structure

1. **Modularity**: Each component is self-contained with its own folder
2. **Scalability**: Easy to add new components and features
3. **Maintainability**: Clear separation of concerns
4. **Reusability**: Utilities and types are organized for reuse
5. **Type Safety**: Component-specific types for better development experience
6. **Style Organization**: CSS is separated by component for better maintainability

## Import Examples

```typescript
// Import components
import { Canvas, Sidebar, PropertyPanel } from '@/components';

// Import types
import { Field, FieldType, CanvasProps } from '@/types';

// Import utilities
import { createField, getDefaultLabel, compressImage } from '@/utils';

// Import styles
import '@/styles/index.css';
```

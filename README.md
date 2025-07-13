## formify - A Visual Form Builder

formify is a visual form builder that allows users to create custom forms by dragging and dropping components, configuring their properties, and instantly previewing the result.

### Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Navigate to `http://localhost:3000` to see the app
5. Click "Start Building" to access the form builder at `/builder`

## Current Implementation

The repository includes a basic foundation with:

### Tech Stack

- **Next.js 15.3** with App Router
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Zustand** for state management
- **React Hook Form** for form handling
- **Lucide React** for icons
- **Comprehensive UI components** (Button, Input, Card, etc.)

### Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page with "Start Building" link
│   └── builder/
│       └── page.tsx        # Form builder interface
├── components/
│   ├── canvas.tsx          # Main form canvas component
│   ├── header.tsx          # Builder header
│   └── ui/                 # Complete UI component library
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── select.tsx
│       └── ... (12 components total)
└── lib/
    └── store.ts            # Zustand store for form state
```

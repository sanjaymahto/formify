import { Field, FieldType } from '../index';

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

export interface CanvasProps {
  // Add any specific props for the Canvas component
}

export interface GhostFieldProps {
  fieldType: string;
} 
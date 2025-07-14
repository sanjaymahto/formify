import { FieldType } from '../index';

export interface SidebarProps {
  className?: string;
}

export interface FieldCategory {
  name: string;
  fields: FieldDefinition[];
}

export interface FieldDefinition {
  type: FieldType;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
} 
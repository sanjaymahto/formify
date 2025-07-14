import { FormTemplate } from '../index';

export interface TemplateSelectorProps {
  className?: string;
  onTemplateSelect?: (template: FormTemplate) => void;
}

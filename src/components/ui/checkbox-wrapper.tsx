import React from 'react';
import { ColorConfig } from '@/utils/color-utils';

interface CheckboxWrapperProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  colors?: ColorConfig;
  disabled?: boolean;
}

export const CheckboxWrapper: React.FC<CheckboxWrapperProps> = ({
  id,
  checked,
  onChange,
  label,
  className = '',
  colors,
  disabled = false,
}) => {
  const baseClasses = 'h-4 w-4 cursor-pointer rounded-md border border-border bg-background transition-colors';
  
  const getCheckboxClasses = () => {
    if (colors) {
      return `${baseClasses} ${
        checked
          ? `${colors.bg} ${colors.border}`
          : 'border-border'
      } ${colors.focus} ${colors.hover}`;
    }
    return baseClasses;
  };

  const getAccentColor = () => {
    if (colors && checked) {
      return colors.cssColor;
    }
    return undefined;
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={getCheckboxClasses()}
        style={{
          accentColor: getAccentColor(),
        }}
      />
      {label && (
        <label htmlFor={id} className="cursor-pointer select-none">
          {label}
        </label>
      )}
    </div>
  );
}; 
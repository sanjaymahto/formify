import { ColorPalette } from '@/types';

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

export const getColorPaletteConfig = (): ColorPaletteConfig => {
  return {
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
};

export const getCheckboxColors = (colorPalette: ColorPalette): ColorConfig => {
  const colors = getColorPaletteConfig();
  return colors[colorPalette] || colors.default;
}; 
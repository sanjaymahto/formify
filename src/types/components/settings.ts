import { Theme, ColorPalette, FontSize } from '../index';

export interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SettingsButtonProps {
  className?: string;
}

export interface AppThemeProviderProps {
  children: React.ReactNode;
}

export interface FontSizeConfig {
  value: FontSize;
  label: string;
  description: string;
}

export interface ThemeConfig {
  value: Theme;
  label: string;
  icon: React.ReactNode;
}

export interface ColorPaletteConfigItem {
  value: ColorPalette;
  label: string;
  preview: string;
}

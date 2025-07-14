import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, ColorPalette, FontSize } from '@/types';

export interface AppSettings {
  theme: Theme;
  colorPalette: ColorPalette;
  fontSize: FontSize;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  animationSpeed: 'slow' | 'normal' | 'fast';
  highContrast: boolean;
  reducedMotion: boolean;
}

interface SettingsState extends AppSettings {
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'light',
  colorPalette: 'default',
  fontSize: 'medium',
  borderRadius: 'medium',
  animationSpeed: 'normal',
  highContrast: false,
  reducedMotion: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      ...defaultSettings,

      updateSettings: newSettings => {
        console.log('Updating settings:', newSettings);
        set(state => ({ ...state, ...newSettings }));
      },

      resetSettings: () => {
        set(defaultSettings);
      },
    }),
    {
      name: 'formify-settings',
    }
  )
);

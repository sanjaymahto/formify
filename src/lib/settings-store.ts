import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ColorPalette =
  | 'default'
  | 'blue'
  | 'green'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'red'
  | 'teal'
  | 'indigo'
  | 'yellow';

export type FontSize = 'small' | 'medium' | 'large';

export type Theme = 'light' | 'dark' | 'auto';

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
    (set, get) => ({
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

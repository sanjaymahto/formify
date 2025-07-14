import { ColorPalette } from '@/types';
import { COLOR_CONFIGS } from '@/constants';

export interface ColorConfig {
  border: string;
  bg: string;
  focus: string;
  hover: string;
  cssColor: string;
}

export const getColorPaletteConfig = (): typeof COLOR_CONFIGS => {
  return COLOR_CONFIGS;
};

export const getCheckboxColors = (colorPalette: ColorPalette): ColorConfig => {
  return COLOR_CONFIGS[colorPalette] || COLOR_CONFIGS.default;
};

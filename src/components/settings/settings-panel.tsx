'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Settings, X, Palette, Type, Sun, RotateCcw, Eye } from 'lucide-react';
import { useSettingsStore } from '@/lib/settings-store';
import { FontSize, Theme } from '@/types';
import { COLOR_PALETTES, FONT_SIZES, THEMES } from '@/constants';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const settings = useSettingsStore();
  const updateSettings = useSettingsStore(state => state.updateSettings);
  const resetSettings = useSettingsStore(state => state.resetSettings);

  // Debug logging
  console.log('Current settings:', settings);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 md:p-4">
      <div className="flex max-h-[95vh] w-full max-w-2xl flex-col rounded-lg bg-background text-foreground shadow-xl md:max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 md:p-6">
          <div className="flex items-center space-x-2 md:space-x-3">
            <Settings className="h-4 w-4 md:h-5 md:w-5" />
            <h2 className="text-lg font-semibold md:text-xl">App Settings</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive md:h-8 md:w-8"
            title="Close settings"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:space-y-6 md:p-6">
          {/* Theme Section */}
          <Card>
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Sun className="h-4 w-4" />
                <span>Theme</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {THEMES.map(theme => (
                  <Button
                    key={theme.value}
                    variant={
                      settings.theme === theme.value ? 'default' : 'outline'
                    }
                    onClick={() =>
                      updateSettings({ theme: theme.value as Theme })
                    }
                    className="flex h-auto cursor-pointer flex-col items-center space-y-2 py-3 transition-transform hover:scale-105 md:py-4"
                  >
                    <theme.icon className="h-4 w-4" />
                    <span className="text-xs">{theme.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Color Palette Section */}
          <Card>
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Palette className="h-4 w-4" />
                <span>Color Palette</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {COLOR_PALETTES.map(palette => (
                  <Button
                    key={palette.value}
                    variant={
                      settings.colorPalette === palette.value
                        ? 'default'
                        : 'outline'
                    }
                    onClick={() =>
                      updateSettings({ colorPalette: palette.value })
                    }
                    className="flex h-auto cursor-pointer flex-col items-center space-y-2 px-2 py-3 transition-transform hover:scale-105"
                  >
                    <div
                      className="h-5 w-5 rounded-full border border-border md:h-6 md:w-6"
                      style={{ backgroundColor: palette.preview }}
                    />
                    <span className="text-center text-xs">{palette.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Typography Section */}
          <Card>
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Type className="h-4 w-4" />
                <span>Typography</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select
                  value={settings.fontSize}
                  onValueChange={value =>
                    updateSettings({ fontSize: value as FontSize })
                  }
                >
                  <SelectTrigger className="h-10 md:h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_SIZES.map(size => (
                      <SelectItem key={size.value} value={size.value}>
                        <div>
                          <div className="font-medium">{size.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {size.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Section */}
          <Card>
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Eye className="h-4 w-4" />
                <span>Accessibility</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1 flex-1 pr-4">
                  <Label htmlFor="highContrast">High Contrast</Label>
                  <p className="text-xs text-muted-foreground">
                    Increase contrast for better visibility
                  </p>
                </div>
                <Switch
                  id="highContrast"
                  checked={settings.highContrast}
                  onChange={e => {
                    console.log(
                      'High Contrast Switch clicked:',
                      e.target.checked
                    );
                    updateSettings({ highContrast: e.target.checked });
                  }}
                  className="flex-shrink-0"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex flex-col space-y-3 border-t border-border p-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:p-6">
          <Button
            variant="outline"
            onClick={resetSettings}
            className="flex items-center justify-center space-x-2 w-full md:w-auto"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset to Defaults</span>
          </Button>
          <Button onClick={onClose} className="w-full md:w-auto">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

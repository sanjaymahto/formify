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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-background text-foreground shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center space-x-3">
            <Settings className="h-5 w-5" />
            <h2 className="text-xl font-semibold">App Settings</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Theme Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Sun className="h-4 w-4" />
                <span>Theme</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {THEMES.map(theme => (
                  <Button
                    key={theme.value}
                    variant={
                      settings.theme === theme.value ? 'default' : 'outline'
                    }
                    onClick={() =>
                      updateSettings({ theme: theme.value as Theme })
                    }
                    className="flex h-auto cursor-pointer flex-col items-center space-y-2 py-4 transition-transform hover:scale-105"
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
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Palette className="h-4 w-4" />
                <span>Color Palette</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-5 gap-3">
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
                      className="h-6 w-6 rounded-full border border-border"
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
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Type className="h-4 w-4" />
                <span>Typography</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select
                  value={settings.fontSize}
                  onValueChange={value =>
                    updateSettings({ fontSize: value as FontSize })
                  }
                >
                  <SelectTrigger>
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
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Eye className="h-4 w-4" />
                <span>Accessibility</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
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
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border p-6">
          <Button
            variant="outline"
            onClick={resetSettings}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset to Defaults</span>
          </Button>
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
}

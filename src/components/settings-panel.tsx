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
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  X,
  Palette,
  Type,
  Sun,
  Moon,
  Monitor,
  RotateCcw,
  Eye,
  Circle,
} from 'lucide-react';
import {
  useSettingsStore,
  ColorPalette,
  FontSize,
  Theme,
} from '@/lib/settings-store';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const colorPalettes: { value: ColorPalette; label: string; preview: string }[] =
  [
    { value: 'default', label: 'Default', preview: '#000000' },
    { value: 'blue', label: 'Ocean Blue', preview: '#3b82f6' },
    { value: 'green', label: 'Forest Green', preview: '#10b981' },
    { value: 'purple', label: 'Royal Purple', preview: '#8b5cf6' },
    { value: 'orange', label: 'Sunset Orange', preview: '#f97316' },
    { value: 'pink', label: 'Rose Pink', preview: '#ec4899' },
    { value: 'red', label: 'Crimson Red', preview: '#ef4444' },
    { value: 'teal', label: 'Teal', preview: '#14b8a6' },
    { value: 'indigo', label: 'Indigo', preview: '#6366f1' },
    { value: 'yellow', label: 'Golden Yellow', preview: '#eab308' },
  ];

const fontSizes: { value: FontSize; label: string; description: string }[] = [
  {
    value: 'small',
    label: 'Small',
    description: 'Compact text for dense layouts',
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Standard size for most users',
  },
  { value: 'large', label: 'Large', description: 'Enhanced readability' },
];

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
  { value: 'auto', label: 'Auto', icon: <Monitor className="h-4 w-4" /> },
];

const borderRadiusOptions: {
  value: string;
  label: string;
  description: string;
}[] = [
  { value: 'none', label: 'None', description: 'Sharp corners' },
  { value: 'small', label: 'Small', description: 'Subtle rounding' },
  { value: 'medium', label: 'Medium', description: 'Standard rounding' },
  { value: 'large', label: 'Large', description: 'Pill-shaped elements' },
];

const animationSpeeds: { value: string; label: string; description: string }[] =
  [
    { value: 'slow', label: 'Slow', description: 'Relaxed pace' },
    { value: 'normal', label: 'Normal', description: 'Standard speed' },
    { value: 'fast', label: 'Fast', description: 'Quick transitions' },
  ];

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
                {themes.map(theme => (
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
                    {theme.icon}
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
                {colorPalettes.map(palette => (
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
                    {fontSizes.map(size => (
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

          {/* Appearance Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Circle className="h-4 w-4" />
                <span>Appearance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="borderRadius">Border Radius</Label>
                <Select
                  value={settings.borderRadius}
                  onValueChange={value =>
                    updateSettings({
                      borderRadius: value as
                        | 'none'
                        | 'small'
                        | 'medium'
                        | 'large',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {borderRadiusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {option.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="animationSpeed">Animation Speed</Label>
                <Select
                  value={settings.animationSpeed}
                  onValueChange={value =>
                    updateSettings({
                      animationSpeed: value as 'slow' | 'normal' | 'fast',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {animationSpeeds.map(speed => (
                      <SelectItem key={speed.value} value={speed.value}>
                        <div>
                          <div className="font-medium">{speed.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {speed.description}
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

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="reducedMotion">Reduced Motion</Label>
                  <p className="text-xs text-muted-foreground">
                    Minimize animations and transitions
                  </p>
                </div>
                <Switch
                  id="reducedMotion"
                  checked={settings.reducedMotion}
                  onChange={e => {
                    console.log(
                      'Reduced Motion Switch clicked:',
                      e.target.checked
                    );
                    updateSettings({ reducedMotion: e.target.checked });
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

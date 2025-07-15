'use client';

import { useState } from 'react';
import { useFormStore } from '@/lib/store';
import { useSettingsStore } from '@/lib/settings-store';
import { formTemplates, templateCategories } from '@/lib/templates';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { FormTemplate } from '@/types';

interface TemplateSelectorProps {
  onClose: () => void;
}

export function TemplateSelector({ onClose }: TemplateSelectorProps) {
  const loadTemplate = useFormStore(state => state.loadTemplate);
  const fields = useFormStore(state => state.fields);
  const { colorPalette } = useSettingsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get button colors based on color palette
  const getButtonColors = () => {
    const colors = {
      default: {
        border: 'border-blue-500',
        bg: 'bg-blue-500',
        text: 'text-white',
        hover: 'hover:bg-blue-600',
        focus: 'focus:ring-blue-500/20',
      },
      blue: {
        border: 'border-blue-500',
        bg: 'bg-blue-500',
        text: 'text-white',
        hover: 'hover:bg-blue-600',
        focus: 'focus:ring-blue-500/20',
      },
      green: {
        border: 'border-green-500',
        bg: 'bg-green-500',
        text: 'text-white',
        hover: 'hover:bg-green-600',
        focus: 'focus:ring-green-500/20',
      },
      purple: {
        border: 'border-purple-500',
        bg: 'bg-purple-500',
        text: 'text-white',
        hover: 'hover:bg-purple-600',
        focus: 'focus:ring-purple-500/20',
      },
      orange: {
        border: 'border-orange-500',
        bg: 'bg-orange-500',
        text: 'text-white',
        hover: 'hover:bg-orange-600',
        focus: 'focus:ring-orange-500/20',
      },
      pink: {
        border: 'border-pink-500',
        bg: 'bg-pink-500',
        text: 'text-white',
        hover: 'hover:bg-pink-600',
        focus: 'focus:ring-pink-500/20',
      },
      red: {
        border: 'border-red-500',
        bg: 'bg-red-500',
        text: 'text-white',
        hover: 'hover:bg-red-600',
        focus: 'focus:ring-red-500/20',
      },
      teal: {
        border: 'border-teal-500',
        bg: 'bg-teal-500',
        text: 'text-white',
        hover: 'hover:bg-teal-600',
        focus: 'focus:ring-teal-500/20',
      },
      indigo: {
        border: 'border-indigo-500',
        bg: 'bg-indigo-500',
        text: 'text-white',
        hover: 'hover:bg-indigo-600',
        focus: 'focus:ring-indigo-500/20',
      },
      yellow: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-500',
        text: 'text-white',
        hover: 'hover:bg-yellow-600',
        focus: 'focus:ring-yellow-500/20',
      },
    };
    return colors[colorPalette] || colors.default;
  };

  const buttonColors = getButtonColors();

  const filteredTemplates = formTemplates.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLoadTemplate = (template: FormTemplate) => {
    if (fields.length > 0) {
      const confirmed = confirm(
        'Loading a template will replace your current form. Are you sure you want to continue?'
      );
      if (!confirmed) return;
    }

    loadTemplate(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 md:p-4">
      <div className="flex max-h-[95vh] w-full max-w-4xl flex-col rounded-lg border border-border bg-background shadow-xl md:max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 md:p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground md:text-xl">
              Choose a Template
            </h2>
            <p className="mt-1 text-xs text-muted-foreground md:text-sm">
              Start with a pre-built form template or create from scratch
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 cursor-pointer p-0 hover:bg-destructive/10 hover:text-destructive close-button sm:h-8 sm:w-8"
            title="Close template selector"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="border-b border-border p-4 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="border-border bg-background pl-10 text-foreground placeholder:text-muted-foreground h-12 sm:h-9"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategory('All')}
                style={{
                  backgroundColor:
                    selectedCategory === 'All'
                      ? buttonColors.bg.replace('bg-', '').includes('blue')
                        ? '#3b82f6'
                        : buttonColors.bg.replace('bg-', '').includes('green')
                          ? '#10b981'
                          : buttonColors.bg
                                .replace('bg-', '')
                                .includes('purple')
                            ? '#8b5cf6'
                            : buttonColors.bg
                                  .replace('bg-', '')
                                  .includes('orange')
                              ? '#f97316'
                              : buttonColors.bg
                                    .replace('bg-', '')
                                    .includes('pink')
                                ? '#ec4899'
                                : buttonColors.bg
                                      .replace('bg-', '')
                                      .includes('red')
                                  ? '#ef4444'
                                  : buttonColors.bg
                                        .replace('bg-', '')
                                        .includes('teal')
                                    ? '#14b8a6'
                                    : buttonColors.bg
                                          .replace('bg-', '')
                                          .includes('indigo')
                                      ? '#6366f1'
                                      : buttonColors.bg
                                            .replace('bg-', '')
                                            .includes('yellow')
                                        ? '#eab308'
                                        : '#3b82f6'
                      : undefined,
                  color:
                    selectedCategory === 'All' ? '#ffffff' : undefined,
                }}
                className={`cursor-pointer h-10 px-3 text-xs md:h-8 md:px-2 md:text-sm ${
                  selectedCategory === 'All'
                    ? `${buttonColors.hover} ${buttonColors.focus}`
                    : 'hover:border-primary'
                }`}
              >
                All
              </Button>
              {templateCategories.map(category => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    backgroundColor:
                      selectedCategory === category
                        ? buttonColors.border
                            .replace('border-', '')
                            .includes('blue')
                          ? '#3b82f6'
                          : buttonColors.border
                                .replace('border-', '')
                                .includes('green')
                            ? '#10b981'
                            : buttonColors.border
                                  .replace('border-', '')
                                  .includes('purple')
                              ? '#8b5cf6'
                              : buttonColors.border
                                    .replace('border-', '')
                                    .includes('orange')
                                ? '#f97316'
                                : buttonColors.border
                                      .replace('border-', '')
                                      .includes('pink')
                                  ? '#ec4899'
                                  : buttonColors.border
                                        .replace('border-', '')
                                        .includes('red')
                                    ? '#ef4444'
                                    : buttonColors.border
                                          .replace('border-', '')
                                          .includes('teal')
                                      ? '#14b8a6'
                                      : buttonColors.border
                                            .replace('border-', '')
                                            .includes('indigo')
                                        ? '#6366f1'
                                        : buttonColors.border
                                              .replace('border-', '')
                                              .includes('yellow')
                                          ? '#eab308'
                                          : '#3b82f6'
                        : undefined,
                    color:
                      selectedCategory === category ? '#ffffff' : undefined,
                  }}
                  className={`cursor-pointer h-10 px-3 text-xs md:h-8 md:px-2 md:text-sm ${
                    selectedCategory === category
                      ? `${buttonColors.hover} ${buttonColors.focus}`
                      : 'hover:border-primary'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
          {filteredTemplates.length === 0 ? (
            <div className="py-8 text-center md:py-12">
              <div className="mb-4 text-muted-foreground">
                <Search className="mx-auto h-8 w-8 md:h-12 md:w-12" />
              </div>
              <h3 className="mb-2 text-base font-medium text-foreground md:text-lg">
                No templates found
              </h3>
              <p className="text-xs text-muted-foreground md:text-sm">
                Try adjusting your search or category filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
              {filteredTemplates.map(template => (
                <Card
                  key={template.id}
                  className="hover:bg-accent/50 cursor-pointer border-border bg-card p-4 transition-all duration-200 hover:border-primary hover:shadow-lg md:p-4"
                  onClick={() => handleLoadTemplate(template)}
                >
                  <div className="flex items-start space-x-3 md:space-x-3">
                    <div className="text-2xl md:text-2xl">{template.icon}</div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 text-base font-medium text-foreground md:text-base">
                        {template.name}
                      </h3>
                      <p className="mb-3 text-sm text-muted-foreground md:text-sm">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground md:px-2 md:py-1">
                          {template.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {template.formData.fields.length} fields
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Desktop only */}
        <div className="hidden md:block bg-muted/50 border-t border-border p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredTemplates.length} template
              {filteredTemplates.length !== 1 ? 's' : ''} available
            </p>
            <Button
              variant="outline"
              onClick={onClose}
              style={{
                borderColor: buttonColors.border
                  .replace('border-', '')
                  .includes('blue')
                  ? '#3b82f6'
                  : buttonColors.border.replace('border-', '').includes('green')
                    ? '#10b981'
                    : buttonColors.border
                          .replace('border-', '')
                          .includes('purple')
                      ? '#8b5cf6'
                      : buttonColors.border
                            .replace('border-', '')
                            .includes('orange')
                        ? '#f97316'
                        : buttonColors.border
                              .replace('border-', '')
                              .includes('pink')
                          ? '#ec4899'
                          : buttonColors.border
                                .replace('border-', '')
                                .includes('red')
                            ? '#ef4444'
                            : buttonColors.border
                                  .replace('border-', '')
                                  .includes('teal')
                              ? '#14b8a6'
                              : buttonColors.border
                                    .replace('border-', '')
                                    .includes('indigo')
                                ? '#6366f1'
                                : buttonColors.border
                                      .replace('border-', '')
                                      .includes('yellow')
                                  ? '#eab308'
                                  : '#3b82f6',
              }}
              className={`cursor-pointer h-9 w-auto text-sm ${buttonColors.focus}`}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = buttonColors.border
                  .replace('border-', '')
                  .includes('blue')
                  ? '#3b82f6'
                  : buttonColors.border.replace('border-', '').includes('green')
                    ? '#10b981'
                    : buttonColors.border
                          .replace('border-', '')
                          .includes('purple')
                      ? '#8b5cf6'
                      : buttonColors.border
                            .replace('border-', '')
                            .includes('orange')
                        ? '#f97316'
                        : buttonColors.border
                              .replace('border-', '')
                              .includes('pink')
                          ? '#ec4899'
                          : buttonColors.border
                                .replace('border-', '')
                                .includes('red')
                            ? '#ef4444'
                            : buttonColors.border
                                  .replace('border-', '')
                                  .includes('teal')
                              ? '#14b8a6'
                              : buttonColors.border
                                    .replace('border-', '')
                                    .includes('indigo')
                                ? '#6366f1'
                                : buttonColors.border
                                      .replace('border-', '')
                                      .includes('yellow')
                                  ? '#eab308'
                                  : '#3b82f6';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.color = '';
              }}
            >
              Start from Scratch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

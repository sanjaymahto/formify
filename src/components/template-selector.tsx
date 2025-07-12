'use client';

import { useState } from 'react';
import { useFormStore } from '@/lib/store';
import {
  formTemplates,
  templateCategories,
  FormTemplate,
} from '@/lib/templates';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface TemplateSelectorProps {
  onClose: () => void;
}

export function TemplateSelector({ onClose }: TemplateSelectorProps) {
  const { loadTemplate, fields } = useFormStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[80vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Choose a Template
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Start with a pre-built form template or create from scratch
            </p>
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

        {/* Search and Filters */}
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'All' ? 'gradient' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('All')}
              >
                All
              </Button>
              {templateCategories.map(category => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? 'gradient' : 'outline'
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-gray-400 dark:text-gray-500">
                <Search className="mx-auto h-12 w-12" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                No templates found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or category filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map(template => (
                <Card
                  key={template.id}
                  className="cursor-pointer border-gray-200 p-4 transition-all duration-200 hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:hover:border-blue-600"
                  onClick={() => handleLoadTemplate(template)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{template.icon}</div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 font-medium text-gray-900 dark:text-gray-100">
                        {template.name}
                      </h3>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                          {template.category}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
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

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredTemplates.length} template
              {filteredTemplates.length !== 1 ? 's' : ''} available
            </p>
            <Button variant="glass" onClick={onClose}>
              Start from Scratch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

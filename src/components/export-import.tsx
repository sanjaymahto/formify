'use client';

import { useFormStore, FormData } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Download, Upload, Trash2 } from 'lucide-react';
import { useRef } from 'react';

export function ExportImportButtons() {
  const { exportForm, importForm, clearForm, fields } = useFormStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const formData = exportForm();
      const jsonString = JSON.stringify(formData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `form-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Show success message
      alert('Form exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export form. Please try again.');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const content = e.target?.result as string;
        const formData: FormData = JSON.parse(content);

        // Validate the imported data
        if (!formData.fields || !Array.isArray(formData.fields)) {
          throw new Error('Invalid form data: missing or invalid fields array');
        }

        // Validate each field
        formData.fields.forEach((field, index) => {
          if (!field.id || !field.type || !field.label) {
            throw new Error(
              `Invalid field at index ${index}: missing required properties`
            );
          }
        });

        importForm(formData);
        alert('Form imported successfully!');
      } catch (error) {
        console.error('Import failed:', error);
        alert('Failed to import form. Please check the file format.');
      }
    };

    reader.onerror = () => {
      alert('Failed to read file. Please try again.');
    };

    reader.readAsText(file);

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    if (fields.length === 0) {
      alert('Form is already empty.');
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to clear the form? This action cannot be undone.'
    );
    if (confirmed) {
      clearForm();
      alert('Form cleared successfully!');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        disabled={fields.length === 0}
        className="flex items-center space-x-2"
      >
        <Download className="h-4 w-4" />
        <span>Export</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center space-x-2"
      >
        <Upload className="h-4 w-4" />
        <span>Import</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleClear}
        disabled={fields.length === 0}
        className="flex items-center space-x-2 text-red-600 hover:bg-red-50 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
        <span>Clear</span>
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
}

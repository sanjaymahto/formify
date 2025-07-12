'use client';

import { useState, useRef, useEffect } from 'react';
import { useFormStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FormTitle() {
  const formTitle = useFormStore(state => state.formTitle);
  const setFormTitle = useFormStore(state => state.setFormTitle);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(formTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(formTitle);
  }, [formTitle]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim()) {
      setFormTitle(editValue.trim());
    } else {
      setFormTitle('Untitled Form');
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(formTitle);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="mb-6 flex items-center gap-2">
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="text-2xl font-bold border-2 border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          placeholder="Enter form title..."
          maxLength={100}
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          className="h-8 w-8 p-0 cursor-pointer"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          className="h-8 w-8 p-0 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-6 flex items-center gap-2 group">
      <h1 className="text-2xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors">
        {formTitle}
      </h1>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <Edit3 className="h-4 w-4" />
      </Button>
    </div>
  );
} 
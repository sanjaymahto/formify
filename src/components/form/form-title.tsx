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
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="focus-visible:ring-primary/20 border-2 border-primary text-2xl font-bold focus-visible:ring-2"
          placeholder="Enter form title..."
          maxLength={100}
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          className="h-8 w-8 cursor-pointer p-0"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          className="h-8 w-8 cursor-pointer p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="group mb-6 flex items-center gap-2">
      <h1 className="cursor-pointer text-2xl font-bold text-foreground transition-colors hover:text-primary">
        {formTitle}
      </h1>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="h-8 w-8 cursor-pointer p-0 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Edit3 className="h-4 w-4" />
      </Button>
    </div>
  );
}

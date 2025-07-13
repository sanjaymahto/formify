'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { SettingsPanel } from './settings-panel';

interface SettingsButtonProps {
  className?: string;
  tooltipText?: string;
}

export function SettingsButton({
  className = '',
  tooltipText = 'Customize app appearance and settings',
}: SettingsButtonProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsSettingsOpen(true)}
        className={`h-10 w-10 cursor-pointer p-0 ${className}`}
        aria-label="Settings"
        title={tooltipText}
      >
        <Settings className="h-5 w-5" />
      </Button>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}

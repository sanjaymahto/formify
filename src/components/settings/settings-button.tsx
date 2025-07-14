'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { SettingsPanel } from '@/components/settings/settings-panel';

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
        variant="outline"
        size="icon"
        onClick={() => setIsSettingsOpen(true)}
        className={`h-8 w-8 cursor-pointer border-2 transition-all duration-200 hover:scale-110 ${className}`}
        aria-label="Settings"
        title={tooltipText}
      >
        <Settings className="h-4 w-4" />
      </Button>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}

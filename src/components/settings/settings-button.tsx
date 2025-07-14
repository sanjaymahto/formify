'use client';

import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { SettingsPanel } from '@/components/settings/settings-panel';
import { useToggle } from '@/hooks/use-common-states';

interface SettingsButtonProps {
  className?: string;
  tooltipText?: string;
}

export function SettingsButton({
  className = '',
  tooltipText = 'Customize app appearance and settings',
}: SettingsButtonProps) {
  const { value: isSettingsOpen, setTrue: openSettings, setFalse: closeSettings } = useToggle(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={openSettings}
        className={`h-10 w-10 cursor-pointer p-0 ${className}`}
        aria-label="Settings"
        title={tooltipText}
      >
        <Settings className="h-5 w-5" />
      </Button>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={closeSettings}
      />
    </>
  );
}

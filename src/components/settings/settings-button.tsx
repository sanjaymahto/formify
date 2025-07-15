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
  const {
    value: isSettingsOpen,
    setTrue: openSettings,
    setFalse: closeSettings,
  } = useToggle(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={openSettings}
        className={`h-8 w-8 cursor-pointer p-0 md:h-10 md:w-10 ${className}`}
        aria-label="Settings"
        title={tooltipText}
      >
        <Settings className="h-4 w-4 md:h-5 md:w-5" />
      </Button>

      <SettingsPanel isOpen={isSettingsOpen} onClose={closeSettings} />
    </>
  );
}

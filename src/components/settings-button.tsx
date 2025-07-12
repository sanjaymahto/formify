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
      <div className="group relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSettingsOpen(true)}
          className={`h-10 w-10 p-0 ${className}`}
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>

        {/* Tooltip */}
        <div className="pointer-events-none absolute right-full top-1/2 z-10 mr-2 -translate-y-1/2 transform whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {tooltipText}
          {/* Tooltip arrow */}
          <div className="absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 translate-x-full transform border-b-4 border-l-4 border-t-4 border-transparent border-l-gray-900"></div>
        </div>
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}

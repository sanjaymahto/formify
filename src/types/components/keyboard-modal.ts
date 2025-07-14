export interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface KeyboardShortcutsProps {
  className?: string;
}

export interface Shortcut {
  key: string;
  description: string;
}

export interface ShortcutCategory {
  category: string;
  icon: React.ReactNode;
  shortcuts: Shortcut[];
}

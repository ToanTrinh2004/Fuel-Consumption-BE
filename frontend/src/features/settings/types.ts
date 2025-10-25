import type { ThemeColor } from '@/shared/types';

export interface SettingsDialogProps {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  isDarkMode: boolean;
  setIsDarkMode: (mode: boolean) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
}

export interface HelpDialogProps {
  isDarkMode: boolean;
}

export interface ThemeOption {
  value: ThemeColor;
  label: string;
  color: string;
}

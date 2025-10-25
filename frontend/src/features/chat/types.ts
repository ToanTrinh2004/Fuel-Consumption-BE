import type { ChatMessage, ThemeColor } from '@/shared/types';

export interface ChatBotProps {
  themeColor: ThemeColor;
  isDarkMode: boolean;
  customColor?: string;
}

export interface ChatHistoryProps {
  messages: ChatMessage[];
  themeColor: ThemeColor;
  isDarkMode: boolean;
  customColor?: string;
  onClear: () => void;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  themeColor: ThemeColor;
  isDarkMode: boolean;
  customColor?: string;
  disabled?: boolean;
}

export interface EmptyStateProps {
  themeColor: ThemeColor;
  isDarkMode: boolean;
  customColor?: string;
  onSuggestedQuestion: (question: string) => void;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  category: 'quick' | 'detailed';
}

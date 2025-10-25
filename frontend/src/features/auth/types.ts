import type { User } from '@/shared/types';

export interface LoginFormProps {
  isDarkMode: boolean;
  onSuccess: (user: User, token: string) => void;
  onSwitchToRegister: () => void;
}

export interface RegisterFormProps {
  isDarkMode: boolean;
  onSuccess: (user: User, token: string) => void;
  onSwitchToLogin: () => void;
}

export interface GoogleAuthResponse {
  credential: string;
}

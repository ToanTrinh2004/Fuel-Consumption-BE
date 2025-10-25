import type { PredictionData, ThemeColor } from '@/shared/types';

export interface FuelConsumptionDashboardProps {
  data: PredictionData;
  themeColor: ThemeColor;
  isDarkMode: boolean;
  customColor: string;
  dashboardHistory?: PredictionData[];
  onCompareMode?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export interface ComparisonDashboardProps {
  themeColor: ThemeColor;
  isDarkMode: boolean;
  customColor?: string;
  dashboardHistory: PredictionData[];
  onBack: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export interface DashboardHistoryProps {
  history: PredictionData[];
  themeColor: ThemeColor;
  isDarkMode: boolean;
  customColor?: string;
  onSelectDashboard: (dashboard: PredictionData) => void;
  onDeleteDashboard?: (index: number) => void;
}

export interface ComparisonData {
  name: string;
  fuel: number;
  efficiency: number;
  speed: number;
  cost: number;
}

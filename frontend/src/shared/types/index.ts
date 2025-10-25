export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

export interface PredictionAnalysis {
  fuelConsumption: number;
  fuelConsumptionTons: number;
  estimatedCost: number;
  efficiency: number;
  avgConsumptionRate: number;
  recommendation: string;
}

export interface VesselInfo {
  type: string;
  speedCalc: number;
  distance: number;
  datetime: string;
  draftAft?: number;
  draftFore?: number;
  averageDraft?: number;
}

export interface PredictionData {
  timestamp: Date;
  query: string;
  analysis: PredictionAnalysis;
  vesselInfo: VesselInfo;
  timeSeriesData?: TimeSeriesDataPoint[];
  comparison?: ComparisonData[];
}

export interface TimeSeriesDataPoint {
  time: string;
  fuel: number;
  speed: number;
}

export interface ComparisonData {
  metric: string;
  current: number;
  optimal: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UserSettings {
  theme: ThemeColor;
  customColor?: string;
  isDarkMode: boolean;
  language: 'vi' | 'en';
}

export type ThemeColor = 
  | 'default' 
  | 'pink' 
  | 'rose' 
  | 'fuchsia' 
  | 'blue' 
  | 'purple'
  | 'indigo'
  | 'sky'
  | 'ocean'
  | 'teal'
  | 'emerald'
  | 'lime'
  | 'amber'
  | 'sunset'
  | 'custom';

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

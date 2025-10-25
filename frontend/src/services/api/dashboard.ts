import apiClient from './client';
import type { PredictionData } from '@/shared/types';

interface DashboardHistoryResponse {
  success: boolean;
  dashboards: PredictionData[];
  total: number;
}

interface SaveDashboardRequest {
  userId: string;
  query: string;
  analysis: PredictionData['analysis'];
  vesselInfo: PredictionData['vesselInfo'];
}

interface SaveDashboardResponse {
  success: boolean;
  dashboardId: string;
}

interface ComparePredictionsRequest {
  userId: string;
  predictionIds: string[];
}

interface AIAnalysis {
  summary: string;
  recommendations: string[];
  bestPrediction: {
    id: string;
    score: number;
    reasoning: string;
  };
  insights: {
    fuelVariation: string;
    efficiencyPattern: string;
    speedOptimization: string;
    costAnalysis: string;
  };
}

interface ComparePredictionsResponse {
  success: boolean;
  aiAnalysis: AIAnalysis;
}

export const dashboardService = {
  async getDashboardHistory(userId: string, limit: number = 100): Promise<PredictionData[]> {
    const response = await apiClient.get<DashboardHistoryResponse>('/dashboard/history', {
      params: { userId, limit },
    });
    return response.data.dashboards;
  },

  async saveDashboard(request: SaveDashboardRequest): Promise<string> {
    const response = await apiClient.post<SaveDashboardResponse>('/dashboard/save', request);
    return response.data.dashboardId;
  },

  async comparePredictions(request: ComparePredictionsRequest): Promise<AIAnalysis> {
    const response = await apiClient.post<ComparePredictionsResponse>('/dashboard/compare', request);
    return response.data.aiAnalysis;
  },

  async deleteDashboard(dashboardId: string): Promise<void> {
    await apiClient.delete(`/dashboard/${dashboardId}`);
  },
};

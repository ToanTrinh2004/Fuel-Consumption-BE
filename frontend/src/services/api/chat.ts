import apiClient from './client';
import type { ChatMessage, PredictionData } from '@/shared/types';

interface SendMessageRequest {
  userId: string;
  message: string;
  features?: {
    vessel_type: string;
    speed_calc: number;
    distance: number;
    datetime: string;
    draft_aft?: number;
    draft_fore?: number;
    average_draft?: number;
  };
}

interface SendMessageResponse {
  success: boolean;
  prediction: PredictionData;
  messageId: string;
}

interface ChatHistoryResponse {
  success: boolean;
  messages: ChatMessage[];
  total: number;
}

export const chatService = {
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await apiClient.post<SendMessageResponse>('/chat/predict', request);
    return response.data;
  },

  async getChatHistory(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    const response = await apiClient.get<ChatHistoryResponse>('/chat/history', {
      params: { userId, limit },
    });
    return response.data.messages;
  },

  async deleteChatHistory(userId: string): Promise<void> {
    await apiClient.delete(`/chat/history/${userId}`);
  },

  async deleteMessage(messageId: string): Promise<void> {
    await apiClient.delete(`/chat/messages/${messageId}`);
  },
};

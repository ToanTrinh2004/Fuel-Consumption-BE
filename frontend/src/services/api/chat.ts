import apiClient from './client';

export interface ConversationMessageDTO {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant';
  content: string;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
}

export interface ConversationDTO {
  id: number;
  title: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  last_message?: ConversationMessageDTO | null;
  messages?: ConversationMessageDTO[] | null;
  message_count?: number;
  first_user_message?: ConversationMessageDTO | null;
}

export interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  conversationId?: string | number;
  messages: ChatCompletionMessage[];
  language?: string;
  context?: ChatCompletionMessage[];
}

export interface ChatCompletionResponse {
  response: string;
  prediction_made: boolean;
  prediction_result?: {
    fuel_consumption?: number;
    parameters?: Record<string, unknown>;
  } | null;
  message?: ConversationMessageDTO | null;
}

interface ConversationsListResponse {
  items: ConversationDTO[];
  total: number;
}

interface MessagesListResponse {
  items: ConversationMessageDTO[];
}

interface DeleteAllResponse {
  deleted: number;
}

export const chatService = {
  async listConversations(): Promise<ConversationDTO[]> {
    const response = await apiClient.get<ConversationsListResponse>('/chat/conversations');
    return response.data.items ?? [];
  },

  async createConversation(title?: string): Promise<ConversationDTO> {
    const response = await apiClient.post<ConversationDTO>('/chat/conversations', {
      title,
    });
    return response.data;
  },

  async getConversation(conversationId: string | number): Promise<ConversationDTO> {
    const response = await apiClient.get<ConversationDTO>(`/chat/conversations/${conversationId}`);
    return response.data;
  },

  async listMessages(conversationId: string | number): Promise<ConversationMessageDTO[]> {
    const response = await apiClient.get<MessagesListResponse>(`/chat/conversations/${conversationId}/messages`);
    return response.data.items ?? [];
  },

  async createMessage(
    conversationId: string | number,
    payload: { role: 'user' | 'assistant'; content: string; metadata?: Record<string, unknown> | null }
  ): Promise<ConversationMessageDTO> {
    const response = await apiClient.post<ConversationMessageDTO>(
      `/chat/conversations/${conversationId}/messages`,
      payload
    );
    return response.data;
  },

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const payload = {
      conversation_id: request.conversationId,
      messages: request.messages,
      language: request.language,
      context: request.context,
    };
    const response = await apiClient.post<ChatCompletionResponse>('/chat/chat', payload);
    return response.data;
  },

  async deleteConversation(conversationId: string | number): Promise<void> {
    await apiClient.delete(`/chat/conversations/${conversationId}`);
  },

  async deleteAllConversations(): Promise<number> {
    const response = await apiClient.delete<DeleteAllResponse>('/chat/conversations');
    return response.data.deleted ?? 0;
  },
};

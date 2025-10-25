import apiClient from './client';
import type { UserSettings } from '@/shared/types';

interface SettingsResponse {
  success: boolean;
  settings: UserSettings;
}

interface UpdateSettingsRequest extends Partial<UserSettings> {}

export const settingsService = {
  async getUserSettings(userId: string): Promise<UserSettings> {
    const response = await apiClient.get<SettingsResponse>(`/settings/${userId}`);
    return response.data.settings;
  },

  async updateUserSettings(userId: string, settings: UpdateSettingsRequest): Promise<UserSettings> {
    const response = await apiClient.put<SettingsResponse>(`/settings/${userId}`, settings);
    return response.data.settings;
  },
};

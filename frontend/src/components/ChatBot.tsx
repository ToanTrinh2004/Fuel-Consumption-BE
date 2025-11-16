import { useState, useEffect, useRef } from 'react';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import FuelConsumptionDashboard from './FuelConsumptionDashboard';
import ComparisonDashboard from './ComparisonDashboard';
import DashboardHistory from './DashboardHistory';
import EmptyState from './EmptyState';
import SettingsDialog from './SettingsDialog';
import HelpDialog from './HelpDialog';
import { Button } from './ui/button';
import { LogOut, BarChart3, Sparkles, Download, Lightbulb, PanelLeftClose, PanelLeft, Sun, Moon, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Conversation, MockMessage } from '../utils/mockData';
import { smartSuggestions } from '../utils/mockData';
import { toast } from 'sonner@2.0.3';
import { Resizable } from 're-resizable';
import { ThemeColor, Language } from '../App';
import fluxmareLogo from 'figma:asset/48159e3c19318e6ee94d6f46a7da4911deba57ae.png';
import { getLogoFilter, getLogoOpacity } from '../utils/logoUtils';
import { t } from '../utils/translations';
import { chatService, ChatCompletionMessage, ConversationDTO, ConversationMessageDTO } from '../services/api/chat';

interface ChatBotProps {
  username: string;
  onLogout: () => void;
  themeColor: ThemeColor;
  isDarkMode: boolean;
  customColor: string;
  language: Language;
  onChangeTheme: (theme: ThemeColor) => void;
  onToggleDarkMode: () => void;
  onChangeCustomColor: (color: string) => void;
  onChangeLanguage: (lang: Language) => void;
}

// Helper function to calculate luminance and get contrast text color
const getContrastColor = (hexColor: string): string => {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  // Calculate relative luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  
  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? '#0a0a0a' : '#ffffff';
};

const normalizeNumber = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

// Helper function for generating mock fuel data
const generateMockFuelData = (features: any = {}) => {
  const speedOverGround = normalizeNumber(features.speedOverGround, 12);
  const windSpeed10M = normalizeNumber(features.windSpeed10M, 10);
  const waveHeight = normalizeNumber(features.waveHeight, 1.5);
  const wavePeriod = normalizeNumber(features.wavePeriod, 8);
  const seaFloorDepth = normalizeNumber(features.seaFloorDepth, 120);
  const temperature2M = normalizeNumber(features.temperature2M, 24);
  const oceanCurrentVelocity = normalizeNumber(features.oceanCurrentVelocity, 1.2);

  const base = 0.15 + (speedOverGround / 100) * 0.05;
  const predictions = [];
  
  for (let i = 0; i < 96; i++) {
    const timeVariation = Math.sin(i / 10) * 0.02;
    const randomness = (Math.random() - 0.5) * 0.01;
    const depthFactor = (seaFloorDepth / 1000) * 0.005;
    const tempFactor = (temperature2M / 30) * 0.003;
    const windFactor = (windSpeed10M / 20) * 0.008;
    const waveFactor = (waveHeight / 5) * 0.006;
    const currentFactor = (oceanCurrentVelocity / 5) * 0.004;
    
    const fuelConsumption = base + timeVariation + randomness + depthFactor + tempFactor + windFactor + waveFactor + currentFactor;
    
    predictions.push({
      timestamp: i,
      time: `${String(Math.floor(i * 15 / 60)).padStart(2, '0')}:${String((i * 15) % 60).padStart(2, '0')}`,
      fuelConsumption: Math.max(0.01, fuelConsumption)
    });
  }
  
  return predictions;
};

type ConversationState = Conversation & { hasLoadedHistory?: boolean };

const mapApiMessageToMock = (message: ConversationMessageDTO): MockMessage => ({
  id: String(message.id),
  type: message.role === 'assistant' ? 'bot' : 'user',
  content: message.content,
  timestamp: message.created_at ? new Date(message.created_at) : new Date(),
  metadata: message.metadata ?? undefined,
});

const mapApiConversationToState = (conversation: ConversationDTO): ConversationState => {
  const messages = conversation.messages
    ? conversation.messages.map(mapApiMessageToMock)
    : conversation.last_message
      ? [mapApiMessageToMock(conversation.last_message)]
      : [];

  const timestamp =
    conversation.updated_at ||
    conversation.created_at ||
    new Date().toISOString();

  return {
    id: String(conversation.id),
    title: conversation.title || 'Cuoc tro chuyen',
    messages,
    timestamp: new Date(timestamp),
    isFavorite: false,
    hasLoadedHistory: Boolean(conversation.messages),
  };
};

const sortConversations = (items: ConversationState[]) =>
  [...items].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

const buildDashboardData = (formData: any, predictionValue?: number) => {
  if (!formData) return null;

  const predictions = generateMockFuelData(formData);
  const stats = {
    average: predictions.reduce((sum, p) => sum + p.fuelConsumption, 0) / predictions.length,
    max: Math.max(...predictions.map(p => p.fuelConsumption)),
    min: Math.min(...predictions.map(p => p.fuelConsumption)),
    total: predictions.reduce((sum, p) => sum + p.fuelConsumption, 0),
  };

  const timeSeriesData = predictions.map(p => ({
    time: p.time,
    consumption: p.fuelConsumption,
    speed: normalizeNumber(formData.speedOverGround, 12),
  }));

  const comparison = [
    { metric: 'Speed', current: normalizeNumber(formData.speedOverGround, 12), optimal: 10 },
    { metric: 'Wave Impact', current: normalizeNumber(formData.waveHeight, 2), optimal: 1.2 },
    { metric: 'Wind Impact', current: normalizeNumber(formData.windSpeed10M, 8), optimal: 6 },
  ];

  const totalKg = predictionValue ?? stats.total * 900;

  return {
    query: formData.query || 'Fluxmare Fuel Insight',
    analysis: {
      fuelConsumption: totalKg,
      fuelConsumptionTons: totalKg / 1000,
      estimatedCost: (totalKg / 1000) * 620,
      efficiency: Math.max(
        0,
        Math.min(
          100,
          100 -
            (normalizeNumber(formData.waveHeight, 2) * 5 +
              normalizeNumber(formData.windSpeed10M, 8) * 2)
        )
      ),
      avgConsumptionRate: stats.average,
      recommendation:
        normalizeNumber(formData.speedOverGround, 12) > 11
          ? 'Giam toc do de toi uu nhien lieu'
          : 'Duy tri toc do hien tai de giu hieu qua',
    },
    vesselInfo: {
      type: formData.vesselType || 'container_1_tier1',
      speedCalc: normalizeNumber(formData.speedOverGround, 12),
      distance: normalizeNumber(formData.speedOverGround, 12) * 24,
      datetime: new Date().toISOString(),
    },
    timeSeriesData,
    comparison,
    timestamp: new Date(),
    inputFeatures: {
      Ship_SpeedOverGround: normalizeNumber(formData.speedOverGround, 12),
      Weather_WindSpeed10M: normalizeNumber(formData.windSpeed10M, 10),
      Weather_WaveHeight: normalizeNumber(formData.waveHeight, 1.5),
      Weather_WavePeriod: normalizeNumber(formData.wavePeriod, 8),
      Environment_SeaFloorDepth: normalizeNumber(formData.seaFloorDepth, 120),
      Weather_Temperature2M: normalizeNumber(formData.temperature2M, 24),
      Weather_OceanCurrentVelocity: normalizeNumber(formData.oceanCurrentVelocity, 1.2),
    },
    prediction: {
      Total_MomentaryFuel: (predictionValue ?? stats.average) / 3600,
    },
  };
};

const buildContextMessages = (formData: any, language: Language): ChatCompletionMessage[] => {
  if (!formData) return [];

  const prefix =
    language === 'vi'
      ? 'Nguoi dung vua cung cap thong tin thong qua form dau vao (JSON):'
      : 'The user provided the following structured form inputs (JSON):';

  return [
    {
      role: 'system',
      content: `${prefix} ${JSON.stringify(formData)}`,
    },
  ];
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object') {
    const payload = error as Record<string, unknown>;
    if (typeof payload.error === 'string') return payload.error;
    if (typeof payload.message === 'string') return payload.message;
  }
  return 'Da co loi xay ra. Vui long thu lai.';
};

export default function ChatBot({ username, onLogout, themeColor, isDarkMode, customColor, language, onChangeTheme, onToggleDarkMode, onChangeCustomColor, onChangeLanguage }: ChatBotProps) {
  const [conversations, setConversations] = useState<ConversationState[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [fuelPredictionData, setFuelPredictionData] = useState<any>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [showDashboardHistory, setShowDashboardHistory] = useState(false);
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [isFullscreenDashboard, setIsFullscreenDashboard] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [loadingConversationId, setLoadingConversationId] = useState<string | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];
  const isInputBusy = isSendingMessage;

  useEffect(() => {
    let ignore = false;

    const fetchConversations = async () => {
      setIsLoadingConversations(true);
      try {
        const items = await chatService.listConversations();
        if (ignore) {
          return;
        }
        const mapped = sortConversations(items.map(mapApiConversationToState));
        setConversations(mapped);
        setActiveConversationId(prev => {
          if (mapped.length === 0) {
            return null;
          }
          return prev ?? mapped[0].id;
        });
      } catch (error) {
        if (!ignore) {
          toast.error('Khong the tai danh sach cuoc tro chuyen', {
            description: getErrorMessage(error),
          });
        }
      } finally {
        if (!ignore) {
          setIsLoadingConversations(false);
        }
      }
    };

    fetchConversations();

    return () => {
      ignore = true;
    };
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const conversationId = activeConversationId;
    if (!conversationId) {
      return;
    }
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation || conversation.hasLoadedHistory || loadingConversationId === conversationId) {
      return;
    }

    let cancelled = false;

    const loadMessages = async () => {
      setLoadingConversationId(conversationId);
      try {
        await refreshConversationMessages(conversationId);
      } catch (error) {
        if (!cancelled) {
          toast.error('Khong the tai tin nhan', {
            description: getErrorMessage(error),
          });
        }
      } finally {
        if (!cancelled) {
          setLoadingConversationId(prev => (prev === conversationId ? null : prev));
        }
      }
    };

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [activeConversationId, conversations, loadingConversationId]);

  const generateBotResponse = (userMessage: string): string => {
    const responses = [
      `Cảm ơn bạn đã hỏi! "${userMessage}"

💡 Để dự đoán Total.MomentaryFuel, vui lòng điền đầy đủ 10 features trong form bên dưới.`,
      `Xin chào! Tôi là Fluxmare chuyên phân tích nhiên liệu tàu thủy.

📊 Hãy nhập 10 features để nhận dự đoán Total.MomentaryFuel (kg/s) cho 96 timestamps!`,
      `Câu hỏi thú vị! "${userMessage}"

🎯 Fluxmare sử dụng benchmark FuelCast với 10 features. Điền form để xem kết quả!`,
      `Tuyệt vời! Tôi rất vui được hỗ trợ.

📋 Nhập 10 features để nhận:
• Total.MomentaryFuel dự đoán
• Phân tích 96 timestamps
• Visualization dashboard`,
      `"${userMessage}" - Câu hỏi hay đấy!

🚢 Dataset CPS Poseidon FuelCast giúp dự đoán fuel consumption chỉ từ GPS + weather data. Thử ngay!`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const refreshConversationMessages = async (conversationId: string) => {
    const latestMessages = await chatService.listMessages(conversationId);
    const mappedMessages = latestMessages.map(mapApiMessageToMock);
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: mappedMessages,
              hasLoadedHistory: true,
              timestamp: mappedMessages.length
                ? mappedMessages[mappedMessages.length - 1].timestamp
                : conv.timestamp,
            }
          : conv
      )
    );
  };

  const handleSendMessage = async (content: string, formData: any) => {
    const trimmedContent = content.trim();
    if (!trimmedContent || isSendingMessage) {
      return;
    }
    setIsSendingMessage(true);
  
    let conversationId = activeConversationId;
    let conversationState = conversations.find(conv => conv.id === conversationId);
    const tempUserId = `temp-${Date.now()}`;
    let tempAssistantId: string | null = null;
  
    try {
      setShowSuggestions(false);
  
      if (!conversationId || !conversationState) {
        const title = trimmedContent.slice(0, 50) || 'New Conversation';
        const created = await chatService.createConversation(title);
        const mappedConversation = mapApiConversationToState(created);
        conversationId = mappedConversation.id;
        conversationState = mappedConversation;
        setActiveConversationId(mappedConversation.id);
        setConversations(prev => {
          const filtered = prev.filter(conv => conv.id !== mappedConversation.id);
          return sortConversations([mappedConversation, ...filtered]);
        });
      }
  
      if (!conversationId || !conversationState) {
        throw new Error('Unable to create a new conversation.');
      }
  
      const tempUserMessage: MockMessage = {
        id: tempUserId,
        type: 'user',
        content: trimmedContent,
        timestamp: new Date(),
      };
  
      // Add user message optimistically
      setConversations(prev => {
        const next = prev.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, tempUserMessage],
                timestamp: new Date(),
                hasLoadedHistory: true,
              }
            : conv
        );
        return sortConversations(next);
      });
  
      const optimisticMessages = [...conversationState.messages, tempUserMessage];
      const payloadMessages: ChatCompletionMessage[] = optimisticMessages.map(msg => ({
        role: msg.type === 'bot' ? 'assistant' : 'user',
        content: msg.content,
      }));
  
      const contextMessages = buildContextMessages(formData, language);
      const chatResponse = await chatService.chat({
        conversationId,
        messages: payloadMessages,
        language,
        context: contextMessages.length ? contextMessages : undefined,
      });
      console.log('Chat response:', chatResponse.response);
  
      const assistantContent = chatResponse.response?.trim() || generateBotResponse(trimmedContent);
      tempAssistantId = `temp-bot-${Date.now()}`;
  
      const assistantMessage: MockMessage = {
        id: tempAssistantId,
        type: 'bot',
        content: assistantContent,
        timestamp: new Date(),
        metadata: chatResponse.prediction_result ?? undefined,
        isFuelPrediction: Boolean(chatResponse.prediction_made && chatResponse.prediction_result),
        dashboardData:
          chatResponse.prediction_made && chatResponse.prediction_result
            ? buildDashboardData(formData, chatResponse.prediction_result.fuel_consumption) || undefined
            : undefined,
      };
  
      if (assistantMessage.dashboardData) {
        setFuelPredictionData(assistantMessage.dashboardData);
        setShowDashboard(true);
        setIsComparisonMode(false);
      }
  
      // Update with assistant's message
      setConversations(prev =>
        sortConversations(
          prev.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, assistantMessage],
                  timestamp: new Date(),
                }
              : conv
          )
        )
      );
  
      // Replace temp message with persisted one if available
      if (chatResponse.message) {
        const persistedAssistantMock = mapApiMessageToMock(chatResponse.message);
        setConversations(prev =>
          sortConversations(
            prev.map(conv =>
              conv.id === conversationId
                ? {
                    ...conv,
                    messages: conv.messages.map(msg =>
                      msg.id === tempAssistantId ? persistedAssistantMock : msg
                    ),
                    timestamp: persistedAssistantMock.timestamp,
                  }
                : conv
            )
          )
        );
      }
    } catch (error) {
      toast.error('Unable to send message', {
        description: getErrorMessage(error),
      });
      // Remove temp messages on error
      if (conversationId) {
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.filter(
                    msg => msg.id !== tempUserId && msg.id !== tempAssistantId
                  ),
                }
              : conv
          )
        );
      }
    } finally {
      setIsSendingMessage(false);
    }
  };
  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setShowDashboard(false);
  };

  const handleNewConversation = async () => {
    try {
      const created = await chatService.createConversation();
      const mapped = mapApiConversationToState(created);
      setConversations(prev => {
        const filtered = prev.filter(conv => conv.id !== mapped.id);
        return sortConversations([mapped, ...filtered]);
      });
      setActiveConversationId(mapped.id);
      setShowDashboard(false);
    } catch (error) {
      toast.error('Khong the tao cuoc tro chuyen moi', {
        description: getErrorMessage(error),
      });
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await chatService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      if (activeConversationId === conversationId) {
        setActiveConversationId(prev => {
          if (prev !== conversationId) {
            return prev;
          }
          const remaining = conversations.filter(conv => conv.id !== conversationId);
          return remaining[0]?.id ?? null;
        });
        setShowDashboard(false);
      }
      toast.success('Da xoa cuoc tro chuyen');
    } catch (error) {
      toast.error('Khong the xoa cuoc tro chuyen', {
        description: getErrorMessage(error),
      });
    }
  };

  const handleClearHistory = async () => {
    if (conversations.length === 0) {
      return;
    }
    try {
      const deleted = await chatService.deleteAllConversations();
      setConversations([]);
      setActiveConversationId(null);
      setFuelPredictionData(null);
      setShowDashboard(false);
      toast.success(
        deleted > 0 ? `Da xoa ${deleted} cuoc tro chuyen` : 'Khong co cuoc tro chuyen de xoa'
      );
    } catch (error) {
      toast.error('Khong the xoa lich su', {
        description: getErrorMessage(error),
      });
    }
  };

  const handleToggleFavorite = (conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, isFavorite: !conv.isFavorite } : conv
    ));
  };


  const handleExportChat = () => {
    if (!activeConversation) return;
    
    const exportText = activeConversation.messages.map(m => 
      `[${m.type.toUpperCase()}] ${m.timestamp.toLocaleString()}:\n${m.content}\n`
    ).join('\n');
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_${activeConversation.id}.txt`;
    a.click();
    toast.success('Đã xuất lịch sử phân tích!');
  };

  const handleToggleDashboard = () => {
    setShowSuggestions(false);
    setShowDashboard(!showDashboard);
  };

  const handleToggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  const handleToggleDashboardHistory = () => {
    setShowDashboardHistory(!showDashboardHistory);
  };

  const handleSelectDashboardFromHistory = (data: any) => {
    setFuelPredictionData(data);
    setShowDashboard(true);
  };

  // Get all dashboards from conversations
  const getDashboardHistory = () => {
    const dashboards: Array<{
      id: string;
      messageId: string;
      title: string;
      timestamp: Date;
      data: any;
    }> = [];

    conversations.forEach(conv => {
      conv.messages.forEach(msg => {
        if (msg.isFuelPrediction && msg.dashboardData) {
          dashboards.push({
            id: `${conv.id}-${msg.id}`,
            messageId: msg.id,
            title: conv.title,
            timestamp: msg.timestamp,
            data: msg.dashboardData
          });
        }
      });
    });

    // Sort by timestamp, newest first
    return dashboards.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  // Helper functions for custom color
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const adjustBrightness = (hex: string, percent: number) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const r = Math.min(255, Math.max(0, Math.round(rgb.r + (255 - rgb.r) * percent)));
    const g = Math.min(255, Math.max(0, Math.round(rgb.g + (255 - rgb.g) * percent)));
    const b = Math.min(255, Math.max(0, Math.round(rgb.b + (255 - rgb.b) * percent)));
    return rgbToHex(r, g, b);
  };

  // Make color lighter for dark mode
  const getLighterColor = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    if (brightness < 128) {
      // If dark, make much lighter
      return adjustBrightness(hex, 0.7);
    }
    return hex;
  };

  // Theme colors configuration
  const getThemeColors = (theme: ThemeColor, dark: boolean) => {
    const themes = {
      default: dark ? {
        bg: 'bg-black',
        bgSecondary: 'bg-[#0a0a0a]',
        text: 'text-[#e5e5e5]',
        accent: 'text-[#e3d5f7]',
        border: 'border-[#e3d5f7]/60',
        primary: 'bg-[#e3d5f7]',
        primaryHover: 'hover:bg-[#d4c5eb]',
        primaryText: 'text-white',
        messageBg: 'bg-[#e3d5f7]',
        messageBotBg: 'bg-[#1a1a1a] border-2 border-gray-500',
      } : {
        bg: 'bg-[#fafafa]',
        bgSecondary: 'bg-white',
        text: 'text-[#1a1a1a]',
        accent: 'text-[#2002a6]',
        border: 'border-[#2002a6]/50',
        primary: 'bg-[#2002a6]',
        primaryHover: 'hover:bg-[#1a0285]',
        primaryText: 'text-[#0a0a0a]',
        messageBg: 'bg-[#2002a6]',
        messageBotBg: 'bg-white border-2 border-gray-200',
      },
      pink: dark ? {
        bg: 'bg-black',
        bgSecondary: 'bg-[#0a0a0a]',
        text: 'text-pink-50',
        accent: 'text-pink-300',
        border: 'border-pink-400/60',
        primary: 'bg-pink-500',
        primaryHover: 'hover:bg-pink-600',
        primaryText: 'text-white',
        messageBg: 'bg-pink-500',
        messageBotBg: 'bg-[#1a1a1a] border-2 border-gray-500',
      } : {
        bg: 'bg-pink-50',
        bgSecondary: 'bg-white',
        text: 'text-pink-950',
        accent: 'text-pink-600',
        border: 'border-pink-300',
        primary: 'bg-pink-500',
        primaryHover: 'hover:bg-pink-600',
        primaryText: 'text-white',
        messageBg: 'bg-pink-500',
        messageBotBg: 'bg-white border-2 border-gray-200',
      },
      blue: dark ? {
        bg: 'bg-black',
        bgSecondary: 'bg-[#0a0a0a]',
        text: 'text-blue-50',
        accent: 'text-blue-300',
        border: 'border-blue-400/60',
        primary: 'bg-blue-500',
        primaryHover: 'hover:bg-blue-600',
        primaryText: 'text-white',
        messageBg: 'bg-blue-500',
        messageBotBg: 'bg-[#1a1a1a] border-2 border-gray-500',
      } : {
        bg: 'bg-blue-50',
        bgSecondary: 'bg-white',
        text: 'text-blue-950',
        accent: 'text-blue-600',
        border: 'border-blue-300',
        primary: 'bg-blue-500',
        primaryHover: 'hover:bg-blue-600',
        primaryText: 'text-white',
        messageBg: 'bg-blue-500',
        messageBotBg: 'bg-white border-2 border-gray-200',
      },
      green: dark ? {
        bg: 'bg-black',
        bgSecondary: 'bg-[#0a0a0a]',
        text: 'text-green-50',
        accent: 'text-green-300',
        border: 'border-green-400/60',
        primary: 'bg-green-500',
        primaryHover: 'hover:bg-green-600',
        primaryText: 'text-white',
        messageBg: 'bg-green-500',
        messageBotBg: 'bg-[#1a1a1a] border-2 border-gray-500',
      } : {
        bg: 'bg-green-50',
        bgSecondary: 'bg-white',
        text: 'text-green-950',
        accent: 'text-green-600',
        border: 'border-green-300',
        primary: 'bg-green-500',
        primaryHover: 'hover:bg-green-600',
        primaryText: 'text-white',
        messageBg: 'bg-green-500',
        messageBotBg: 'bg-white border-2 border-gray-200',
      },
      custom: (() => {
        const lightColor = getLighterColor(customColor);
        const customRgb = hexToRgb(customColor);
        const customBorderColor = customRgb ? `rgba(${customRgb.r}, ${customRgb.g}, ${customRgb.b}, 0.6)` : 'rgba(128, 128, 128, 0.6)';
        const customPrimaryColor = customColor;
        const customPrimaryHover = adjustBrightness(customColor, -0.1);
        
        return dark ? {
          bg: 'bg-black',
          bgSecondary: 'bg-[#0a0a0a]',
          text: 'text-[#e5e5e5]',
          accent: `text-[${lightColor}]`,
          border: 'border-gray-700',
          primary: `bg-[${lightColor}]`,
          primaryHover: `hover:bg-[${adjustBrightness(lightColor, 0.1)}]`,
          primaryText: 'text-white',
          messageBg: `bg-[${lightColor}]`,
          messageBotBg: 'bg-[#1a1a1a] border-2 border-gray-500',
          customBorderColor: customBorderColor,
          customPrimaryColor: lightColor
        } : {
          bg: 'bg-[#fafafa]',
          bgSecondary: 'bg-white',
          text: 'text-[#1a1a1a]',
          accent: `text-[${customColor}]`,
          border: 'border-gray-300',
          primary: `bg-[${customColor}]`,
          primaryHover: `hover:bg-[${customPrimaryHover}]`,
          primaryText: 'text-[#0a0a0a]',
          messageBg: `bg-[${customColor}]`,
          messageBotBg: 'bg-white border-2 border-gray-200',
          customBorderColor: customBorderColor,
          customPrimaryColor: customPrimaryColor
        };
      })()
    };
    
    return themes[theme] || themes.default;
  };

  const colors = getThemeColors(themeColor, isDarkMode);
  const customStyles = themeColor === 'custom' ? {
    '--custom-color': customColor,
    '--custom-color-light': getLighterColor(customColor),
    '--custom-color-dark': adjustBrightness(customColor, -0.2),
  } as React.CSSProperties : {};

  return (
    <div className={`flex h-screen ${colors.bg} overflow-hidden`} style={customStyles}>
      <AnimatePresence>
        {showHistory && !isFullscreenDashboard && (
          <motion.div
            initial={{ x: -288, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -288, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatHistory 
              conversations={conversations}
              activeConversationId={activeConversationId}
              username={username}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
              onClearHistory={handleClearHistory}
              onToggleFavorite={handleToggleFavorite}
              onDeleteConversation={handleDeleteConversation}
              themeColor={themeColor}
              isDarkMode={isDarkMode}
              customColor={customColor}
              isLoading={isLoadingConversations}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        {!isFullscreenDashboard && (
          <header 
            className={`${colors.bgSecondary} border-b-2 ${colors.border} px-3 py-2 flex-shrink-0`}
            style={themeColor === 'custom' ? { borderColor: colors.customBorderColor } : {}}
          >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Button
                onClick={() => setShowHistory(!showHistory)}
                variant="outline"
                size="sm"
                className={`border-2 ${colors.border} ${colors.accent} h-7 w-7 p-0`}
                style={themeColor === 'custom' ? { 
                  borderColor: colors.customBorderColor,
                  color: colors.customPrimaryColor 
                } : {}}
                title={showHistory ? "Ẩn lịch sử" : "Hiện lịch sử"}
              >
                {showHistory ? <PanelLeftClose className="h-3 w-3" /> : <PanelLeft className="h-3 w-3" />}
              </Button>
              <img 
                src={fluxmareLogo} 
                alt="Fluxmare Logo" 
                className="h-7 w-7 object-contain"
                style={{
                  filter: getLogoFilter(isDarkMode, themeColor, customColor),
                  opacity: getLogoOpacity()
                }}
              />
              <div>
                <h1 className={`${colors.text} text-sm`}>Fluxmare</h1>
                <p 
                  className="text-xs" 
                  style={{ 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)' 
                  }}
                >
                  {activeConversation ? activeConversation.title.slice(0, 40) + '...' : `Xin chào, ${username}!`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <HelpDialog themeColor={themeColor} isDarkMode={isDarkMode} />
              <Button
                onClick={handleToggleSuggestions}
                variant="outline"
                size="sm"
                className={`border-2 ${colors.border} ${colors.accent} h-7 w-7 p-0`}
                title="Gợi ý thông minh"
              >
                <Lightbulb className="h-3 w-3" />
              </Button>
              <Button
                onClick={handleToggleDashboardHistory}
                variant="outline"
                size="sm"
                className={`border-2 ${colors.border} ${colors.accent} h-7 w-7 p-0`}
                title="Lịch sử Dashboard"
                style={themeColor === 'custom' ? { 
                  borderColor: colors.customBorderColor,
                  color: colors.customPrimaryColor 
                } : {}}
              >
                <History className="h-3 w-3" />
              </Button>
              {activeConversation && (
                <Button
                  onClick={handleExportChat}
                  variant="outline"
                  size="sm"
                  className={`border-2 ${colors.border} ${colors.accent} h-7 w-7 p-0`}
                  title="Xuất lịch sử"
                >
                  <Download className="h-3 w-3" />
                </Button>
              )}
              {fuelPredictionData && (
                <Button
                  onClick={handleToggleDashboard}
                  size="sm"
                  className={`${colors.primary} ${colors.primaryHover} ${colors.primaryText} text-xs h-7 px-2 shadow-lg`}
                >
                  <BarChart3 className="h-3 w-3 mr-1" />
                  {showDashboard ? (language === 'vi' ? 'Ẩn' : 'Hide') : t('dashboard', language)}
                </Button>
              )}
              <Button
                onClick={onToggleDarkMode}
                variant="outline"
                size="sm"
                className={`border-2 ${colors.border} ${colors.accent} h-7 w-7 p-0`}
                title={t(isDarkMode ? 'lightMode' : 'darkMode', language)}
              >
                {isDarkMode ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
              </Button>
              <SettingsDialog 
                themeColor={themeColor}
                isDarkMode={isDarkMode}
                customColor={customColor}
                language={language}
                onChangeTheme={onChangeTheme}
                onChangeCustomColor={onChangeCustomColor}
                onChangeLanguage={onChangeLanguage}
                onClearHistory={handleClearHistory}
                username={username}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs h-7 px-2"
              >
                <LogOut className="h-3 w-3 mr-1" />
                {t('logout', language)}
              </Button>
            </div>
          </div>
        </header>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-hidden flex relative">
          {!isFullscreenDashboard && (
            showDashboard && fuelPredictionData ? (
              <Resizable
                size={{ width: `${50}%`, height: '100%' }}
                onResizeStop={(e, direction, ref, d) => {
                  // Handle resize if needed
                }}
                minWidth="30%"
                maxWidth="70%"
                enable={{ right: true }}
                className="flex flex-col"
              >
                {/* Chat messages area - SCROLLABLE */}
                <div className={`flex-1 overflow-y-auto p-4 ${colors.bg} relative`}>
                  {/* Smart Suggestions */}
                  <AnimatePresence>
                  {showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-80"
                    >
                      <div className={`${colors.bgSecondary} border-2 ${colors.border} rounded-xl p-3 shadow-2xl backdrop-blur-xl`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className={`h-3 w-3 ${colors.accent}`} />
                          <h3 className={`text-xs ${colors.text}`}>Gợi ý câu hỏi</h3>
                        </div>
                        <div className="space-y-1.5">
                          {smartSuggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                handleSendMessage(suggestion, {});
                                setShowSuggestions(false);
                              }}
                              className={`w-full text-left text-xs p-2 rounded-lg ${colors.bgSecondary} hover:${colors.primary} ${colors.text} border ${colors.border} transition-all`}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {messages.length === 0 && (
                  <EmptyState 
                    isDarkMode={isDarkMode} 
                    themeColor={themeColor} 
                    colors={colors}
                    customColor={customColor}
                  />
                )}
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl px-3 py-2 shadow-lg ${
                          message.type === 'user'
                            ? `${colors.messageBg} ${colors.primaryText}`
                            : `${colors.messageBotBg} ${colors.text} backdrop-blur-sm`
                        }`}
                        style={message.type === 'user' && themeColor === 'custom' ? { 
                          backgroundColor: customColor,
                          color: isDarkMode ? '#ffffff' : '#0a0a0a'
                        } : {}}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed break-words">{message.content}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div ref={messagesEndRef} />
              </div>

                {/* Input area - FIXED AT BOTTOM */}
                <ChatInput onSendMessage={handleSendMessage} themeColor={themeColor} isDarkMode={isDarkMode} customColor={customColor} language={language} isSending={isInputBusy} />
              </Resizable>
            ) : (
              <div className="flex-1 flex flex-col">
                {/* Chat messages area - SCROLLABLE */}
                <div className={`flex-1 overflow-y-auto p-4 ${colors.bg} relative`}>
                  {/* Smart Suggestions */}
                  <AnimatePresence>
                  {showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-80"
                    >
                      <div className={`${colors.bgSecondary} border-2 ${colors.border} rounded-xl p-3 shadow-2xl backdrop-blur-xl`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className={`h-3 w-3 ${colors.accent}`} />
                          <h3 className={`text-xs ${colors.text}`}>Gợi ý câu hỏi</h3>
                        </div>
                        <div className="space-y-1.5">
                          {smartSuggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                handleSendMessage(suggestion, {});
                                setShowSuggestions(false);
                              }}
                              className={`w-full text-left text-xs p-2 rounded-lg ${colors.bgSecondary} hover:${colors.primary} ${colors.text} border ${colors.border} transition-all`}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {messages.length === 0 && (
                  <EmptyState 
                    isDarkMode={isDarkMode} 
                    themeColor={themeColor} 
                    colors={colors}
                    customColor={customColor}
                  />
                )}
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl px-3 py-2 shadow-lg ${
                          message.type === 'user'
                            ? `${colors.messageBg} ${colors.primaryText}`
                            : `${colors.messageBotBg} ${colors.text} backdrop-blur-sm`
                        }`}
                        style={message.type === 'user' && themeColor === 'custom' ? { 
                          backgroundColor: customColor,
                          color: getContrastColor(customColor)
                        } : {}}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed break-words">{message.content}</div>
                        {message.dashboardData && message.type === 'bot' && (
                          <Button
                            onClick={() => handleSelectDashboardFromHistory(message.dashboardData)}
                            size="sm"
                            className={`mt-2 ${colors.primary} ${colors.primaryHover} ${colors.primaryText} text-xs h-7 px-2 shadow-lg w-full`}
                            style={themeColor === 'custom' ? { 
                              backgroundColor: customColor,
                              color: getContrastColor(customColor)
                            } : {}}
                          >
                            <BarChart3 className="h-3 w-3 mr-1" />
                            Xem Dashboard
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div ref={messagesEndRef} />
              </div>

                {/* Input area - FIXED AT BOTTOM */}
                <ChatInput onSendMessage={handleSendMessage} themeColor={themeColor} isDarkMode={isDarkMode} customColor={customColor} language={language} isSending={isInputBusy} />
              </div>
            )
          )}

          {showDashboard && fuelPredictionData && (
            <motion.div 
              className={`${isFullscreenDashboard ? 'w-full' : 'flex-1'} ${isFullscreenDashboard ? '' : `border-l-2 ${colors.border}`} ${colors.bg} overflow-hidden`}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isComparisonMode ? (
                <ComparisonDashboard
                  themeColor={themeColor}
                  isDarkMode={isDarkMode}
                  customColor={customColor}
                  language={language}
                  dashboardHistory={getDashboardHistory().map(d => d.data)}
                  onBack={() => {
                    setIsComparisonMode(false);
                    setIsFullscreenDashboard(false);
                  }}
                  isFullscreen={isFullscreenDashboard}
                  onToggleFullscreen={() => setIsFullscreenDashboard(!isFullscreenDashboard)}
                />
              ) : (
                <FuelConsumptionDashboard 
                  data={fuelPredictionData} 
                  themeColor={themeColor} 
                  isDarkMode={isDarkMode} 
                  customColor={customColor}
                  language={language}
                  dashboardHistory={getDashboardHistory().map(d => d.data)}
                  onCompareMode={() => {
                    setIsComparisonMode(true);
                    setIsFullscreenDashboard(true);
                  }}
                  isFullscreen={isFullscreenDashboard}
                  onToggleFullscreen={() => setIsFullscreenDashboard(!isFullscreenDashboard)}
                />
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Dashboard History Modal */}
      <AnimatePresence>
        {showDashboardHistory && (
          <DashboardHistory
            dashboards={getDashboardHistory()}
            onSelectDashboard={handleSelectDashboardFromHistory}
            onClose={() => setShowDashboardHistory(false)}
            isDarkMode={isDarkMode}
            accentColor={themeColor === 'custom' ? customColor : colors.customPrimaryColor || '#8b5cf6'}
            language={language}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Export the helper function if needed in other files
export { generateMockFuelData };

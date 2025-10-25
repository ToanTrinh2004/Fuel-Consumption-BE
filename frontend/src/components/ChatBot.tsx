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
import { mockDatabase, Conversation, MockMessage, smartSuggestions } from '../utils/mockData';
import { toast } from 'sonner@2.0.3';
import { Resizable } from 're-resizable';
import { ThemeColor, Language } from '../App';
import fluxmareLogo from 'figma:asset/48159e3c19318e6ee94d6f46a7da4911deba57ae.png';
import { getLogoFilter, getLogoOpacity } from '../utils/logoUtils';
import { t } from '../utils/translations';

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

// Helper function for generating mock fuel data
const generateMockFuelData = (features: any) => {
  const base = 0.15 + (features.speedOverGround / 100) * 0.05;
  const predictions = [];
  
  for (let i = 0; i < 96; i++) {
    const timeVariation = Math.sin(i / 10) * 0.02;
    const randomness = (Math.random() - 0.5) * 0.01;
    const depthFactor = (features.seaFloorDepth / 1000) * 0.005;
    const tempFactor = (features.temperature2M / 30) * 0.003;
    const windFactor = (features.windSpeed10M / 20) * 0.008;
    const waveFactor = (features.waveHeight / 5) * 0.006;
    
    const fuelConsumption = base + timeVariation + randomness + depthFactor + tempFactor + windFactor + waveFactor;
    
    predictions.push({
      timestamp: i,
      time: `${String(Math.floor(i * 15 / 60)).padStart(2, '0')}:${String((i * 15) % 60).padStart(2, '0')}`,
      fuelConsumption: Math.max(0.01, fuelConsumption)
    });
  }
  
  return predictions;
};

export default function ChatBot({ username, onLogout, themeColor, isDarkMode, customColor, language, onChangeTheme, onToggleDarkMode, onChangeCustomColor, onChangeLanguage }: ChatBotProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [fuelPredictionData, setFuelPredictionData] = useState<any>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [showDashboardHistory, setShowDashboardHistory] = useState(false);
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [isFullscreenDashboard, setIsFullscreenDashboard] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  useEffect(() => {
    // Load conversations from localStorage
    const savedData = localStorage.getItem(`conversations_${username}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      const conversationsWithDates = parsed.map((conv: any) => ({
        ...conv,
        timestamp: new Date(conv.timestamp),
        messages: conv.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
      }));
      // Remove duplicates by ID
      const uniqueConversations = conversationsWithDates.filter((conv: Conversation, index: number, self: Conversation[]) => 
        index === self.findIndex((c) => c.id === conv.id)
      );
      setConversations(uniqueConversations);
      if (uniqueConversations.length > 0) {
        setActiveConversationId(uniqueConversations[0].id);
      }
    } else if (mockDatabase[username]) {
      // Load mock data if available
      setConversations(mockDatabase[username].conversations);
      if (mockDatabase[username].conversations.length > 0) {
        setActiveConversationId(mockDatabase[username].conversations[0].id);
      }
    }
  }, [username]);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(`conversations_${username}`, JSON.stringify(conversations));
    }
  }, [conversations, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const handleSendMessage = (content: string, formData: any) => {
    const startTime = Date.now();
    
    // Check if form data with 10 features
    const hasValidFeatures = formData && formData.speedOverGround !== undefined;
    
    const userMessage: MockMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    let currentConvId = activeConversationId;

    if (!currentConvId || !activeConversation) {
      // Check if conversation with same title already exists (avoid duplicates)
      const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
      const existingConv = conversations.find(c => c.title === title && c.messages.length === 0);
      
      if (existingConv) {
        // Use existing empty conversation
        currentConvId = existingConv.id;
        setActiveConversationId(existingConv.id);
        setConversations(prev => prev.map(conv => 
          conv.id === currentConvId 
            ? { ...conv, messages: [userMessage], timestamp: new Date() }
            : conv
        ));
      } else {
        // Create new conversation
        const newConv: Conversation = {
          id: `conv-${Date.now()}`,
          title,
          timestamp: new Date(),
          messages: [userMessage],
          isFavorite: false
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
        currentConvId = newConv.id;
      }
    } else {
      // Add to existing conversation
      setConversations(prev => prev.map(conv => 
        conv.id === currentConvId 
          ? { ...conv, messages: [...conv.messages, userMessage], timestamp: new Date() }
          : conv
      ));
    }

    setTimeout(() => {
      const responseTime = Date.now() - startTime;
      let botContent = '';
      let newFuelData = null;
      let isFuelPred = false;
      
      if (hasValidFeatures) {
        // Generate prediction from 10 features
        const predictions = generateMockFuelData(formData);
        const stats = {
          average: predictions.reduce((sum, p) => sum + p.fuelConsumption, 0) / predictions.length,
          max: Math.max(...predictions.map(p => p.fuelConsumption)),
          min: Math.min(...predictions.map(p => p.fuelConsumption)),
          total: predictions.reduce((sum, p) => sum + p.fuelConsumption, 0)
        };
        
        // Transform predictions to time series data for dashboard
        const timeSeriesData = predictions.map(p => ({
          time: p.time,
          consumption: p.fuelConsumption,
          speed: formData.speedOverGround
        }));

        // Create comparison data
        const comparison = [
          { metric: 'Speed', current: formData.speedOverGround, optimal: 8.5 },
          { metric: 'Wave Impact', current: formData.waveHeight, optimal: 2.0 },
          { metric: 'Wind Impact', current: formData.windSpeed10M, optimal: 10.0 }
        ];

        const totalKg = stats.total * 900; // total kg/s × 900 seconds per 15-min interval
        
        newFuelData = {
          query: `Speed ${formData.speedOverGround} m/s, Depth ${formData.seaFloorDepth} m, Temp ${formData.temperature2M}°C`,
          analysis: {
            fuelConsumption: totalKg,
            fuelConsumptionTons: totalKg / 1000,
            estimatedCost: (totalKg / 1000) * 650, // USD per ton
            efficiency: Math.max(0, Math.min(100, 100 - (formData.waveHeight * 5 + formData.windSpeed10M * 2))),
            avgConsumptionRate: stats.average,
            recommendation: formData.speedOverGround > 10 
              ? 'Giảm tốc độ để tối ưu tiêu thụ nhiên liệu'
              : 'Tốc độ ổn định, duy trì điều kiện hiện tại'
          },
          vesselInfo: {
            type: 'container_1_tier1',
            speedCalc: formData.speedOverGround,
            distance: formData.speedOverGround * 24, // distance in 24h
            datetime: new Date().toISOString()
          },
          timeSeriesData,
          comparison,
          timestamp: new Date()
        };
        
        setFuelPredictionData(newFuelData);
        setShowDashboard(true);
        isFuelPred = true;
        
        botContent = `✅ Dự đoán hoàn tất!

📊 Total.MomentaryFuel Analysis:
• Avg: ${stats.average.toFixed(5)} kg/s
• Max: ${stats.max.toFixed(5)} kg/s
• Min: ${stats.min.toFixed(5)} kg/s
• Total 24h: ${totalKg.toFixed(2)} kg

🎯 Features: Speed ${formData.speedOverGround} m/s, Depth ${formData.seaFloorDepth} m, Temp ${formData.temperature2M}°C

Dashboard đã sẵn sàng bên phải! 🚀`;
      } else {
        // Regular chat response
        botContent = generateBotResponse(content);
      }

      const botMessage: MockMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botContent,
        timestamp: new Date(),
        responseTime,
        isFuelPrediction: isFuelPred,
        dashboardData: isFuelPred ? newFuelData : undefined
      };

      setConversations(prev => prev.map(conv => 
        conv.id === currentConvId 
          ? { ...conv, messages: [...conv.messages, botMessage] }
          : conv
      ));
    }, 1000 + Math.random() * 1000);
  };

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setShowDashboard(false);
  };

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: `Cuộc trò chuyện mới`,
      messages: [],
      timestamp: new Date(),
      isFavorite: false
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setShowDashboard(false);
  };

  const handleDeleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (activeConversationId === conversationId) {
      const remaining = conversations.filter(c => c.id !== conversationId);
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
      setShowDashboard(false);
    }
  };

  const handleToggleFavorite = (conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, isFavorite: !conv.isFavorite } : conv
    ));
  };

  const handleClearHistory = () => {
    setConversations([]);
    setActiveConversationId(null);
    setFuelPredictionData(null);
    setShowDashboard(false);
    localStorage.removeItem(`conversations_${username}`);
    toast.success('Đã xóa toàn bộ lịch sử phân tích!');
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
                <ChatInput onSendMessage={handleSendMessage} themeColor={themeColor} isDarkMode={isDarkMode} customColor={customColor} language={language} />
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
                <ChatInput onSendMessage={handleSendMessage} themeColor={themeColor} isDarkMode={isDarkMode} customColor={customColor} language={language} />
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

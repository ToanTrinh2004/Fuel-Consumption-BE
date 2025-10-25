import { motion } from 'motion/react';
import fluxmareLogo from 'figma:asset/48159e3c19318e6ee94d6f46a7da4911deba57ae.png';
import { getLogoFilter, getLogoOpacity } from '../utils/logoUtils';

interface EmptyStateProps {
  isDarkMode: boolean;
  themeColor: string;
  colors: any;
  customColor?: string;
}

export default function EmptyState({ isDarkMode, themeColor, colors, customColor }: EmptyStateProps) {
  return (
    <motion.div 
      className="text-center mt-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <img 
        src={fluxmareLogo} 
        alt="Fluxmare Logo" 
        className="h-20 w-20 mx-auto mb-4 object-contain"
        style={{
          filter: getLogoFilter(isDarkMode, themeColor, customColor),
          opacity: getLogoOpacity(true)
        }}
      />
      <p 
        className={`text-sm ${themeColor === 'custom' ? '' : colors.accent}`}
        style={themeColor === 'custom' ? {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'
        } : {}}
      >
        Chưa có tin nhắn. Hãy bắt đầu dự đoán Total.MomentaryFuel!
      </p>
      <p 
        className="text-xs mt-2"
        style={{
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
        }}
      >
        💡 Nhấn 💡 để xem gợi ý thông minh
      </p>
      <p 
        className="text-xs mt-1"
        style={{
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
        }}
      >
        📊 Nhập 10 features → Dashboard hiện tự động
      </p>
      <p 
        className="text-xs mt-1"
        style={{
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
        }}
      >
        🎯 Hoặc chat text về nhiên liệu tàu thủy
      </p>
      <p 
        className="text-xs mt-1"
        style={{
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
        }}
      >
        ⏱️ Benchmark FuelCast: 96 timestamps × 15 phút
      </p>
    </motion.div>
  );
}

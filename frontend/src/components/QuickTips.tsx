import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, X, ChevronRight, Zap, TrendingDown, Search, Star, Download } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeColor } from '../App';

interface QuickTipsProps {
  themeColor: ThemeColor;
  isDarkMode: boolean;
  customColor: string;
}

interface Tip {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

export default function QuickTips({ themeColor, isDarkMode, customColor }: QuickTipsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const getColors = (theme: ThemeColor, dark: boolean) => {
    const base = {
      default: dark
        ? { bg: 'bg-[#0a0a0a]', bgSecondary: 'bg-[#1a1a1a]', text: 'text-[#e5e5e5]', textSecondary: 'text-[#b0b0b0]', accent: 'text-[#e3d5f7]', accentBg: 'bg-[#e3d5f7]/10', border: 'border-[#e3d5f7]/30' }
        : { bg: 'bg-white', bgSecondary: 'bg-[#f5f5f5]', text: 'text-[#1a1a1a]', textSecondary: 'text-[#4a4a4a]', accent: 'text-[#2002a6]', accentBg: 'bg-[#2002a6]/10', border: 'border-[#2002a6]/50' },
      custom: dark
        ? { bg: 'bg-black', bgSecondary: 'bg-[#1a1a1a]', text: 'text-white', textSecondary: 'text-gray-300', accent: 'text-white', accentBg: 'bg-white/10', border: 'border-white/30' }
        : { bg: 'bg-white', bgSecondary: 'bg-white', text: 'text-gray-900', textSecondary: 'text-gray-700', accent: 'text-gray-900', accentBg: 'bg-gray-900/10', border: 'border-gray-900/50' },
    };
    return base[theme === 'custom' ? 'custom' : 'default'];
  };

  const colors = getColors(themeColor, isDarkMode);

  const tips: Tip[] = [
    {
      icon: Zap,
      title: 'Chọn AI Model phù hợp',
      description: 'XGBoost cho accuracy cao nhất, Random Forest cho dữ liệu đa dạng, Neural Network cho patterns phức tạp',
      color: 'text-yellow-400'
    },
    {
      icon: TrendingDown,
      title: 'Giảm tốc độ 10-20%',
      description: 'Tiết kiệm 30-40% nhiên liệu nhờ công thức Speed^2.8. Giảm 2 knots = tiết kiệm ~15-20% fuel',
      color: 'text-green-400'
    },
    {
      icon: Search,
      title: 'Sử dụng Advanced Search',
      description: 'Tìm kiếm trong lịch sử theo date, ship type, AI model để so sánh hiệu suất',
      color: 'text-blue-400'
    },
    {
      icon: Star,
      title: 'Bookmark predictions quan trọng',
      description: 'Đánh dấu yêu thích để truy cập nhanh các phân tích quan trọng',
      color: 'text-purple-400'
    },
    {
      icon: Download,
      title: 'Export báo cáo định kỳ',
      description: 'Download charts PNG/SVG và reports PDF/Excel để chia sẻ với team',
      color: 'text-pink-400'
    }
  ];

  const currentTip = tips[currentTipIndex];
  const Icon = currentTip.icon;

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-full ${colors.accentBg} border-2 ${colors.border} backdrop-blur-sm shadow-lg`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        title="Quick Tips"
      >
        <Lightbulb className={`h-5 w-5 ${colors.accent}`} />
      </motion.button>

      {/* Tips panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed bottom-20 right-6 z-40 w-80 ${colors.bg} border-2 ${colors.border} rounded-xl shadow-2xl backdrop-blur-sm`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${colors.border}`}>
              <div className="flex items-center gap-2">
                <Lightbulb className={`h-4 w-4 ${currentTip.color}`} />
                <span className={`text-sm ${colors.text}`}>Quick Tips</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className={`h-3 w-3 ${colors.textSecondary}`} />
              </Button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTipIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-4"
              >
                <div className={`flex items-start gap-3 p-3 rounded-lg ${colors.accentBg}`}>
                  <div className={`p-2 rounded-full ${colors.bgSecondary}`}>
                    <Icon className={`h-5 w-5 ${currentTip.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm ${colors.text} mb-1`}>
                      {currentTip.title}
                    </h3>
                    <p className={`text-xs ${colors.textSecondary}`}>
                      {currentTip.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <div className={`flex items-center justify-between p-4 border-t ${colors.border}`}>
              <div className="flex gap-1">
                {tips.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 w-6 rounded-full transition-all ${
                      index === currentTipIndex
                        ? colors.accentBg.replace('/10', '')
                        : colors.bgSecondary
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextTip}
                className={`${colors.text} h-7`}
              >
                Tiếp theo
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Ship, 
  Sparkles, 
  BarChart3, 
  History, 
  Settings, 
  Palette, 
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Brain,
  TrendingUp,
  Database,
  ShieldCheck
} from 'lucide-react';
import { ThemeColor } from '../App';

interface OnboardingTourProps {
  themeColor: ThemeColor;
  isDarkMode: boolean;
  customColor: string;
  username: string;
}

interface TourStep {
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  image?: string;
  color: string;
}

export default function OnboardingTour({ themeColor, isDarkMode, customColor, username }: OnboardingTourProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Kiểm tra xem user đã xem onboarding chưa
    const hasSeenOnboarding = localStorage.getItem(`onboarding_${username}`);
    if (!hasSeenOnboarding) {
      // Delay 1 giây để tạo hiệu ứng mượt mà
      setTimeout(() => {
        setOpen(true);
      }, 1000);
    }
  }, [username]);

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

  const tourSteps: TourStep[] = [
    {
      title: 'Chào mừng đến với Fluxmare! 🚢',
      description: 'Hệ thống AI phân tích nhiên liệu tàu thủy thông minh với nhiều mô hình ML tiên tiến',
      icon: Ship,
      features: [
        '🤖 Nhiều AI Models: Random Forest, XGBoost, Neural Network, Gradient Boosting',
        '📊 Dự đoán chính xác Total.MomentaryFuel (kg/s)',
        '🎯 Hỗ trợ 5 loại tàu: Diverse, MPV, Tanker, RoPax, Container',
        '⚡ Phân tích thời gian thực với FuelCast benchmark'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Hệ thống AI Models đa dạng 🤖',
      description: 'Chọn từ nhiều mô hình AI để có dự đoán chính xác nhất cho từng tình huống',
      icon: Brain,
      features: [
        '🌲 Random Forest: Ensemble learning, chống overfitting tốt',
        '🚀 XGBoost: Gradient boosting, độ chính xác cao nhất',
        '🧠 Neural Network: Deep learning, phát hiện pattern phức tạp',
        '📈 Gradient Boosting: Tối ưu cho time-series prediction',
        '🎲 Support Vector Regression: Tốt cho dữ liệu phi tuyến',
        '📊 So sánh hiệu suất: MAE, RMSE, R² scores cho mỗi model'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Input Features & Chat 💬',
      description: 'Nhập 7 features chuẩn FuelCast hoặc chat text thông thường',
      icon: MessageSquare,
      features: [
        '📝 7 Features bắt buộc: Type, Datetime, Speed_calc, Distance, Wind_speed, Wave_height, Current_speed',
        '💡 Form gọn gàng không chiếm nhiều không gian',
        '🗨️ Textarea chat text: Hỏi đáp tự do với AI',
        '⚡ Auto-complete suggestions cho input',
        '🎯 Validation thông minh cho mỗi feature',
        '📋 Templates có sẵn cho các scenarios phổ biến'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Dashboard Analytics 📊',
      description: 'Dashboard tự động hiển thị sau khi nhập đủ 7 features',
      icon: BarChart3,
      features: [
        '📈 Biểu đồ Time Series: Fuel consumption theo thời gian',
        '⚡ Speed vs Consumption: Phân tích mối quan hệ tốc độ-nhiên liệu',
        '🎯 Performance Metrics: Efficiency, cost estimation, avg rate',
        '🔍 AI Model Comparison: So sánh kết quả từ các models',
        '💰 Chi phí dự đoán: Tính toán theo giá nhiên liệu thực tế',
        '📊 Export data: Download biểu đồ và báo cáo PDF/Excel'
      ],
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'History & Tracking 📚',
      description: 'Sidebar lịch sử với tìm kiếm, filter, và quản lý predictions',
      icon: History,
      features: [
        '🔍 Tìm kiếm nhanh: Search theo date, ship type, model',
        '⭐ Yêu thích: Bookmark predictions quan trọng',
        '📥 Export history: Xuất toàn bộ lịch sử analysis',
        '🗑️ Quản lý: Xóa, archive các predictions cũ',
        '📊 Statistics: Xem tổng quan thống kê sử dụng',
        '🔄 Sync cloud: Đồng bộ lịch sử giữa các thiết bị (với Supabase)'
      ],
      color: 'from-indigo-500 to-blue-500'
    },
    {
      title: 'Training Data & Models 🗄️',
      description: 'Quản lý training data và train models mới',
      icon: Database,
      features: [
        '📊 Training datasets: Xem và quản lý data huấn luyện',
        '🔄 Upload data: Import CSV/Excel với 7 features',
        '🎓 Retrain models: Train lại models với data mới',
        '📈 Model versioning: Theo dõi các phiên bản models',
        '🎯 Performance tracking: MAE, RMSE, R² cho mỗi version',
        '🔬 Data validation: Kiểm tra quality của training data'
      ],
      color: 'from-teal-500 to-cyan-500'
    },
    {
      title: 'Themes & Customization 🎨',
      description: 'Hệ thống theme đa dạng với màu mặc định và RGB picker',
      icon: Palette,
      features: [
        '🎨 Default theme: #2002a6 (dark) / #e3d5f7 (light)',
        '🌈 14 preset themes: Pink, Blue, Purple, Ocean, Sunset...',
        '🎯 Custom RGB picker: Tùy chỉnh màu chủ đạo',
        '🌙 Dark/Light mode: Tự động điều chỉnh brightness',
        '✨ Glass effects: Modern SaaS style (Notion/Linear inspired)',
        '🎭 Logo auto-adjust: Brightness thay đổi theo theme'
      ],
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Settings & Admin ⚙️',
      description: 'Cài đặt chi tiết và admin dashboard cho quản lý',
      icon: Settings,
      features: [
        '⚙️ User preferences: Font size, language, notifications',
        '🔔 Toast notifications: Swipe-to-dismiss (gạt ngang để xóa)',
        '👨‍💼 Admin panel: Quản lý users, view analytics',
        '🔐 Role-based access: Admin, Analyst, User permissions',
        '📊 System analytics: Usage stats, model performance',
        '🔒 Security: Audit logs, activity tracking'
      ],
      color: 'from-gray-500 to-slate-500'
    },
    {
      title: 'Bắt đầu sử dụng! 🚀',
      description: 'Bạn đã sẵn sàng để tối ưu hóa nhiên liệu tàu thủy với Fluxmare',
      icon: CheckCircle2,
      features: [
        '1️⃣ Chọn AI model phù hợp từ dropdown',
        '2️⃣ Nhập 7 features hoặc chat text thông thường',
        '3️⃣ Xem dashboard tự động với biểu đồ chi tiết',
        '4️⃣ So sánh predictions từ các models khác nhau',
        '5️⃣ Lưu vào history và export báo cáo',
        '💡 Tip: Nhấn icon 💡 để xem quick suggestions!'
      ],
      color: 'from-green-500 to-lime-500'
    }
  ];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(`onboarding_${username}`, 'true');
    setOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem(`onboarding_${username}`, 'true');
    setOpen(false);
  };

  const currentTourStep = tourSteps[currentStep];
  const Icon = currentTourStep.icon;
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={`${colors.bg} ${colors.text} max-w-3xl border-2 ${colors.border}`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className={`${colors.accent} flex items-center gap-2`}>
              <Sparkles className="h-5 w-5" />
              Hướng dẫn sử dụng Fluxmare
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className={`${colors.textSecondary} hover:${colors.text}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className={colors.textSecondary}>
            Bước {currentStep + 1} / {tourSteps.length}
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        <div className={`w-full h-1.5 ${colors.bgSecondary} rounded-full overflow-hidden`}>
          <motion.div
            className={`h-full bg-gradient-to-r ${currentTourStep.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Icon & Title */}
            <div className={`flex items-center gap-3 p-4 rounded-lg ${colors.accentBg}`}>
              <div className={`p-3 rounded-full bg-gradient-to-br ${currentTourStep.color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className={`${colors.text}`}>{currentTourStep.title}</h3>
                <p className={`text-xs ${colors.textSecondary} mt-1`}>
                  {currentTourStep.description}
                </p>
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-2">
              {currentTourStep.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start gap-2 p-2 rounded ${colors.bgSecondary}`}
                >
                  <CheckCircle2 className={`h-4 w-4 ${colors.accent} mt-0.5 flex-shrink-0`} />
                  <span className={`text-xs ${colors.text}`}>{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Step indicator dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {tourSteps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentStep
                      ? `w-8 bg-gradient-to-r ${currentTourStep.color}`
                      : `w-1.5 ${colors.bgSecondary}`
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`${colors.border} ${colors.text}`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          <div className="flex gap-2">
            {currentStep < tourSteps.length - 1 ? (
              <>
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className={colors.textSecondary}
                >
                  Bỏ qua
                </Button>
                <Button
                  onClick={handleNext}
                  className={`bg-gradient-to-r ${currentTourStep.color} text-white border-0`}
                >
                  Tiếp theo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </>
            ) : (
              <Button
                onClick={handleComplete}
                className={`bg-gradient-to-r ${currentTourStep.color} text-white border-0`}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Bắt đầu sử dụng!
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

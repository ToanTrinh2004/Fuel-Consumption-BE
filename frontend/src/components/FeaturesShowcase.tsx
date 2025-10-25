import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Brain, 
  MessageSquare, 
  BarChart3, 
  History, 
  Database,
  Palette,
  Settings,
  CheckCircle2,
  TrendingUp,
  Zap,
  Shield,
  Users
} from 'lucide-react';
import { ThemeColor } from '../App';

interface FeaturesShowcaseProps {
  themeColor: ThemeColor;
  isDarkMode: boolean;
  customColor: string;
}

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  highlights: string[];
  color: string;
}

export default function FeaturesShowcase({ themeColor, isDarkMode, customColor }: FeaturesShowcaseProps) {
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

  const coreFeatures: Feature[] = [
    {
      icon: Brain,
      title: 'Nhiều AI Models',
      description: '5+ Machine Learning models cho dự đoán chính xác',
      highlights: [
        'Random Forest: Ensemble learning, chống overfitting',
        'XGBoost: Gradient boosting, accuracy cao nhất',
        'Neural Network: Deep learning, patterns phức tạp',
        'Gradient Boosting: Tối ưu time-series',
        'SVR: Support Vector Regression cho phi tuyến'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: MessageSquare,
      title: 'Dual Input Mode',
      description: 'Form chuyên nghiệp hoặc chat text tự nhiên',
      highlights: [
        '7 Features FuelCast: Type, Datetime, Speed, Distance, Wind, Wave, Current',
        'Chat text thông thường: Hỏi đáp tự do với AI',
        'Auto-complete suggestions cho input nhanh',
        'Templates scenarios phổ biến',
        'Toggle form/chat dễ dàng'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BarChart3,
      title: 'Auto Dashboard',
      description: 'Tự động hiển thị sau khi nhập 7 features',
      highlights: [
        'Time Series: Fuel consumption theo thời gian',
        'Speed vs Consumption: Phân tích Speed^2.8',
        'Weather Impact: Wind, Wave, Current effects',
        'Model Comparison: So sánh predictions từ các AI',
        'Export charts & reports PDF/Excel'
      ],
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: History,
      title: 'History & Tracking',
      description: 'Sidebar lịch sử đầy đủ với search & filter',
      highlights: [
        'Search nhanh: Date, ship type, AI model',
        'Bookmark predictions quan trọng',
        'Export lịch sử CSV/JSON',
        'Filter đa tiêu chí',
        'Statistics dashboard'
      ],
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const advancedFeatures: Feature[] = [
    {
      icon: Database,
      title: 'Training Data Management',
      description: 'Quản lý data và train models mới',
      highlights: [
        'Upload CSV/Excel training data',
        'Data validation & cleaning tự động',
        'Retrain models với data mới',
        'Model versioning & A/B testing',
        'Performance tracking: MAE, RMSE, R²'
      ],
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: Palette,
      title: 'Theme Customization',
      description: '14 themes + custom RGB picker',
      highlights: [
        'Default: #2002a6 dark / #e3d5f7 light',
        '14 preset themes: Pink, Blue, Purple, Ocean...',
        'Custom RGB picker: Tùy chỉnh hoàn toàn',
        'Dark/Light mode auto-adjust',
        'Glass effects SaaS style (Notion/Linear)'
      ],
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Settings,
      title: 'Advanced Settings',
      description: 'Cài đặt chi tiết và notifications',
      highlights: [
        'Font size, language preferences',
        'Toast notifications với swipe-to-dismiss',
        'Auto-save predictions',
        'Default AI model selection',
        'Notification customization'
      ],
      color: 'from-gray-500 to-slate-500'
    },
    {
      icon: Shield,
      title: 'Admin & Security',
      description: 'Role-based access và audit logs',
      highlights: [
        'Admin dashboard: Manage users & analytics',
        'Role-based: Admin, Analyst, User',
        'Audit logs & activity tracking',
        'System analytics & usage stats',
        'Security & compliance'
      ],
      color: 'from-red-500 to-orange-500'
    }
  ];

  const FeatureCard = ({ feature }: { feature: Feature }) => {
    const Icon = feature.icon;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`p-4 rounded-lg border-2 ${colors.border} ${colors.bgSecondary}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className={`${colors.text}`}>{feature.title}</h3>
            <p className={`text-xs ${colors.textSecondary}`}>{feature.description}</p>
          </div>
        </div>
        <ul className="space-y-2">
          {feature.highlights.map((highlight, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 className={`h-3 w-3 ${colors.accent} mt-0.5 flex-shrink-0`} />
              <span className={`text-xs ${colors.textSecondary}`}>{highlight}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`border-2 ${colors.border} ${colors.text}`}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Khám phá tính năng
        </Button>
      </DialogTrigger>
      <DialogContent className={`${colors.bg} ${colors.text} max-w-5xl max-h-[85vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className={`${colors.accent} flex items-center gap-2`}>
            <Sparkles className="h-5 w-5" />
            Tính năng Fluxmare AI
          </DialogTitle>
          <DialogDescription className={colors.textSecondary}>
            Khám phá toàn bộ tính năng của hệ thống phân tích nhiên liệu tàu thủy
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="core" className="w-full">
          <TabsList className={`grid w-full grid-cols-3 ${colors.bgSecondary}`}>
            <TabsTrigger value="core" className={colors.text}>
              Tính năng cốt lõi
            </TabsTrigger>
            <TabsTrigger value="advanced" className={colors.text}>
              Tính năng nâng cao
            </TabsTrigger>
            <TabsTrigger value="benefits" className={colors.text}>
              Lợi ích
            </TabsTrigger>
          </TabsList>

          <TabsContent value="core" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coreFeatures.map((feature, index) => (
                <FeatureCard key={index} feature={feature} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advancedFeatures.map((feature, index) => (
                <FeatureCard key={index} feature={feature} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="benefits" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Benefit 1 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className={`p-4 rounded-lg ${colors.accentBg} border-2 ${colors.border}`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-500">
                    <TrendingDown className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`${colors.text}`}>Tiết kiệm 30-40% nhiên liệu</h3>
                  <p className={`text-xs ${colors.textSecondary}`}>
                    Giảm tốc độ 10-20% theo khuyến nghị AI, áp dụng công thức Speed^2.8
                  </p>
                </div>
              </motion.div>

              {/* Benefit 2 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className={`p-4 rounded-lg ${colors.accentBg} border-2 ${colors.border}`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`${colors.text}`}>Dự đoán real-time</h3>
                  <p className={`text-xs ${colors.textSecondary}`}>
                    Phân tích tức thời mỗi 15 phút, phát hiện bất thường sớm 2-3 ngày
                  </p>
                </div>
              </motion.div>

              {/* Benefit 3 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className={`p-4 rounded-lg ${colors.accentBg} border-2 ${colors.border}`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`${colors.text}`}>Team collaboration</h3>
                  <p className={`text-xs ${colors.textSecondary}`}>
                    Share dashboards, export reports, sync data giữa các thiết bị
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Summary */}
            <div className={`p-4 rounded-lg border-2 ${colors.border} ${colors.bgSecondary} mt-4`}>
              <h3 className={`${colors.accent} mb-2`}>🚀 Tóm tắt lợi ích</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className={`h-3 w-3 ${colors.accent} mt-0.5`} />
                  <span className={colors.textSecondary}>Giảm chi phí nhiên liệu 30-40%</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className={`h-3 w-3 ${colors.accent} mt-0.5`} />
                  <span className={colors.textSecondary}>Tăng hiệu suất vận hành 20-25%</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className={`h-3 w-3 ${colors.accent} mt-0.5`} />
                  <span className={colors.textSecondary}>Giảm khí thải CO₂ lên đến 35%</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className={`h-3 w-3 ${colors.accent} mt-0.5`} />
                  <span className={colors.textSecondary}>Phát hiện sớm vấn đề 2-3 ngày</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className={`h-3 w-3 ${colors.accent} mt-0.5`} />
                  <span className={colors.textSecondary}>Data-driven decisions với AI</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className={`h-3 w-3 ${colors.accent} mt-0.5`} />
                  <span className={colors.textSecondary}>ROI trong 3-6 tháng</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { HelpCircle, TrendingDown, BarChart3, Database, Sparkles, Settings2, History } from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeColor } from '../App';

interface HelpDialogProps {
  themeColor: ThemeColor;
  isDarkMode: boolean;
  customColor: string;
}

export default function HelpDialog({ themeColor, isDarkMode, customColor }: HelpDialogProps) {
  const [open, setOpen] = useState(false);

  const getColors = (theme: ThemeColor, dark: boolean) => {
    const base = {
      default: dark
        ? { bg: 'bg-[#0a0a0a]', bgSecondary: 'bg-[#1a1a1a]', text: 'text-[#e5e5e5]', textSecondary: 'text-[#b0b0b0]', accent: 'text-[#e3d5f7]', border: 'border-[#e3d5f7]/30' }
        : { bg: 'bg-white', bgSecondary: 'bg-[#f5f5f5]', text: 'text-[#1a1a1a]', textSecondary: 'text-[#4a4a4a]', accent: 'text-[#2002a6]', border: 'border-[#2002a6]/50' },
      pink: dark
        ? { bg: 'bg-black', bgSecondary: 'bg-[#1a1a1a]', text: 'text-pink-50', textSecondary: 'text-pink-200', accent: 'text-pink-300', border: 'border-pink-400/30' }
        : { bg: 'bg-white', bgSecondary: 'bg-white', text: 'text-pink-950', textSecondary: 'text-pink-800', accent: 'text-pink-700', border: 'border-pink-400/50' },
      blue: dark
        ? { bg: 'bg-black', bgSecondary: 'bg-[#1a1a1a]', text: 'text-blue-50', textSecondary: 'text-blue-200', accent: 'text-blue-300', border: 'border-blue-400/50' }
        : { bg: 'bg-white', bgSecondary: 'bg-white', text: 'text-blue-950', textSecondary: 'text-blue-800', accent: 'text-blue-700', border: 'border-blue-400/50' },
      purple: dark
        ? { bg: 'bg-black', bgSecondary: 'bg-[#1a1a1a]', text: 'text-purple-50', textSecondary: 'text-purple-200', accent: 'text-purple-300', border: 'border-purple-400/50' }
        : { bg: 'bg-white', bgSecondary: 'bg-white', text: 'text-purple-950', textSecondary: 'text-purple-800', accent: 'text-purple-700', border: 'border-purple-400/50' },
      ocean: dark
        ? { bg: 'bg-black', bgSecondary: 'bg-[#1a1a1a]', text: 'text-cyan-50', textSecondary: 'text-cyan-200', accent: 'text-cyan-300', border: 'border-cyan-400/50' }
        : { bg: 'bg-white', bgSecondary: 'bg-white', text: 'text-cyan-950', textSecondary: 'text-cyan-800', accent: 'text-cyan-700', border: 'border-cyan-400/50' },
      sunset: dark
        ? { bg: 'bg-black', bgSecondary: 'bg-[#1a1a1a]', text: 'text-orange-50', textSecondary: 'text-orange-200', accent: 'text-orange-300', border: 'border-orange-400/50' }
        : { bg: 'bg-white', bgSecondary: 'bg-white', text: 'text-orange-950', textSecondary: 'text-orange-800', accent: 'text-orange-700', border: 'border-orange-400/50' },
      emerald: dark
        ? { bg: 'bg-black', bgSecondary: 'bg-[#1a1a1a]', text: 'text-emerald-50', textSecondary: 'text-emerald-200', accent: 'text-emerald-300', border: 'border-emerald-400/50' }
        : { bg: 'bg-white', bgSecondary: 'bg-white', text: 'text-emerald-950', textSecondary: 'text-emerald-800', accent: 'text-emerald-700', border: 'border-emerald-400/50' },
      rose: dark
        ? { bg: 'bg-black', bgSecondary: 'bg-[#1a1a1a]', text: 'text-rose-50', textSecondary: 'text-rose-200', accent: 'text-rose-300', border: 'border-rose-400/50' }
        : { bg: 'bg-white', bgSecondary: 'bg-white', text: 'text-rose-950', textSecondary: 'text-rose-800', accent: 'text-rose-700', border: 'border-rose-400/50' },
      fuchsia: dark
        ? { bg: 'bg-black', bgSecondary: 'bg-[#1a1a1a]', text: 'text-fuchsia-50', textSecondary: 'text-fuchsia-200', accent: 'text-fuchsia-300', border: 'border-fuchsia-400/50' }
        : { bg: 'bg-white', bgSecondary: 'bg-white', text: 'text-fuchsia-950', textSecondary: 'text-fuchsia-800', accent: 'text-fuchsia-700', border: 'border-fuchsia-400/50' },
      indigo: dark
        ? { bg: 'bg-black', bgSecondary: 'bg-[#1a1a1a]', text: 'text-indigo-50', textSecondary: 'text-indigo-200', accent: 'text-indigo-300', border: 'border-indigo-400/50' }
        : { bg: 'bg-white', bgSecondary: 'bg-white', text: 'text-indigo-950', textSecondary: 'text-indigo-800', accent: 'text-indigo-700', border: 'border-indigo-400/50' },
      sky: dark
        ? { bg: 'bg-black', bgSecondary: 'bg-[#1a1a1a]', text: 'text-sky-50', textSecondary: 'text-sky-200', accent: 'text-sky-300', border: 'border-sky-400/50' }
        : { bg: 'bg-white', bgSecondary: 'bg-white', text: 'text-sky-950', textSecondary: 'text-sky-800', accent: 'text-sky-700', border: 'border-sky-400/50' },
      teal: dark
        ? { bg: 'bg-black', bgSecondary: 'bg-[#1a1a1a]', text: 'text-teal-50', textSecondary: 'text-teal-200', accent: 'text-teal-300', border: 'border-teal-400/50' }
        : { bg: 'bg-white', bgSecondary: 'bg-white', text: 'text-teal-950', textSecondary: 'text-teal-800', accent: 'text-teal-700', border: 'border-teal-400/50' },
      lime: dark
        ? { bg: 'bg-black', bgSecondary: 'bg-[#1a1a1a]', text: 'text-lime-50', textSecondary: 'text-lime-200', accent: 'text-lime-300', border: 'border-lime-400/50' }
        : { bg: 'bg-white', bgSecondary: 'bg-white', text: 'text-lime-950', textSecondary: 'text-lime-800', accent: 'text-lime-700', border: 'border-lime-400/50' },
      amber: dark
        ? { bg: 'bg-black', bgSecondary: 'bg-[#1a1a1a]', text: 'text-amber-50', textSecondary: 'text-amber-200', accent: 'text-amber-300', border: 'border-amber-400/50' }
        : { bg: 'bg-white', bgSecondary: 'bg-white', text: 'text-amber-950', textSecondary: 'text-amber-800', accent: 'text-amber-700', border: 'border-amber-400/50' },
      custom: dark
        ? { bg: 'bg-black', bgSecondary: 'bg-[#1a1a1a]', text: 'text-white', textSecondary: 'text-gray-300', accent: 'text-white', border: 'border-white/30' }
        : { bg: 'bg-white', bgSecondary: 'bg-white', text: 'text-gray-900', textSecondary: 'text-gray-700', accent: 'text-gray-900', border: 'border-gray-900/50' },
    };
    return base[theme];
  };

  const colors = getColors(themeColor, isDarkMode);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={`inline-flex items-center justify-center rounded-md border-2 ${colors.border} ${colors.accent} h-7 w-7 p-0 transition-colors`}
        title="Hướng dẫn sử dụng"
      >
        <HelpCircle className="h-3 w-3" />
      </DialogTrigger>
      <DialogContent className={`${colors.bg} ${colors.text} max-w-3xl max-h-[85vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className={`${colors.accent} flex items-center gap-2`}>
            <HelpCircle className="h-5 w-5" />
            Hướng dẫn sử dụng Fluxmare AI
          </DialogTitle>
          <DialogDescription className={colors.textSecondary}>
            Hệ thống phân tích nhiên liệu tàu thủy thông minh với nhiều AI models
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <Accordion type="single" collapsible className="space-y-2">
            {/* 0. Tổng quan hệ thống */}
            <AccordionItem value="overview" className={`border-2 ${colors.border} rounded-lg px-3`}>
              <AccordionTrigger className={`${colors.text} hover:no-underline`}>
                <div className="flex items-center gap-2">
                  <Sparkles className={`h-4 w-4 ${colors.accent}`} />
                  <span className="text-sm">0. Tổng quan hệ thống Fluxmare</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs space-y-2 pt-2">
                <p className={colors.textSecondary}>
                  <strong>Fluxmare</strong> là chatbot AI phân tích <strong>Total.MomentaryFuel (kg/s)</strong> cho tàu thủy với:
                </p>
                <div className="space-y-1">
                  <p className={colors.accent}>🎯 Tính năng chính:</p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>🤖 Nhiều AI Models</strong>: Random Forest, XGBoost, Neural Network, Gradient Boosting, SVR</li>
                    <li><strong>📊 7 Features Input</strong>: Type, Datetime, Speed, Distance, Wind, Wave, Current</li>
                    <li><strong>💬 Dual Mode</strong>: Form input chuyên nghiệp + Chat text thông thường</li>
                    <li><strong>📈 Auto Dashboard</strong>: Tự động hiển thị sau khi nhập đủ 7 features</li>
                    <li><strong>📚 History & Tracking</strong>: Sidebar lịch sử với search, filter, export</li>
                    <li><strong>🎨 Theme System</strong>: 14 themes + custom RGB picker</li>
                    <li><strong>⚡ Real-time Analysis</strong>: Dự đoán tức thời, không cần reload</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 1. Input Features (updated to 7 features) */}
            <AccordionItem value="input" className={`border-2 ${colors.border} rounded-lg px-3`}>
              <AccordionTrigger className={`${colors.text} hover:no-underline`}>
                <div className="flex items-center gap-2">
                  <TrendingDown className={`h-4 w-4 ${colors.accent}`} />
                  <span className="text-sm">1. Nhập dữ liệu (7 Features)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs space-y-2 pt-2">
                <p className={colors.accent}>📝 7 Features chuẩn FuelCast Benchmark:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li><strong>Type</strong>: Loại tàu (diverse, mpv, tanker, ropax, container)</li>
                  <li><strong>Datetime</strong>: Thời gian phân tích (mỗi 15 phút 1 lần)</li>
                  <li><strong>Speed_calc</strong>: Tốc độ tàu (knots), 0-30 knots</li>
                  <li><strong>Distance</strong>: Quãng đường di chuyển (nautical miles)</li>
                  <li><strong>Wind_speed</strong>: Tốc độ gió (m/s), ảnh hưởng lớn đến tiêu thụ</li>
                  <li><strong>Wave_height</strong>: Độ cao sóng (m), càng cao càng tiêu tốn</li>
                  <li><strong>Current_speed</strong>: Dòng hải lưu (m/s), thuận/ngược chiều</li>
                </ul>
                
                <div className={`${colors.bgSecondary} border ${colors.border} rounded p-2 mt-2`}>
                  <p className={colors.accent}>💬 <strong>Dual Input Mode</strong>:</p>
                  <ul className="list-disc ml-5 space-y-1 mt-1">
                    <li><strong>Form Input</strong>: Nhập đầy đủ 7 features → Dashboard tự động</li>
                    <li><strong>Chat Text</strong>: Hỏi đáp tự do, không cần form (textarea riêng)</li>
                    <li><strong>Toggle Form</strong>: Nhấn "Ẩn Form" để chat text đơn giản</li>
                    <li><strong>Templates</strong>: Chọn scenarios có sẵn để fill nhanh</li>
                  </ul>
                </div>

                <div className={`${colors.bgSecondary} border ${colors.border} rounded p-2 mt-2`}>
                  <p className={colors.accent}>🚢 <strong>5 Loại tàu</strong>:</p>
                  <ul className="list-disc ml-5 space-y-1 mt-1">
                    <li><strong>Diverse</strong>: Tàu dịch vụ, kéo, cá (tiêu thụ thấp 0.05-0.2 kg/s)</li>
                    <li><strong>MPV</strong>: Multi-purpose vessel (0.1-0.4 kg/s)</li>
                    <li><strong>Tanker</strong>: Tàu chở dầu, khí (0.3-0.8 kg/s, cao nhất)</li>
                    <li><strong>RoPax</strong>: Ferry chở khách + xe (0.2-0.5 kg/s)</li>
                    <li><strong>Container</strong>: Tốc độ cao 20-25 knots (0.3-0.7 kg/s)</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 2. Dashboard */}
            <AccordionItem value="dashboard" className={`border-2 ${colors.border} rounded-lg px-3`}>
              <AccordionTrigger className={`${colors.text} hover:no-underline`}>
                <div className="flex items-center gap-2">
                  <BarChart3 className={`h-4 w-4 ${colors.accent}`} />
                  <span className="text-sm">2. Dashboard Analytics</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs space-y-2 pt-2">
                <p className={colors.textSecondary}>
                  Dashboard <strong>tự động hiển thị</strong> sau khi nhập đủ 7 features:
                </p>
                
                <div className="space-y-2">
                  <p className={colors.accent}>📊 Các chỉ số quan trọng:</p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Total Fuel Consumption</strong>: Tổng nhiên liệu (kg và tons)</li>
                    <li><strong>Cost Estimation</strong>: Chi phí ước tính ($0.65/kg, customizable)</li>
                    <li><strong>Average Rate</strong>: Tiêu thụ/nautical mile (kg/nm)</li>
                    <li><strong>Efficiency Score</strong>: 0-100%, so với optimal conditions</li>
                    <li><strong>CO₂ Emissions</strong>: Ước tính khí thải (tons CO₂)</li>
                  </ul>
                  
                  <p className={colors.accent}>📈 Biểu đồ chi tiết:</p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Time Series Chart</strong>: Fuel theo thời gian (mỗi 15 phút)</li>
                    <li><strong>Speed vs Consumption</strong>: Quan hệ Speed^2.8</li>
                    <li><strong>Weather Impact</strong>: Wind, Wave, Current ảnh hưởng</li>
                    <li><strong>Model Comparison</strong>: So sánh predictions từ các AI</li>
                    <li><strong>Current vs Optimal</strong>: So với điều kiện tối ưu</li>
                  </ul>
                  
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 3. History & Tracking */}
            <AccordionItem value="history" className={`border-2 ${colors.border} rounded-lg px-3`}>
              <AccordionTrigger className={`${colors.text} hover:no-underline`}>
                <div className="flex items-center gap-2">
                  <History className={`h-4 w-4 ${colors.accent}`} />
                  <span className="text-sm">3. Lịch sử & Theo dõi</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs space-y-2 pt-2">
                <p className={colors.accent}>📚 Sidebar lịch sử đầy đủ:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li><strong>🔍 Tìm kiếm nhanh</strong>: Search theo date, ship type, AI model</li>
                  <li><strong>⭐ Yêu thích</strong>: Bookmark predictions quan trọng</li>
                  <li><strong>🗑️ Quản lý</strong>: Xóa, archive predictions cũ</li>
                  <li><strong>📊 Filter</strong>: Lọc theo loại tàu, model, date range</li>
                  <li><strong>📥 Export</strong>: Download lịch sử dạng CSV/JSON</li>
                  <li><strong>🔄 Sync</strong>: Đồng bộ cloud với Supabase (optional)</li>
                </ul>

                <div className={`${colors.bgSecondary} border ${colors.border} rounded p-2 mt-2`}>
                  <p className={colors.accent}>📊 <strong>Statistics Dashboard</strong>:</p>
                  <ul className="list-disc ml-5 space-y-1 mt-1">
                    <li>Tổng số predictions đã thực hiện</li>
                    <li>AI model usage distribution</li>
                    <li>Average fuel consumption theo ship type</li>
                    <li>Cost savings từ optimizations</li>
                    <li>Most active time periods</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 4. Training Data & Models */}
            <AccordionItem value="training" className={`border-2 ${colors.border} rounded-lg px-3`}>
              <AccordionTrigger className={`${colors.text} hover:no-underline`}>
                <div className="flex items-center gap-2">
                  <Database className={`h-4 w-4 ${colors.accent}`} />
                  <span className="text-sm">4. Training Data & Models</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs space-y-2 pt-2">
                <p className={colors.accent}>🗄️ Quản lý Training Data:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li><strong>View datasets</strong>: Xem training data với 7 features</li>
                  <li><strong>Upload CSV/Excel</strong>: Import data mới cho training</li>
                  <li><strong>Data validation</strong>: Tự động kiểm tra quality, missing values</li>
                  <li><strong>Data cleaning</strong>: Remove outliers, normalize features</li>
                  <li><strong>Feature engineering</strong>: Tạo derived features tự động</li>
                </ul>

                <p className={colors.accent}>🎓 Model Training & Versioning:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li><strong>Retrain models</strong>: Train lại với data mới</li>
                  <li><strong>Version control</strong>: Track model versions (v1.0, v1.1...)</li>
                  <li><strong>A/B testing</strong>: So sánh versions trên validation set</li>
                  <li><strong>Performance tracking</strong>: MAE, RMSE, R² cho mỗi version</li>
                  <li><strong>Rollback</strong>: Quay về version cũ nếu cần</li>
                </ul>

                <div className={`${colors.bgSecondary} border ${colors.border} rounded p-2 mt-2`}>
                  <p className={colors.accent}>🔬 <strong>Data Quality Metrics</strong>:</p>
                  <ul className="list-disc ml-5 space-y-1 mt-1">
                    <li>Missing values percentage</li>
                    <li>Outlier detection & handling</li>
                    <li>Feature correlation matrix</li>
                    <li>Data distribution analysis</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 5. Settings & Customization */}
            <AccordionItem value="settings" className={`border-2 ${colors.border} rounded-lg px-3`}>
              <AccordionTrigger className={`${colors.text} hover:no-underline`}>
                <div className="flex items-center gap-2">
                  <Settings2 className={`h-4 w-4 ${colors.accent}`} />
                  <span className="text-sm">5. Cài đặt & Tùy chỉnh</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs space-y-2 pt-2">
                <p className={colors.accent}>🎨 Theme Customization:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li><strong>Default theme</strong>: #2002a6 (dark) / #e3d5f7 (light)</li>
                  <li><strong>14 preset themes</strong>: Pink, Blue, Purple, Ocean, Sunset, Emerald...</li>
                  <li><strong>Custom RGB picker</strong>: Tùy chỉnh màu chủ đạo hoàn toàn</li>
                  <li><strong>Dark/Light mode</strong>: Auto-adjust brightness</li>
                  <li><strong>Glass effects</strong>: Modern SaaS style (Notion/Linear)</li>
                  <li><strong>Logo brightness</strong>: Tự động điều chỉnh theo theme</li>
                </ul>

                <p className={colors.accent}>⚙️ General Settings:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li><strong>Font size</strong>: Small, Medium, Large</li>
                  <li><strong>Language</strong>: Vietnamese, English</li>
                  <li><strong>Notifications</strong>: Toast với swipe-to-dismiss</li>
                  <li><strong>Auto-save</strong>: Tự động lưu predictions</li>
                  <li><strong>Default AI model</strong>: Chọn model ưa thích</li>
                </ul>

                <p className={colors.accent}>🔔 Toast Notifications:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li><strong>Swipe to dismiss</strong>: Gạt ngang để xóa</li>
                  <li>Success, Error, Warning, Info types</li>
                  <li>Auto-dismiss sau 5s (customizable)</li>
                  <li>Stack multiple toasts</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          <div className={`mt-4 p-3 ${colors.bgSecondary} border-2 ${colors.border} rounded-lg`}>
            <p className={`text-xs ${colors.accent}`}>
              💬 Cần hỗ trợ thêm? Hãy sử dụng form phân tích, chat text, hoặc liên hệ admin!
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

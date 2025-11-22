import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { GitCompare, Fuel, Ship, X, ArrowLeft, Download, Maximize2, Minimize2, Activity, Waves, Wind, Thermometer, Anchor, Sparkles, TrendingDown, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import type { ThemeColor, Language } from '../App';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { motion } from 'motion/react';
import { t, getFeatureName } from '../utils/translations';
import { chatService, ComparisonAnalysisResponse } from '../services/api/chat';

interface HistoryItem {
  timestamp: Date;
  query: string;
  analysis: {
    fuelConsumption: number;
    fuelConsumptionTons: number;
    estimatedCost: number;
    efficiency: number;
    avgConsumptionRate: number;
    recommendation: string;
  };
  vesselInfo: {
    type: string;
    speedCalc: number;
    distance: number;
    datetime: string;
  };
  inputFeatures?: {
    Ship_SpeedOverGround: number;
    Weather_WindSpeed10M: number;
    Weather_WaveHeight: number;
    Weather_WavePeriod: number;
    Environment_SeaFloorDepth: number;
    Weather_Temperature2M: number;
    Weather_OceanCurrentVelocity: number;
  };
  prediction?: {
    Total_MomentaryFuel: number;
  };
}

interface ComparisonDashboardProps {
  themeColor: ThemeColor;
  isDarkMode: boolean;
  customColor?: string;
  language: Language;
  dashboardHistory: HistoryItem[];
  onBack: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export default function ComparisonDashboard({ themeColor, isDarkMode, customColor, language, dashboardHistory, onBack, isFullscreen = false, onToggleFullscreen }: ComparisonDashboardProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [llmAnalysis, setLlmAnalysis] = useState<{
    overview?: string;
    optimal?: { name?: string; fuel?: number | string; reason?: string };
    factors?: string[];
    actions?: string[];
    notes?: string[];
    raw_text?: string;
  } | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState<boolean>(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Get colors based on theme
  const getColors = () => {
    if (themeColor === 'custom' && customColor) {
      return {
        primary: customColor,
        secondary: customColor + '80',
        bg: isDarkMode ? 'bg-[#0f0f0f]' : 'bg-white',
        card: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white',
        cardBg: isDarkMode ? 'bg-[#252525]' : 'bg-gray-50',
        text: isDarkMode ? 'text-white' : 'text-[#1a1a1a]',
        textSecondary: isDarkMode ? 'text-[#b0b0b0]' : 'text-[#666]',
        border: `border-[${customColor}]`,
        borderHex: customColor,
        accent: isDarkMode ? 'text-white' : 'text-[#1a1a1a]',
      };
    }
    
    const baseColor = isDarkMode ? '#8b5cf6' : '#2002a6';
    return {
      primary: baseColor,
      secondary: isDarkMode ? '#8b5cf680' : '#2002a680',
      bg: isDarkMode ? 'bg-[#0f0f0f]' : 'bg-white',
      card: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white',
      cardBg: isDarkMode ? 'bg-[#252525]' : 'bg-gray-50',
      text: isDarkMode ? 'text-white' : 'text-[#1a1a1a]',
      textSecondary: isDarkMode ? 'text-[#b0b0b0]' : 'text-[#666]',
      border: isDarkMode ? 'border-[#8b5cf6]' : 'border-[#2002a6]',
      borderHex: baseColor,
      accent: isDarkMode ? 'text-white' : 'text-[#1a1a1a]',
    };
  };

  const colors = getColors();

  const getHistoryFuel = (item: HistoryItem): number | null => {
    const fromAnalysis = item.analysis?.fuelConsumption;
    if (typeof fromAnalysis === 'number' && Number.isFinite(fromAnalysis)) {
      return fromAnalysis;
    }
    const fromPrediction = item.prediction?.Total_MomentaryFuel;
    if (typeof fromPrediction === 'number' && Number.isFinite(fromPrediction)) {
      return fromPrediction * 3600;
    }
    return null;
  };

  const getFuelValue = (data: { fuelConsumptionKg?: number; Total_MomentaryFuel?: number }) => {
    if (typeof data.fuelConsumptionKg === 'number' && Number.isFinite(data.fuelConsumptionKg)) {
      return data.fuelConsumptionKg;
    }
    if (typeof data.Total_MomentaryFuel === 'number' && Number.isFinite(data.Total_MomentaryFuel)) {
      return data.Total_MomentaryFuel * 3600;
    }
    return null;
  };

  const formatFuelDisplay = (value?: number | null, digits = 2) => {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return 'N/A';
    }
    return value >= 100 ? value.toFixed(1) : value.toFixed(digits);
  };

  const formatMaybeNumber = (value: any, suffix = '') => {
    const num = Number(value);
    if (Number.isFinite(num)) return `${num.toFixed(3)}${suffix}`;
    return String(value ?? '');
  };

  const buildLocalAnalysis = (data: typeof comparisonData) => {
    if (!data.length) return null;
    const fuelVals = data
      .map(getFuelValue)
      .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
    const minIdx = data.reduce(
      (acc, cur, idx) => {
        const val = getFuelValue(cur);
        if (typeof val === 'number' && Number.isFinite(val) && val < acc.val) {
          return { idx, val };
        }
        return acc;
      },
      { idx: 0, val: Number.POSITIVE_INFINITY }
    ).idx;
    const optimal = data[minIdx];
    const overview =
      language === 'vi'
        ? `Tìm thấy ${data.length} phương án, ${optimal?.name || '#1'} có mức tiêu thụ thấp nhất.`
        : `Found ${data.length} options, ${optimal?.name || '#1'} has the lowest fuel usage.`;
    const actions =
      language === 'vi'
        ? [
            'Giữ tốc độ ổn định và theo dõi gió/sóng để tránh dao động tiêu thụ.',
            'Ưu tiên hành trình khi gió và sóng thấp để giảm tiêu thụ nhiên liệu.',
          ]
        : [
            'Keep speed steady and monitor wind/wave to avoid spikes.',
            'Prefer voyages when wind and wave are low to save fuel.',
          ];
    return {
      overview,
      optimal: {
        name: optimal?.name,
        fuel: formatMaybeNumber(getFuelValue(optimal), ' kg/s'),
        reason:
          language === 'vi'
            ? 'Mức tiêu thụ thấp nhất trong các lựa chọn.'
            : 'Lowest consumption among options.',
      },
      actions,
    };
  };

  // Toggle selection
  const toggleSelection = (index: number) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter(i => i !== index));
    } else {
      if (selectedItems.length >= 5) {
        toast.error('Tối đa 5 predictions để so sánh!');
        return;
      }
      setSelectedItems([...selectedItems, index]);
    }
  };

  // Clear all selections
  const handleClearSelection = () => {
    setSelectedItems([]);
    toast.info('Đã bỏ chọn tất cả');
  };

  // Handle Export
  const handleExport = () => {
    const originalTitle = document.title;
    document.title = `Fluxmare-Comparison-${new Date().toISOString().slice(0,10)}`;
    
    toast.info('Print Comparison', {
      id: 'export',
      description: 'Dashboard so sánh sẽ print full trang',
      duration: 4000,
    });
    
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);
    }, 300);
  };

  // Generate mock features nếu không có
  const generateMockFeatures = (index: number) => ({
    Ship_SpeedOverGround: 10 + Math.random() * 5,
    Weather_WindSpeed10M: 5 + Math.random() * 10,
    Weather_WaveHeight: 1 + Math.random() * 3,
    Weather_WavePeriod: 5 + Math.random() * 5,
    Environment_SeaFloorDepth: 50 + Math.random() * 100,
    Weather_Temperature2M: 15 + Math.random() * 10,
    Weather_OceanCurrentVelocity: 0.5 + Math.random() * 2,
  });

  const generateMockPrediction = () => ({
    Total_MomentaryFuel: 0.5 + Math.random() * 1.5,
  });

  // Transform data for comparison
  const comparisonData = selectedItems.map(index => {
    const item = dashboardHistory[index];
    const features = item.inputFeatures || generateMockFeatures(index);
    const prediction = item.prediction || generateMockPrediction();
    const fuelConsumptionKg = getHistoryFuel(item);
    const totalMomentary =
      typeof prediction.Total_MomentaryFuel === 'number'
        ? prediction.Total_MomentaryFuel
        : typeof fuelConsumptionKg === 'number'
        ? fuelConsumptionKg / 3600
        : null;
    
    return {
      name: `#${dashboardHistory.length - index}`,
      historyIndex: index,
      ...features,
      Total_MomentaryFuel: totalMomentary,
      fuelConsumptionKg,
      timestamp: new Date(item.timestamp).toLocaleString('vi-VN', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };
  });

  // Gọi LLM backend để sinh phân tích cho các phương án được chọn
  useEffect(() => {
    const fetchAnalysis = async () => {
      if (comparisonData.length < 2) {
        setLlmAnalysis(null);
        return;
      }

      setAnalysisLoading(true);
      try {
        const payload = {
          language,
          items: comparisonData.map((item) => ({
            name: item.name,
            features: {
              Ship_SpeedOverGround: item.Ship_SpeedOverGround,
              Weather_WindSpeed10M: item.Weather_WindSpeed10M,
              Weather_WaveHeight: item.Weather_WaveHeight,
              Weather_WavePeriod: item.Weather_WavePeriod,
              Environment_SeaFloorDepth: item.Environment_SeaFloorDepth,
              Weather_Temperature2M: item.Weather_Temperature2M,
              Weather_OceanCurrentVelocity: item.Weather_OceanCurrentVelocity,
            },
            ship_type:
              (item.historyIndex !== undefined && dashboardHistory[item.historyIndex]?.vesselInfo?.type) ||
              (item as any)?.ship_type ||
              null,
            fuel_consumption_kg: getFuelValue(item),
          })),
        };

        const response: ComparisonAnalysisResponse = await chatService.getComparisonAnalysis(payload);
        const parsed = (response && typeof response.analysis === 'object') ? response.analysis : null;
        setLlmAnalysis(parsed || { raw_text: response?.raw_text || '' });
      } catch (err) {
        console.error(err);
        toast.error(language === 'vi' ? 'Không thể gọi LLM phân tích' : 'Failed to get LLM analysis');
        setLlmAnalysis(buildLocalAnalysis(comparisonData));
      } finally {
        setAnalysisLoading(false);
      }
    };

    fetchAnalysis();
  }, [selectedItems, language]); // eslint-disable-line react-hooks/exhaustive-deps

  // Feature labels mapping
  const featureLabels: Record<string, string> = {
    Ship_SpeedOverGround: `${getFeatureName('Speed', language)} (kn)`,
    Weather_WindSpeed10M: `${getFeatureName('Wind', language)} (m/s)`,
    Weather_WaveHeight: `${getFeatureName('Wave', language)} (m)`,
    Weather_WavePeriod: `${getFeatureName('Period', language)} (s)`,
    Environment_SeaFloorDepth: `${getFeatureName('Depth', language)} (m)`,
    Weather_Temperature2M: `${getFeatureName('Temp', language)} (°C)`,
    Weather_OceanCurrentVelocity: `${getFeatureName('Current', language)} (m/s)`,
  };

  // Prepare data for 7 features bar chart
  const featuresBarData = [
    { feature: getFeatureName('Speed', language), key: 'Ship_SpeedOverGround', icon: Ship },
    { feature: getFeatureName('Wind', language), key: 'Weather_WindSpeed10M', icon: Wind },
    { feature: getFeatureName('Wave', language), key: 'Weather_WaveHeight', icon: Waves },
    { feature: getFeatureName('Period', language), key: 'Weather_WavePeriod', icon: Activity },
    { feature: getFeatureName('Depth', language), key: 'Environment_SeaFloorDepth', icon: Anchor },
    { feature: getFeatureName('Temp', language), key: 'Weather_Temperature2M', icon: Thermometer },
    { feature: getFeatureName('Current', language), key: 'Weather_OceanCurrentVelocity', icon: Waves },
  ].map(f => {
    const result: any = { feature: f.feature };
    comparisonData.forEach((data, idx) => {
      result[`pred${idx + 1}`] = data[f.key as keyof typeof data];
    });
    return result;
  });

  // Radar chart data for feature comparison
  const radarData = comparisonData.length > 0 ? [
    { feature: getFeatureName('Speed', language), ...Object.fromEntries(comparisonData.map((d, i) => [`pred${i}`, (d.Ship_SpeedOverGround / 15) * 100])) },
    { feature: getFeatureName('Wind', language), ...Object.fromEntries(comparisonData.map((d, i) => [`pred${i}`, (d.Weather_WindSpeed10M / 15) * 100])) },
    { feature: getFeatureName('Wave', language), ...Object.fromEntries(comparisonData.map((d, i) => [`pred${i}`, (d.Weather_WaveHeight / 4) * 100])) },
    { feature: getFeatureName('Period', language), ...Object.fromEntries(comparisonData.map((d, i) => [`pred${i}`, (d.Weather_WavePeriod / 10) * 100])) },
    { feature: getFeatureName('Depth', language), ...Object.fromEntries(comparisonData.map((d, i) => [`pred${i}`, (d.Environment_SeaFloorDepth / 150) * 100])) },
    { feature: getFeatureName('Temp', language), ...Object.fromEntries(comparisonData.map((d, i) => [`pred${i}`, (d.Weather_Temperature2M / 25) * 100])) },
    { feature: 'Current', ...Object.fromEntries(comparisonData.map((d, i) => [`pred${i}`, (d.Weather_OceanCurrentVelocity / 2.5) * 100])) },
  ] : [];

  // Colors for multiple predictions
  const predictionColors = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6'];

  // Find optimal prediction (lowest fuel consumption)
  const findOptimalPrediction = () => {
    if (comparisonData.length === 0) return null;
    
    let minFuel = Infinity;
    let optimalIndex = -1;
    
    comparisonData.forEach((data, idx) => {
      const val =
        typeof data.Total_MomentaryFuel === 'number' && Number.isFinite(data.Total_MomentaryFuel)
          ? data.Total_MomentaryFuel
          : typeof data.fuelConsumptionKg === 'number'
          ? data.fuelConsumptionKg / 3600
          : Infinity;
      if (val < minFuel) {
        minFuel = val;
        optimalIndex = idx;
      }
    });
    
    if (optimalIndex === -1) return null;
    
    const optimal = comparisonData[optimalIndex];
    const historyIndex = selectedItems[optimalIndex];
    
    return {
      index: optimalIndex,
      data: optimal,
      historyIndex: historyIndex,
      analysis: generateAIAnalysis(optimal, comparisonData)
    };
  };

  // Generate AI analysis summary (RAG-style)
  
  // Generate AI analysis summary (RAG-style)
  
  
  // Generate AI analysis summary (RAG-style)
  const generateAIAnalysis = (optimal: any, allData: any[]) => {
    const fuelValuesKg = allData
      .map(getFuelValue)
      .filter((value): value is number => value !== null);

    const optimalFuelKg = getFuelValue(optimal);
    const optimalFuelPerSec =
      typeof optimal?.Total_MomentaryFuel === 'number' && Number.isFinite(optimal.Total_MomentaryFuel)
        ? optimal.Total_MomentaryFuel
        : typeof optimalFuelKg === 'number'
        ? optimalFuelKg / 3600
        : null;

    if (!fuelValuesKg.length || optimalFuelKg === null) {
      return language === 'vi'
        ? 'Chưa có dữ liệu tiêu thụ nhiên liệu để so sánh.'
        : 'No fuel consumption data available for comparison.';
    }

    const avgFuelKg = fuelValuesKg.reduce((sum, val) => sum + val, 0) / fuelValuesKg.length;
    const fuelSavingPercent =
      avgFuelKg > 0 ? ((avgFuelKg - optimalFuelKg) / avgFuelKg * 100).toFixed(1) : '0';
    const maxFuelKg = Math.max(...fuelValuesKg);
    const fuelDisplay = typeof optimalFuelPerSec === 'number' ? optimalFuelPerSec : optimalFuelKg / 3600;

    const envFactors: string[] = [];

    if (typeof optimal.Ship_SpeedOverGround === 'number') {
      envFactors.push(`tốc độ ${optimal.Ship_SpeedOverGround.toFixed(2)} m/s`);
    }
    if (typeof optimal.Weather_WaveHeight === 'number') {
      envFactors.push(`sóng ${optimal.Weather_WaveHeight.toFixed(2)} m`);
    }
    if (typeof optimal.Weather_WindSpeed10M === 'number') {
      envFactors.push(`gió ${optimal.Weather_WindSpeed10M.toFixed(2)} m/s`);
    }
    if (typeof optimal.Weather_OceanCurrentVelocity === 'number') {
      envFactors.push(`dòng chảy ${optimal.Weather_OceanCurrentVelocity.toFixed(2)} m/s`);
    }

    const recommendation = `Để tối ưu hóa hiệu suất, hãy ưu tiên các điều kiện tương tự như ${optimal.name} — đặc biệt là duy trì tốc độ trong khoảng ${(optimal.Ship_SpeedOverGround - 0.5).toFixed(1)}-${(optimal.Ship_SpeedOverGround + 0.5).toFixed(1)} m/s khi điều kiện thời tiết cho phép.`;

    return {
      overview: `Dựa trên phân tích ${allData.length} predictions, ${optimal.name} có mức tiêu thụ nhiên liệu tối ưu nhất ở mức ${(fuelDisplay || 0).toFixed(3)} kg/s, thấp hơn trung bình ${fuelSavingPercent}% và tiết kiệm so với mức cao nhất ${(maxFuelKg / 3600).toFixed(3)} kg/s.`,
      optimal: {
        name: optimal.name,
        fuel: (fuelDisplay || 0).toFixed(3),
      },
      factors: envFactors,
      actions: [recommendation],
    };
  };

const optimalPrediction = findOptimalPrediction();

  return (
    <div className={`h-full overflow-hidden flex flex-col ${colors.bg}`}>
      {/* Header */}
      <motion.div 
        className={`p-4 border-b-2 ${colors.border} flex items-center justify-between flex-shrink-0`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-3">
          <Button
            onClick={onBack}
            size="sm"
            variant="outline"
            className={`h-7 text-xs border-2 ${colors.border}`}
            style={themeColor === 'custom' ? { borderColor: colors.borderHex + '80' } : {}}
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Quay lại
          </Button>
        </div>

        <div className="flex gap-2">
          {onToggleFullscreen && (
            <Button
              onClick={onToggleFullscreen}
              size="sm"
              variant="outline"
              className={`h-7 text-xs border-2 ${colors.border}`}
              style={themeColor === 'custom' ? { borderColor: colors.borderHex + '80' } : {}}
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-3 w-3 mr-1" />
                  Thu nhỏ
                </>
              ) : (
                <>
                  <Maximize2 className="h-3 w-3 mr-1" />
                  Fullscreen
                </>
              )}
            </Button>
          )}
          
          <Button
            onClick={handleExport}
            size="sm"
            variant="outline"
            className={`h-7 text-xs border-2 ${colors.border}`}
            style={themeColor === 'custom' ? { borderColor: colors.borderHex + '80' } : {}}
            disabled={selectedItems.length === 0}
          >
            <Download className="h-3 w-3 mr-1" />
            Print/PDF
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left: History Selection */}
        <motion.div 
          className={`w-80 border-r-2 ${colors.border} flex flex-col flex-shrink-0`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className={`p-3 border-b ${colors.border} flex items-center justify-between`}>
            <h3 className={`text-sm ${colors.text}`}>{t('dashboardHistoryTitle', language)} ({dashboardHistory.length})</h3>
            {selectedItems.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearSelection}
                className="h-6 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                {language === 'vi' ? 'Bỏ chọn' : 'Deselect'}
              </Button>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {dashboardHistory.map((item, index) => {
                const features = item.inputFeatures || generateMockFeatures(index);
                const fuelConsumptionKg = getHistoryFuel(item);
                
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedItems.includes(index)
                        ? `${colors.border} ${colors.cardBg}`
                        : `border-gray-300 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} hover:border-gray-400`
                    }`}
                    onClick={() => toggleSelection(index)}
                  >
                    <div className="flex items-start gap-2">
                      <Checkbox
                        checked={selectedItems.includes(index)}
                        onCheckedChange={() => toggleSelection(index)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs ${colors.text}`}>#{dashboardHistory.length - index}</span>
                          <span className={`text-[10px] ${isDarkMode ? 'text-[#888]' : 'text-gray-500'}`}>
                            {new Date(item.timestamp).toLocaleString('vi-VN', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className={`text-[10px] truncate mb-2 ${colors.text}`} title={item.query}>
                          {item.query}
                        </p>
                        <div className={`grid grid-cols-2 gap-1 text-[9px] ${colors.textSecondary}`}>
                          <div>
                            <Fuel className="h-2 w-2 inline mr-1" />
                            {formatFuelDisplay(fuelConsumptionKg, 3)} kg
                          </div>
                          <div>
                            <Ship className="h-2 w-2 inline mr-1" />
                            {features.Ship_SpeedOverGround.toFixed(1)} kn
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {dashboardHistory.length === 0 && (
                <div className={`text-center py-8 ${colors.textSecondary}`}>
                  <Ship className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">{language === 'vi' ? 'Chưa có lịch sử dashboard' : 'No dashboard history'}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </motion.div>

        {/* Right: Comparison Dashboard */}
        <div className="flex-1 overflow-y-auto">
          {selectedItems.length === 0 ? (
            <div className={`flex flex-col items-center justify-center h-full ${colors.textSecondary}`}>
              <GitCompare className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-sm">{language === 'vi' ? 'Chọn ít nhất 1 dự đoán để so sánh' : 'Select at least 1 prediction to compare'}</p>
              <p className="text-xs mt-1">{language === 'vi' ? 'Tối đa 5 dự đoán' : 'Maximum 5 predictions'}</p>
            </div>
          ) : (
            <div 
              ref={dashboardRef}
              data-print-dashboard
              className="p-4 space-y-4"
            >
              {/* Print Header */}
              <div className="hidden print:block mb-4 border-b-2 pb-2 print:!border-gray-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Ship className="h-5 w-5 print:!text-gray-800" />
                      <h1 className="print:!text-gray-900">Fluxmare Feature Comparison</h1>
                    </div>
                    <p className="text-xs print:!text-gray-600 mt-1">{language === 'vi' ? `So sánh ${selectedItems.length} dự đoán — 7 Thông Số + 1 Nhãn` : `Compare ${selectedItems.length} predictions — 7 Features + 1 Label`}</p>
                  </div>
                  <div className="text-xs print:!text-gray-600">
                    {new Date().toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>

              {/* Fuel Consumption Comparison */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className={`border-2 ${colors.border} ${colors.card}`}>
                  <CardHeader className={`${colors.cardBg} p-3`}>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Fuel className="h-4 w-4" />
                      {t('fuelConsumption', language)} (kg)
                    </CardTitle>
                    <p className={`text-[10px] ${isDarkMode ? 'text-[#9ca3af]' : 'text-gray-600'} mt-0.5`}>
                      {language === 'vi' ? 'Kết quả dự đoán tiêu thụ nhiên liệu tức thời' : 'Fuel consumption captured from dashboard history'}
                    </p>
                  </CardHeader>
                  <CardContent className="p-3">
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis 
                          dataKey="name" 
                          stroke={isDarkMode ? "#e5e5e5" : "#1a1a1a"} 
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis 
                          stroke={isDarkMode ? "#e5e5e5" : "#1a1a1a"} 
                          tick={{ fontSize: 10 }}
                          width={40}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDarkMode ? '#1a1a1a' : '#fff', 
                            border: `1px solid ${colors.primary}`,
                            fontSize: '10px',
                            padding: '6px 10px'
                          }}
                          formatter={(value: number) => [`${formatFuelDisplay(value, 3)} kg`, t('fuelConsumption', language)]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="fuelConsumptionKg" 
                          stroke={colors.primary} 
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: colors.primary }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

                            {/* AI Recommendation — Optimal Prediction + LLM Analysis */}
              {optimalPrediction && comparisonData.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.22 }}
                >
                  <Card className={`border-2 ${isDarkMode ? 'border-green-500' : 'border-green-600'} ${colors.card}`}>
                    <CardHeader className={`${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'} p-3`}>
                      <CardTitle className={`text-base flex items-center gap-2 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        {language === 'vi' ? 'Fluxmare Phân tích' : 'Analysis by Fluxmare '}
                      </CardTitle>
                      <p className={`text-[11px] ${isDarkMode ? 'text-green-300/70' : 'text-green-600/80'} mt-0.5`}>
                        {t('aiOptimization', language)}
                      </p>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'} flex-shrink-0 self-start mt-1`}>
                          <TrendingDown className={`h-5 w-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                        </div>
                        <div className="flex-1 min-w-0 space-y-3">
                          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#0a1f0a]' : 'bg-white'} border ${isDarkMode ? 'border-green-500/30' : 'border-green-200'}`}>
                            <div className={`text-sm ${colors.text} leading-relaxed`}>
                              <strong className={isDarkMode ? 'text-green-200' : 'text-green-700'}>
                                {language === 'vi' ? 'Tối ưu: ' : 'Optimal: '}
                              </strong>
                              {llmAnalysis?.optimal?.name || optimalPrediction.data.name} — {llmAnalysis?.optimal?.fuel || formatMaybeNumber(optimalPrediction.data.Total_MomentaryFuel || optimalPrediction.data.fuelConsumptionKg, ' kg/s')}
                            </div>
                          </div>

                          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-green-500/40 bg-green-950/30' : 'border-green-200 bg-green-50'} shadow-sm`}>
                            {analysisLoading ? (
                              <div className="flex items-center gap-2 text-sm">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {language === 'vi' ? 'Đang phân tích...' : 'Analyzing...'}
                              </div>
                            ) : llmAnalysis ? (
                              <div className="space-y-3 text-sm leading-relaxed">
                                {llmAnalysis.overview && (
                                  <div>
                                    <p className={`font-semibold ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                                      {language === 'vi' ? 'Tổng quan:' : 'Overview:'}
                                    </p>
                                    <p className={colors.text}>{llmAnalysis.overview}</p>
                                  </div>
                                )}

                                {llmAnalysis.optimal && (
                                  <div>
                                    <p className={`font-semibold ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                                      {language === 'vi' ? 'Tối ưu:' : 'Optimal:'}
                                    </p>
                                    <p className={colors.text}>
                                      {llmAnalysis.optimal.name && <strong>{llmAnalysis.optimal.name}</strong>} — {typeof llmAnalysis.optimal.fuel !== 'undefined' ? formatMaybeNumber(llmAnalysis.optimal.fuel, ' kg/s') : ''}
                                      {llmAnalysis.optimal.reason && <> — {llmAnalysis.optimal.reason}</>}
                                    </p>
                                  </div>
                                )}

                                {llmAnalysis.factors && llmAnalysis.factors.length > 0 && (
                                  <div>
                                    <p className={`font-semibold ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                                      {language === 'vi' ? 'Yếu tố chính:' : 'Key factors:'}
                                    </p>
                                    <div className="space-y-1 ml-2">
                                      {llmAnalysis.factors.map((f, idx) => (
                                        <div key={idx} className={`flex items-start gap-2 ${colors.text}`}>
                                          <span className="text-green-500">•</span>
                                          <span>{f}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {llmAnalysis.actions && llmAnalysis.actions.length > 0 && (
                                  <div>
                                    <p className={`font-semibold ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                                      {language === 'vi' ? 'Hành động khuyến nghị:' : 'Recommended actions:'}
                                    </p>
                                    <div className="space-y-1 ml-2">
                                      {llmAnalysis.actions.map((a, idx) => (
                                        <div key={idx} className={`flex items-start gap-2 ${colors.text}`}>
                                          <span className="text-green-500">•</span>
                                          <span>{a}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {llmAnalysis.notes && llmAnalysis.notes.length > 0 && (
                                  <div>
                                    <p className={`font-semibold ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                                      {language === 'vi' ? 'Ghi chú:' : 'Notes:'}
                                    </p>
                                    <div className="space-y-1 ml-2">
                                      {llmAnalysis.notes.map((n, idx) => (
                                        <div key={idx} className={`flex items-start gap-2 ${colors.text}`}>
                                          <span className="text-green-500">•</span>
                                          <span>{n}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {!llmAnalysis.overview && !llmAnalysis.optimal && !llmAnalysis.factors && !llmAnalysis.actions && llmAnalysis.raw_text && (
                                  <pre className={`text-sm whitespace-pre-wrap ${colors.text}`}>
                                    {llmAnalysis.raw_text}
                                  </pre>
                                )}
                              </div>
                            ) : (
                              <p className={`text-sm ${colors.textSecondary}`}>
                                {language === 'vi'
                                  ? 'Chọn ít nhất 1 phương án để xem phân tích từ LLM.'
                                  : 'Select at least one option to get LLM insights.'}
                              </p>
                            )}
                          </div>

                          <div className={`flex items-center gap-2 text-[11px] ${isDarkMode ? 'text-green-400/60' : 'text-green-600/70'} italic mt-3`}>
                            <Sparkles className="h-3 w-3" />
                            <span>{t('poweredBy', language)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Detailed Features Table */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
                <Card className={`border-2 ${colors.border} ${colors.card}`}>
                  <CardHeader className={`${colors.cardBg} p-3`}>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Ship className="h-4 w-4" />
                      {t('inputFeaturesDetail', language)}
                    </CardTitle>
                    <p className={`text-[10px] ${isDarkMode ? 'text-[#9ca3af]' : 'text-gray-600'} mt-0.5`}>
                      {t('comparisonTable', language)}
                    </p>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className={`border-b ${isDarkMode ? 'border-[#3a3a3a]' : 'border-gray-300'}`}>
                            <th className={`text-left py-2 pr-3 ${colors.text}`}>{language === 'vi' ? 'Thông số' : 'Feature'}</th>
                            {comparisonData.map((data, idx) => (
                              <th key={idx} className={`text-right py-2 px-2 ${colors.text}`}>
                                {data.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className={`border-b ${isDarkMode ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
                            <td className={`py-2.5 pr-3 ${colors.text}`}>
                              <Ship className="h-3 w-3 inline mr-1" />
                              {getFeatureName('Speed', language)} (kn)
                            </td>
                            {comparisonData.map((data, idx) => (
                              <td key={idx} className={`text-right py-2.5 px-2 font-mono ${colors.text}`}>
                                {data.Ship_SpeedOverGround.toFixed(2)}
                              </td>
                            ))}
                          </tr>
                          <tr className={`border-b ${isDarkMode ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
                            <td className={`py-2.5 pr-3 ${colors.text}`}>
                              <Wind className="h-3 w-3 inline mr-1" />
                              {getFeatureName('Wind', language)} (m/s)
                            </td>
                            {comparisonData.map((data, idx) => (
                              <td key={idx} className={`text-right py-2.5 px-2 font-mono ${colors.text}`}>
                                {data.Weather_WindSpeed10M.toFixed(2)}
                              </td>
                            ))}
                          </tr>
                          <tr className={`border-b ${isDarkMode ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
                            <td className={`py-2.5 pr-3 ${colors.text}`}>
                              <Waves className="h-3 w-3 inline mr-1" />
                              {getFeatureName('Wave', language)} (m)
                            </td>
                            {comparisonData.map((data, idx) => (
                              <td key={idx} className={`text-right py-2.5 px-2 font-mono ${colors.text}`}>
                                {data.Weather_WaveHeight.toFixed(2)}
                              </td>
                            ))}
                          </tr>
                          <tr className={`border-b ${isDarkMode ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
                            <td className={`py-2.5 pr-3 ${colors.text}`}>
                              <Activity className="h-3 w-3 inline mr-1" />
                              {getFeatureName('Period', language)} (s)
                            </td>
                            {comparisonData.map((data, idx) => (
                              <td key={idx} className={`text-right py-2.5 px-2 font-mono ${colors.text}`}>
                                {data.Weather_WavePeriod.toFixed(2)}
                              </td>
                            ))}
                          </tr>
                          <tr className={`border-b ${isDarkMode ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
                            <td className={`py-2.5 pr-3 ${colors.text}`}>
                              <Anchor className="h-3 w-3 inline mr-1" />
                              {getFeatureName('Depth', language)} (m)
                            </td>
                            {comparisonData.map((data, idx) => (
                              <td key={idx} className={`text-right py-2.5 px-2 font-mono ${colors.text}`}>
                                {data.Environment_SeaFloorDepth.toFixed(1)}
                              </td>
                            ))}
                          </tr>
                          <tr className={`border-b ${isDarkMode ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
                            <td className={`py-2.5 pr-3 ${colors.text}`}>
                              <Thermometer className="h-3 w-3 inline mr-1" />
                              {getFeatureName('Temp', language)} (°C)
                            </td>
                            {comparisonData.map((data, idx) => (
                              <td key={idx} className={`text-right py-2.5 px-2 font-mono ${colors.text}`}>
                                {data.Weather_Temperature2M.toFixed(1)}
                              </td>
                            ))}
                          </tr>
                          <tr className={`border-b ${isDarkMode ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
                            <td className={`py-2.5 pr-3 ${colors.text}`}>
                              <Waves className="h-3 w-3 inline mr-1" />
                              {getFeatureName('Current', language)} (m/s)
                            </td>
                            {comparisonData.map((data, idx) => (
                              <td key={idx} className={`text-right py-2.5 px-2 font-mono ${colors.text}`}>
                                {data.Weather_OceanCurrentVelocity.toFixed(2)}
                              </td>
                            ))}
                          </tr>
                          <tr className={`${isDarkMode ? 'bg-[#1a1a2e]' : 'bg-blue-50'}`}>
                            <td className={`py-2.5 pr-3 ${colors.text}`}>
                              <Fuel className="h-3 w-3 inline mr-1" />
                              <strong>{t('fuelConsumption', language)} (kg)</strong>
                            </td>
                            {comparisonData.map((data, idx) => {
                              const isOptimal = optimalPrediction && optimalPrediction.index === idx;
                              return (
                                <td 
                                  key={idx} 
                                  className={`text-right py-2.5 px-2 font-mono ${
                                    isOptimal 
                                      ? (isDarkMode ? 'text-green-400' : 'text-green-700')
                                      : colors.text
                                  }`}
                                >
                                  <strong>
                                    {formatFuelDisplay(data.fuelConsumptionKg, 3)}
                                    {isOptimal && (
                                      <Sparkles className={`h-2.5 w-2.5 inline ml-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                                    )}
                                  </strong>
                                </td>
                              );
                            })}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

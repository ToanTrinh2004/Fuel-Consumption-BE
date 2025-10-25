import { Ship, Fuel, Wind, Waves, Thermometer, Anchor, Gauge, Activity, TrendingDown, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import type { Language } from '../App';
import { getFeatureName } from '../utils/translations';

interface PrintReportProps {
  data: {
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
    inputFeatures?: any;
    prediction?: any;
  };
  language: Language;
  vesselDisplayName: string;
}

export default function PrintReport({ data, language, vesselDisplayName }: PrintReportProps) {
  const { analysis, vesselInfo, query } = data;

  const inputFeatures = data.inputFeatures || {
    Ship_SpeedOverGround: vesselInfo.speedCalc || 12,
    Weather_WindSpeed10M: 8 + Math.random() * 7,
    Weather_WaveHeight: 1.5 + Math.random() * 2,
    Weather_WavePeriod: 6 + Math.random() * 4,
    Environment_SeaFloorDepth: 80 + Math.random() * 70,
    Weather_Temperature2M: 18 + Math.random() * 8,
    Weather_OceanCurrentVelocity: 0.8 + Math.random() * 1.7,
  };

  const prediction = data.prediction || {
    Total_MomentaryFuel: analysis.avgConsumptionRate / 3600 || 0.85,
  };

  const featuresBarData = [
    { feature: getFeatureName('Speed', language), value: inputFeatures.Ship_SpeedOverGround, unit: 'kn' },
    { feature: getFeatureName('Wind', language), value: inputFeatures.Weather_WindSpeed10M, unit: 'm/s' },
    { feature: getFeatureName('Wave', language), value: inputFeatures.Weather_WaveHeight, unit: 'm' },
    { feature: getFeatureName('WavePeriod', language), value: inputFeatures.Weather_WavePeriod, unit: 's' },
    { feature: getFeatureName('Depth', language), value: inputFeatures.Environment_SeaFloorDepth, unit: 'm' },
    { feature: getFeatureName('Temp', language), value: inputFeatures.Weather_Temperature2M, unit: '°C' },
    { feature: getFeatureName('Current', language), value: inputFeatures.Weather_OceanCurrentVelocity, unit: 'm/s' },
  ];

  // Normalize data for radar chart (0-100 scale)
  const radarData = [
    { 
      feature: getFeatureName('Speed', language), 
      value: Math.min(100, (inputFeatures.Ship_SpeedOverGround / 25) * 100) 
    },
    { 
      feature: getFeatureName('Wind', language), 
      value: Math.min(100, (inputFeatures.Weather_WindSpeed10M / 20) * 100) 
    },
    { 
      feature: getFeatureName('Wave', language), 
      value: Math.min(100, (inputFeatures.Weather_WaveHeight / 5) * 100) 
    },
    { 
      feature: getFeatureName('WavePeriod', language), 
      value: Math.min(100, (inputFeatures.Weather_WavePeriod / 15) * 100) 
    },
    { 
      feature: getFeatureName('Depth', language), 
      value: Math.min(100, (inputFeatures.Environment_SeaFloorDepth / 200) * 100) 
    },
    { 
      feature: getFeatureName('Temp', language), 
      value: Math.min(100, (inputFeatures.Weather_Temperature2M / 40) * 100) 
    },
    { 
      feature: getFeatureName('Current', language), 
      value: Math.min(100, (inputFeatures.Weather_OceanCurrentVelocity / 3) * 100) 
    },
  ];

  return (
    <div className="print-report hidden" data-print-report>
      {/* Page 1: Executive Summary */}
      <div className="print-page">
        {/* Header */}
        <div className="print-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ship className="w-8 h-8 text-gray-800" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">FLUXMARE</h1>
                <p className="text-xs text-gray-600">
                  {language === 'vi' ? 'Báo Cáo Dự Đoán Tiêu Thụ Nhiên Liệu' : 'Fuel Consumption Prediction Report'}
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-gray-600">
              <div>{new Date().toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
              <div>{new Date().toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</div>
            </div>
          </div>
        </div>

        <hr className="my-4 border-gray-300" />

        {/* Executive Summary */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Fuel className="w-5 h-5" />
            {language === 'vi' ? 'Tóm Tắt Kết Quả' : 'Executive Summary'}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                <Fuel className="w-3 h-3" />
                {language === 'vi' ? 'Dự Đoán Tiêu Thụ' : 'Predicted Consumption'}
              </div>
              <div className="text-2xl font-bold text-gray-900">{prediction.Total_MomentaryFuel.toFixed(3)} kg/s</div>
              <div className="text-xs text-gray-500 mt-1">
                {language === 'vi' ? 'Tiêu thụ tức thời' : 'Momentary fuel consumption'}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                {language === 'vi' ? 'Hiệu Suất' : 'Efficiency'}
              </div>
              <div className="text-2xl font-bold text-gray-900">{analysis.efficiency.toFixed(1)}%</div>
              <div className="text-xs text-gray-500 mt-1">
                {analysis.efficiency >= 75 
                  ? (language === 'vi' ? 'Tốt' : 'Good')
                  : analysis.efficiency >= 50 
                  ? (language === 'vi' ? 'Trung bình' : 'Average')
                  : (language === 'vi' ? 'Cần cải thiện' : 'Needs improvement')}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-600 mb-1">
                {language === 'vi' ? 'Tổng Nhiên Liệu' : 'Total Fuel'}
              </div>
              <div className="text-2xl font-bold text-gray-900">{analysis.fuelConsumption.toFixed(2)} kg</div>
              <div className="text-xs text-gray-500 mt-1">
                ≈ {analysis.fuelConsumptionTons.toFixed(3)} tons
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-600 mb-1">
                {language === 'vi' ? 'Chi Phí Ước Tính' : 'Estimated Cost'}
              </div>
              <div className="text-2xl font-bold text-gray-900">${analysis.estimatedCost.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">
                {language === 'vi' ? 'Đô la Mỹ' : 'US Dollars'}
              </div>
            </div>
          </div>
        </div>

        {/* Vessel Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Ship className="w-5 h-5" />
            {language === 'vi' ? 'Thông Tin Tàu' : 'Vessel Information'}
          </h2>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-600 mb-1">{language === 'vi' ? 'Loại Tàu' : 'Vessel Type'}</div>
                <div className="font-semibold text-gray-900">{vesselDisplayName}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">{language === 'vi' ? 'Tốc Độ' : 'Speed'}</div>
                <div className="font-semibold text-gray-900">{vesselInfo.speedCalc.toFixed(2)} knots</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">{language === 'vi' ? 'Khoảng Cách' : 'Distance'}</div>
                <div className="font-semibold text-gray-900">{vesselInfo.distance.toFixed(2)} nm</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">{language === 'vi' ? 'Thời Gian' : 'Datetime'}</div>
                <div className="font-semibold text-gray-900">{vesselInfo.datetime}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Query Information */}
        {query && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              {language === 'vi' ? 'Yêu Cầu' : 'Query'}
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-800">{query}</p>
            </div>
          </div>
        )}

        {/* Page Footer */}
        <div className="print-footer">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div>Fluxmare.ai - {language === 'vi' ? 'Dự đoán tiêu thụ nhiên liệu tàu thủy' : 'Maritime Fuel Consumption Prediction'}</div>
            <div>{language === 'vi' ? 'Trang' : 'Page'} 1/2</div>
          </div>
        </div>
      </div>

      {/* Page 2: Detailed Analysis */}
      <div className="print-page page-break">
        {/* Header */}
        <div className="print-header-small">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ship className="w-5 h-5 text-gray-800" />
              <span className="font-semibold text-gray-900">FLUXMARE</span>
            </div>
            <div className="text-xs text-gray-600">
              {language === 'vi' ? 'Phân Tích Chi Tiết' : 'Detailed Analysis'}
            </div>
          </div>
        </div>

        <hr className="my-3 border-gray-300" />

        {/* Input Features */}
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            {language === 'vi' ? '7 Thông Số Đầu Vào' : '7 Input Features'}
          </h2>
          
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <Ship className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-600">{getFeatureName('Speed', language)}</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {inputFeatures.Ship_SpeedOverGround.toFixed(2)} kn
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <Wind className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-600">{getFeatureName('Wind', language)}</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {inputFeatures.Weather_WindSpeed10M.toFixed(2)} m/s
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <Waves className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-600">{getFeatureName('Wave', language)}</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {inputFeatures.Weather_WaveHeight.toFixed(2)} m
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <Waves className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-600">{getFeatureName('WavePeriod', language)}</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {inputFeatures.Weather_WavePeriod.toFixed(2)} s
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <Anchor className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-600">{getFeatureName('Depth', language)}</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {inputFeatures.Environment_SeaFloorDepth.toFixed(2)} m
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <Thermometer className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-600">{getFeatureName('Temp', language)}</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {inputFeatures.Weather_Temperature2M.toFixed(2)} °C
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <Gauge className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-600">{getFeatureName('Current', language)}</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {inputFeatures.Weather_OceanCurrentVelocity.toFixed(2)} m/s
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={featuresBarData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="feature" 
                  stroke="#1a1a1a" 
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  stroke="#1a1a1a" 
                  tick={{ fontSize: 10 }}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #d1d5db',
                    fontSize: '10px',
                    borderRadius: '6px',
                  }}
                  formatter={(value: number, name: string, props: any) => {
                    const unit = props.payload.unit;
                    return [`${value.toFixed(2)} ${unit}`, 'Value'];
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#2002a6" 
                  name="Value"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            {language === 'vi' ? 'Phân Tích Chuẩn Hóa' : 'Normalized Analysis'}
          </h2>
          
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis 
                  dataKey="feature" 
                  tick={{ fontSize: 9, fill: '#1a1a1a' }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 9, fill: '#1a1a1a' }}
                />
                <Radar 
                  name="Features" 
                  dataKey="value" 
                  stroke="#2002a6" 
                  fill="#2002a6" 
                  fillOpacity={0.5} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {language === 'vi' ? 'Khuyến Nghị' : 'Recommendations'}
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-gray-800">{analysis.recommendation}</p>
          </div>
        </div>

        {/* Page Footer */}
        <div className="print-footer">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div>Fluxmare.ai - {language === 'vi' ? 'Dự đoán tiêu thụ nhiên liệu tàu thủy' : 'Maritime Fuel Consumption Prediction'}</div>
            <div>{language === 'vi' ? 'Trang' : 'Page'} 2/2</div>
          </div>
        </div>
      </div>
    </div>
  );
}

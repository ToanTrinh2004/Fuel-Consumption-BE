import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { GitCompare, Trash2, TrendingUp, Fuel, Gauge, Ship, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import type { ThemeColor } from '../App';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';

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
}

interface AdvancedCompareDialogProps {
  themeColor: ThemeColor;
  isDarkMode: boolean;
  customColor?: string;
  dashboardHistory: HistoryItem[];
}

export default function AdvancedCompareDialog({ themeColor, isDarkMode, customColor, dashboardHistory }: AdvancedCompareDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Get colors based on theme
  const getColors = () => {
    if (themeColor === 'custom' && customColor) {
      return {
        primary: customColor,
        secondary: customColor + '80',
        bg: isDarkMode ? 'bg-[#0a0a0a]' : 'bg-white',
        card: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white',
        cardBg: isDarkMode ? 'bg-[#262626]' : 'bg-gray-50',
        text: isDarkMode ? 'text-[#e5e5e5]' : 'text-[#1a1a1a]',
        textSecondary: isDarkMode ? 'text-[#999]' : 'text-[#666]',
        border: `border-[${customColor}]`,
      };
    }
    
    return {
      primary: isDarkMode ? '#e3d5f7' : '#2002a6',
      secondary: isDarkMode ? '#e3d5f780' : '#2002a680',
      bg: isDarkMode ? 'bg-[#0a0a0a]' : 'bg-white',
      card: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white',
      cardBg: isDarkMode ? 'bg-[#262626]' : 'bg-gray-50',
      text: isDarkMode ? 'text-[#e5e5e5]' : 'text-[#1a1a1a]',
      textSecondary: isDarkMode ? 'text-[#999]' : 'text-[#666]',
      border: isDarkMode ? 'border-[#e3d5f7]' : 'border-[#2002a6]',
    };
  };

  const colors = getColors();

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

  // Transform data for charts
  const comparisonData = selectedItems.map(index => {
    const item = dashboardHistory[index];
    return {
      name: `#${dashboardHistory.length - index}`,
      fuel: item.analysis.fuelConsumption,
      efficiency: item.analysis.efficiency,
      speed: item.vesselInfo.speedCalc,
      cost: item.analysis.estimatedCost,
      timestamp: new Date(item.timestamp).toLocaleString('vi-VN', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-2 bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-7 px-3 text-xs ${colors.border}`}
          style={themeColor === 'custom' ? { borderColor: colors.primary + '80' } : {}}
        >
          <GitCompare className="h-3 w-3" />
          So Sánh Predictions
        </button>
      </DialogTrigger>

      <DialogContent className={`max-w-5xl max-h-[90vh] ${colors.bg} ${colors.text}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${colors.text}`}>
            <GitCompare className="h-5 w-5" />
            So Sánh Predictions - Chọn từ Lịch Sử
          </DialogTitle>
          <DialogDescription className={`text-xs ${colors.textSecondary}`}>
            Chọn tối đa 5 predictions để so sánh chi tiết
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4">
          {/* Left: History Selection */}
          <div className="col-span-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm">Lịch Sử ({dashboardHistory.length})</h3>
              {selectedItems.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClearSelection}
                  className="h-6 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Bỏ chọn
                </Button>
              )}
            </div>

            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-2">
                {dashboardHistory.map((item, index) => (
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
                          <span className="text-xs font-medium">#{dashboardHistory.length - index}</span>
                          <span className={`text-[10px] ${colors.textSecondary}`}>
                            {new Date(item.timestamp).toLocaleString('vi-VN', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-[10px] truncate mb-2" title={item.query}>
                          {item.query}
                        </p>
                        <div className="grid grid-cols-2 gap-1 text-[9px]">
                          <div>
                            <Fuel className="h-2 w-2 inline mr-1" />
                            {item.analysis.fuelConsumption.toFixed(1)} kg
                          </div>
                          <div>
                            <Gauge className="h-2 w-2 inline mr-1" />
                            {item.analysis.efficiency}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {dashboardHistory.length === 0 && (
                  <div className={`text-center py-8 ${colors.textSecondary}`}>
                    <Ship className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Chưa có lịch sử dashboard</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right: Comparison Charts */}
          <div className="col-span-2">
            {selectedItems.length === 0 ? (
              <div className={`flex flex-col items-center justify-center h-[500px] ${colors.textSecondary}`}>
                <GitCompare className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-sm">Chọn ít nhất 1 prediction để so sánh</p>
                <p className="text-xs mt-1">Tối đa 5 predictions</p>
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 pr-4">
                  {/* Selected Items Summary */}
                  <Card className={`border-2 ${colors.border} ${colors.card}`}>
                    <CardHeader className="p-3">
                      <CardTitle className="text-xs flex items-center gap-2">
                        <Check className="h-3 w-3" />
                        Đã chọn {selectedItems.length} predictions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="flex flex-wrap gap-2">
                        {selectedItems.map(index => (
                          <div
                            key={index}
                            className={`px-2 py-1 rounded text-[10px] ${colors.cardBg} flex items-center gap-1`}
                          >
                            #{dashboardHistory.length - index}
                            <button
                              onClick={() => toggleSelection(index)}
                              className="ml-1 hover:opacity-70"
                            >
                              <X className="h-2 w-2" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Fuel Consumption Comparison */}
                  <Card className={`border-2 ${colors.border} ${colors.card}`}>
                    <CardHeader className="p-3">
                      <CardTitle className="text-xs flex items-center gap-2">
                        <Fuel className="h-3 w-3" />
                        So Sánh Tiêu Thụ Nhiên Liệu
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={comparisonData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#333" : "#e0e0e0"} />
                          <XAxis 
                            dataKey="name" 
                            stroke={isDarkMode ? "#e5e5e5" : "#1a1a1a"} 
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis 
                            stroke={isDarkMode ? "#e5e5e5" : "#1a1a1a"} 
                            tick={{ fontSize: 10 }}
                            label={{ value: 'kg', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: isDarkMode ? '#1a1a1a' : '#fff', 
                              border: `1px solid ${colors.primary}`,
                              fontSize: '10px'
                            }}
                            formatter={(value: number) => [`${value.toFixed(2)} kg`, 'Fuel']}
                          />
                          <Bar 
                            dataKey="fuel" 
                            fill={colors.primary} 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Efficiency & Speed Comparison */}
                  <Card className={`border-2 ${colors.border} ${colors.card}`}>
                    <CardHeader className="p-3">
                      <CardTitle className="text-xs flex items-center gap-2">
                        <Gauge className="h-3 w-3" />
                        Hiệu Suất & Tốc Độ
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={comparisonData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#333" : "#e0e0e0"} />
                          <XAxis 
                            dataKey="name" 
                            stroke={isDarkMode ? "#e5e5e5" : "#1a1a1a"} 
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis 
                            stroke={isDarkMode ? "#e5e5e5" : "#1a1a1a"} 
                            tick={{ fontSize: 10 }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: isDarkMode ? '#1a1a1a' : '#fff', 
                              border: `1px solid ${colors.primary}`,
                              fontSize: '10px'
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '10px' }} />
                          <Line 
                            type="monotone" 
                            dataKey="efficiency" 
                            stroke={colors.primary} 
                            strokeWidth={2}
                            name="Efficiency (%)"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="speed" 
                            stroke={isDarkMode ? "#fbbf24" : "#d97706"} 
                            strokeWidth={2}
                            name="Speed (kn)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Cost Comparison */}
                  <Card className={`border-2 ${colors.border} ${colors.card}`}>
                    <CardHeader className="p-3">
                      <CardTitle className="text-xs flex items-center gap-2">
                        <TrendingUp className="h-3 w-3" />
                        So Sánh Chi Phí
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={comparisonData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#333" : "#e0e0e0"} />
                          <XAxis 
                            dataKey="name" 
                            stroke={isDarkMode ? "#e5e5e5" : "#1a1a1a"} 
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis 
                            stroke={isDarkMode ? "#e5e5e5" : "#1a1a1a"} 
                            tick={{ fontSize: 10 }}
                            label={{ value: 'USD', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: isDarkMode ? '#1a1a1a' : '#fff', 
                              border: `1px solid ${colors.primary}`,
                              fontSize: '10px'
                            }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cost']}
                          />
                          <Bar 
                            dataKey="cost" 
                            fill={isDarkMode ? "#10b981" : "#059669"} 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Detailed Table */}
                  <Card className={`border-2 ${colors.border} ${colors.card}`}>
                    <CardHeader className="p-3">
                      <CardTitle className="text-xs">Chi Tiết So Sánh</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-[10px]">
                          <thead>
                            <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                              <th className="text-left py-2 pr-2">#</th>
                              <th className="text-right py-2 px-2">Fuel (kg)</th>
                              <th className="text-right py-2 px-2">Efficiency</th>
                              <th className="text-right py-2 px-2">Speed (kn)</th>
                              <th className="text-right py-2 px-2">Cost ($)</th>
                              <th className="text-left py-2 pl-2">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {comparisonData.map((item, idx) => (
                              <tr 
                                key={idx}
                                className={`border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}
                              >
                                <td className="py-2 pr-2">{item.name}</td>
                                <td className="text-right py-2 px-2">{item.fuel.toFixed(2)}</td>
                                <td className="text-right py-2 px-2">{item.efficiency}%</td>
                                <td className="text-right py-2 px-2">{item.speed.toFixed(1)}</td>
                                <td className="text-right py-2 px-2">{item.cost.toLocaleString()}</td>
                                <td className={`text-left py-2 pl-2 ${colors.textSecondary}`}>{item.timestamp}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

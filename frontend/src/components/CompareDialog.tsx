import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GitCompare, Trash2, TrendingUp, Fuel, Gauge, Ship } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import type { ThemeColor } from '../App';

interface ComparisonData {
  timestamp: string;
  query: string;
  fuelConsumption: number;
  efficiency: number;
  speed: number;
}

interface CompareDialogProps {
  themeColor: ThemeColor;
  isDarkMode: boolean;
  customColor?: string;
}

export default function CompareDialog({ themeColor, isDarkMode, customColor }: CompareDialogProps) {
  const [comparisons, setComparisons] = useState<ComparisonData[]>([]);
  const [open, setOpen] = useState(false);

  // Load comparisons from localStorage on mount AND when opening
  useEffect(() => {
    const loadComparisons = () => {
      const stored = localStorage.getItem('fluxmare_comparisons');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setComparisons(parsed);
        } catch (error) {
          console.error('Error parsing comparisons:', error);
          setComparisons([]);
        }
      } else {
        setComparisons([]);
      }
    };

    // Load on mount
    loadComparisons();

    // Also load when dialog opens
    if (open) {
      loadComparisons();
    }
  }, [open]);

  // Clear all comparisons
  const handleClearAll = () => {
    localStorage.removeItem('fluxmare_comparisons');
    setComparisons([]);
    toast.success('Đã xóa tất cả so sánh!');
  };

  // Remove specific comparison
  const handleRemove = (index: number) => {
    const updated = comparisons.filter((_, i) => i !== index);
    setComparisons(updated);
    localStorage.setItem('fluxmare_comparisons', JSON.stringify(updated));
    toast.success('Đã xóa!');
  };

  // Get colors based on theme
  const getColors = () => {
    if (themeColor === 'custom' && customColor) {
      return {
        primary: customColor,
        secondary: customColor + '80',
        bg: isDarkMode ? 'bg-[#0a0a0a]' : 'bg-white',
        card: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white',
        text: isDarkMode ? 'text-[#e5e5e5]' : 'text-[#1a1a1a]',
        border: `border-[${customColor}]`,
      };
    }
    
    return {
      primary: isDarkMode ? '#e3d5f7' : '#2002a6',
      secondary: isDarkMode ? '#e3d5f780' : '#2002a680',
      bg: isDarkMode ? 'bg-[#0a0a0a]' : 'bg-white',
      card: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white',
      text: isDarkMode ? 'text-[#e5e5e5]' : 'text-[#1a1a1a]',
      border: isDarkMode ? 'border-[#e3d5f7]' : 'border-[#2002a6]',
    };
  };

  const colors = getColors();

  // Transform data for chart
  const chartData = comparisons.map((comp, idx) => ({
    name: `Scenario ${idx + 1}`,
    fuel: comp.fuelConsumption,
    efficiency: comp.efficiency,
    speed: comp.speed,
  }));

  // Get count from localStorage directly for button display
  const getComparisonCount = () => {
    const stored = localStorage.getItem('fluxmare_comparisons');
    if (stored) {
      try {
        return JSON.parse(stored).length;
      } catch {
        return 0;
      }
    }
    return 0;
  };

  const [count, setCount] = useState(getComparisonCount());

  // Update count when dialog state changes
  useEffect(() => {
    setCount(getComparisonCount());
  }, [open, comparisons]);

  // Listen for storage changes (when new comparison is added)
  useEffect(() => {
    const handleStorageChange = () => {
      const newCount = getComparisonCount();
      setCount(newCount);
      
      // Reload comparisons if dialog is open
      if (open) {
        const stored = localStorage.getItem('fluxmare_comparisons');
        if (stored) {
          try {
            setComparisons(JSON.parse(stored));
          } catch (error) {
            console.error('Error parsing comparisons:', error);
          }
        }
      }
    };

    // Check every second for updates (since storage event doesn't fire in same tab)
    const interval = setInterval(handleStorageChange, 1000);
    
    return () => clearInterval(interval);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        className={`w-full flex items-center justify-start gap-2 h-9 px-3 py-2 text-sm rounded-md border-2 ${colors.border} ${colors.text} transition-colors hover:bg-opacity-80 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
      >
        <GitCompare className="h-4 w-4" />
        So Sánh Predictions ({count}/3)
      </DialogTrigger>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${colors.card} ${colors.text}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center justify-between ${colors.text}`}>
            <div className="flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              So Sánh Predictions
            </div>
            {comparisons.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Xóa tất cả
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        {comparisons.length === 0 ? (
          <div className="text-center py-12">
            <GitCompare className={`h-16 w-16 mx-auto mb-4 opacity-30 ${colors.text}`} />
            <p className={`${colors.text} mb-2`}>Chưa có predictions để so sánh</p>
            <p className={`text-xs opacity-60 ${colors.text}`}>
              Nhấn "So Sánh" trên dashboard để thêm predictions
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Overview Cards */}
            <div className="grid grid-cols-3 gap-3">
              {comparisons.map((comp, idx) => (
                <Card key={idx} className={`border-2 ${colors.border} ${colors.card} relative`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(idx)}
                    className="absolute top-1 right-1 h-6 w-6 p-0 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <CardHeader className="pb-2 p-3">
                    <CardTitle className={`text-xs ${colors.text}`}>
                      Scenario {idx + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-3 pt-0">
                    <div>
                      <div className="flex items-center gap-1 text-[10px] opacity-60">
                        <Fuel className="h-3 w-3" />
                        Fuel
                      </div>
                      <div className={`text-sm ${colors.text}`}>
                        {comp.fuelConsumption.toFixed(4)} kg/s
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[10px] opacity-60">
                        <Gauge className="h-3 w-3" />
                        Efficiency
                      </div>
                      <div className={`text-sm ${colors.text}`}>
                        {comp.efficiency.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[10px] opacity-60">
                        <Ship className="h-3 w-3" />
                        Speed
                      </div>
                      <div className={`text-sm ${colors.text}`}>
                        {comp.speed.toFixed(2)} m/s
                      </div>
                    </div>
                    <div className="text-[9px] opacity-50 truncate">
                      {new Date(comp.timestamp).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comparison Chart */}
            <Card className={`border-2 ${colors.border} ${colors.card}`}>
              <CardHeader className="p-3">
                <CardTitle className={`flex items-center gap-2 text-xs ${colors.text}`}>
                  <TrendingUp className="h-4 w-4" />
                  So Sánh Chi Tiết
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#333" : "#e0e0e0"} />
                    <XAxis 
                      dataKey="name" 
                      stroke={isDarkMode ? "#e5e5e5" : "#1a1a1a"} 
                      tick={{ fontSize: 11 }} 
                    />
                    <YAxis 
                      stroke={isDarkMode ? "#e5e5e5" : "#1a1a1a"} 
                      tick={{ fontSize: 11 }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDarkMode ? '#1a1a1a' : '#fff', 
                        border: `1px solid ${colors.primary}`,
                        fontSize: '11px'
                      }}
                      labelStyle={{ color: isDarkMode ? '#e5e5e5' : '#1a1a1a' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="fuel" fill={colors.primary} name="Fuel (kg/s)" />
                    <Bar dataKey="speed" fill={isDarkMode ? "#fbbf24" : "#d97706"} name="Speed (m/s)" />
                    <Bar dataKey="efficiency" fill={isDarkMode ? "#10b981" : "#059669"} name="Efficiency (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Query Details */}
            <Card className={`border-2 ${colors.border} ${colors.card}`}>
              <CardHeader className="p-3">
                <CardTitle className={`text-xs ${colors.text}`}>
                  Chi Tiết Queries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-3 pt-0">
                {comparisons.map((comp, idx) => (
                  <div key={idx} className="text-xs">
                    <span className={`${colors.text} opacity-60`}>Scenario {idx + 1}:</span>{' '}
                    <span className={colors.text}>{comp.query}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

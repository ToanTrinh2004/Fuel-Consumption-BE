import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
} from "recharts";
import {
    Fuel,
    TrendingDown,
    Ship,
    AlertCircle,
    Download,
    Copy,
    Check,
    GitCompare,
    Maximize2,
    Minimize2,
    Activity,
    Waves,
    Wind,
    Thermometer,
    Anchor,
    Gauge,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";
import { useState, useRef } from "react";
import type { ThemeColor, Language } from "../App";
import { t, getFeatureName } from "../utils/translations";
import PrintReport from "./PrintReport";

interface FuelConsumptionDashboardProps {
    data: {
        query: string;
        analysis: {
            fuelConsumption: number; // kg
            fuelConsumptionTons: number; // tons
            estimatedCost: number; // USD
            efficiency: number; // 0-100
            avgConsumptionRate: number; // kg/nm
            recommendation: string;
        };
        vesselInfo: {
            type: string;
            speedCalc: number;
            distance: number;
            datetime: string;
        };
        timeSeriesData: Array<{
            time: string;
            consumption: number;
            speed: number;
        }>;
        comparison: Array<{
            metric: string;
            current: number;
            optimal: number;
        }>;
        timestamp: Date;
    };
    themeColor: ThemeColor;
    isDarkMode: boolean;
    customColor: string;
    language: Language;
    dashboardHistory?: any[];
    onCompareMode?: () => void;
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
}

export default function FuelConsumptionDashboard({
    data,
    themeColor,
    isDarkMode,
    customColor,
    language,
    dashboardHistory = [],
    onCompareMode,
    isFullscreen = false,
    onToggleFullscreen,
}: FuelConsumptionDashboardProps) {
    const { analysis, vesselInfo, timeSeriesData, comparison, query } = data;
    const [copied, setCopied] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);

    // Vessel name mapping
    const vesselNames: Record<string, Record<Language, string>> = {
        diverse_1_tier1: { vi: "Tàu hỗn hợp (Diverse)", en: "Diverse Vessel" },
        mpv_1_tier1: {
            vi: "Tàu đa năng (MPV)",
            en: "Multi-Purpose Vessel (MPV)",
        },
        tanker_1_tier1: { vi: "Tàu chở dầu (Tanker)", en: "Tanker" },
        ropax_1_tier1: { vi: "Tàu khách-xe (RoPax)", en: "RoPax Vessel" },
        container_1_tier1: { vi: "Tàu container", en: "Container Ship" },
    };

    const vesselDisplayName = vesselInfo?.type
        ? vesselNames[vesselInfo.type]?.[language] || vesselInfo.type
        : language === "vi"
        ? "Tàu container"
        : "Container Ship";

    // Generate mock 7 features if not provided
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
        Total_MomentaryFuel: analysis.avgConsumptionRate / 3600 || 0.85, // Convert to kg/s
    };

    const predictionValueKg =
        typeof analysis?.fuelConsumption === "number" &&
        Number.isFinite(analysis.fuelConsumption)
            ? analysis.fuelConsumption
            : typeof prediction?.Total_MomentaryFuel === "number" &&
              Number.isFinite(prediction.Total_MomentaryFuel)
            ? prediction.Total_MomentaryFuel * 3600
            : null;

    // Prepare data for 7 features bar chart
    const featuresBarData = [
        {
            feature: getFeatureName("Speed", language),
            value: inputFeatures.Ship_SpeedOverGround,
            unit: "kn",
            icon: "Ship",
        },
        {
            feature: getFeatureName("Wind", language),
            value: inputFeatures.Weather_WindSpeed10M,
            unit: "m/s",
            icon: "Wind",
        },
        {
            feature: getFeatureName("Wave", language),
            value: inputFeatures.Weather_WaveHeight,
            unit: "m",
            icon: "Waves",
        },
        {
            feature: getFeatureName("Period", language),
            value: inputFeatures.Weather_WavePeriod,
            unit: "s",
            icon: "Activity",
        },
        {
            feature: getFeatureName("Depth", language),
            value: inputFeatures.Environment_SeaFloorDepth,
            unit: "m",
            icon: "Anchor",
        },
        {
            feature: getFeatureName("Temp", language),
            value: inputFeatures.Weather_Temperature2M,
            unit: "°C",
            icon: "Thermometer",
        },
        {
            feature: getFeatureName("Current", language),
            value: inputFeatures.Weather_OceanCurrentVelocity,
            unit: "m/s",
            icon: "Waves",
        },
    ];

    // Radar chart data - normalized to 0-100
    const radarData = [
        {
            feature: getFeatureName("Speed", language),
            value: (inputFeatures.Ship_SpeedOverGround / 15) * 100,
        },
        {
            feature: getFeatureName("Wind", language),
            value: (inputFeatures.Weather_WindSpeed10M / 15) * 100,
        },
        {
            feature: getFeatureName("Wave", language),
            value: (inputFeatures.Weather_WaveHeight / 4) * 100,
        },
        {
            feature: getFeatureName("Period", language),
            value: (inputFeatures.Weather_WavePeriod / 10) * 100,
        },
        {
            feature: getFeatureName("Depth", language),
            value: (inputFeatures.Environment_SeaFloorDepth / 150) * 100,
        },
        {
            feature: getFeatureName("Temp", language),
            value: (inputFeatures.Weather_Temperature2M / 30) * 100,
        },
        {
            feature: getFeatureName("Current", language),
            value: (inputFeatures.Weather_OceanCurrentVelocity / 2.5) * 100,
        },
    ];

    // Theme configuration
    const getColors = (theme: ThemeColor, dark: boolean) => {
        const themes = {
            default: dark
                ? {
                      bg: "bg-[#0a0a0a]",
                      card: "bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]",
                      text: "text-white",
                      accent: "text-[#e3d5f7]",
                      border: "border-[#e3d5f7]/50",
                      borderHex: "#e3d5f7",
                      gradient: "bg-gradient-to-r from-[#e3d5f7] to-[#b8acf5]",
                      cardBg: "bg-[#1a1a1a]",
                      cardBorder: "border-[#e3d5f7]/30",
                      secondary: "text-[#b0b0b0]",
                      chartColor: "#e3d5f7",
                  }
                : {
                      bg: "bg-[#fafafa]",
                      card: "bg-gradient-to-br from-white to-[#fafafa]",
                      text: "text-[#1a1a1a]",
                      accent: "text-[#2002a6]",
                      border: "border-[#2002a6]/50",
                      borderHex: "#2002a6",
                      gradient: "bg-gradient-to-r from-[#2002a6] to-[#5b47d9]",
                      cardBg: "bg-white",
                      cardBorder: "border-[#2002a6]/20",
                      secondary: "text-[#525252]",
                      chartColor: "#2002a6",
                  },
            pink: dark
                ? {
                      bg: "bg-black",
                      card: "bg-gradient-to-br from-[#1a1a1a] to-black",
                      text: "text-white",
                      accent: "text-pink-300",
                      border: "border-pink-400/60",
                      borderHex: "#f9a8d4",
                      gradient: "bg-gradient-to-r from-pink-400 to-pink-500",
                      cardBg: "bg-[#1a1a1a]",
                      cardBorder: "border-pink-400/30",
                      secondary: "text-pink-200",
                      chartColor: "#f9a8d4",
                  }
                : {
                      bg: "bg-white",
                      card: "bg-gradient-to-br from-white to-pink-50",
                      text: "text-pink-950",
                      accent: "text-pink-700",
                      border: "border-pink-400/50",
                      borderHex: "#db2777",
                      gradient: "bg-gradient-to-r from-pink-600 to-pink-700",
                      cardBg: "bg-white",
                      cardBorder: "border-pink-400/20",
                      secondary: "text-pink-800",
                      chartColor: "#db2777",
                  },
            rose: dark
                ? {
                      bg: "bg-black",
                      card: "bg-gradient-to-br from-[#1a1a1a] to-black",
                      text: "text-white",
                      accent: "text-rose-300",
                      border: "border-rose-400/60",
                      borderHex: "#fb7185",
                      gradient: "bg-gradient-to-r from-rose-400 to-rose-500",
                      cardBg: "bg-[#1a1a1a]",
                      cardBorder: "border-rose-400/30",
                      secondary: "text-rose-200",
                      chartColor: "#fb7185",
                  }
                : {
                      bg: "bg-white",
                      card: "bg-gradient-to-br from-white to-rose-50",
                      text: "text-rose-950",
                      accent: "text-rose-700",
                      border: "border-rose-400/50",
                      borderHex: "#e11d48",
                      gradient: "bg-gradient-to-r from-rose-600 to-rose-700",
                      cardBg: "bg-white",
                      cardBorder: "border-rose-400/20",
                      secondary: "text-rose-800",
                      chartColor: "#e11d48",
                  },
            fuchsia: dark
                ? {
                      bg: "bg-black",
                      card: "bg-gradient-to-br from-[#1a1a1a] to-black",
                      text: "text-white",
                      accent: "text-fuchsia-300",
                      border: "border-fuchsia-400/60",
                      borderHex: "#e879f9",
                      gradient:
                          "bg-gradient-to-r from-fuchsia-400 to-fuchsia-500",
                      cardBg: "bg-[#1a1a1a]",
                      cardBorder: "border-fuchsia-400/30",
                      secondary: "text-fuchsia-200",
                      chartColor: "#e879f9",
                  }
                : {
                      bg: "bg-white",
                      card: "bg-gradient-to-br from-white to-fuchsia-50",
                      text: "text-fuchsia-950",
                      accent: "text-fuchsia-700",
                      border: "border-fuchsia-400/50",
                      borderHex: "#c026d3",
                      gradient:
                          "bg-gradient-to-r from-fuchsia-600 to-fuchsia-700",
                      cardBg: "bg-white",
                      cardBorder: "border-fuchsia-400/20",
                      secondary: "text-fuchsia-800",
                      chartColor: "#c026d3",
                  },
            blue: dark
                ? {
                      bg: "bg-black",
                      card: "bg-gradient-to-br from-[#1a1a1a] to-black",
                      text: "text-white",
                      accent: "text-blue-300",
                      border: "border-blue-400/60",
                      borderHex: "#60a5fa",
                      gradient: "bg-gradient-to-r from-blue-400 to-blue-500",
                      cardBg: "bg-[#1a1a1a]",
                      cardBorder: "border-blue-400/30",
                      secondary: "text-blue-200",
                      chartColor: "#60a5fa",
                  }
                : {
                      bg: "bg-white",
                      card: "bg-gradient-to-br from-white to-blue-50",
                      text: "text-blue-950",
                      accent: "text-blue-700",
                      border: "border-blue-400/50",
                      borderHex: "#2563eb",
                      gradient: "bg-gradient-to-r from-blue-600 to-blue-700",
                      cardBg: "bg-white",
                      cardBorder: "border-blue-400/20",
                      secondary: "text-blue-800",
                      chartColor: "#2563eb",
                  },
            purple: dark
                ? {
                      bg: "bg-black",
                      card: "bg-gradient-to-br from-[#1a1a1a] to-black",
                      text: "text-white",
                      accent: "text-purple-300",
                      border: "border-purple-400/60",
                      borderHex: "#c084fc",
                      gradient:
                          "bg-gradient-to-r from-purple-400 to-purple-500",
                      cardBg: "bg-[#1a1a1a]",
                      cardBorder: "border-purple-400/30",
                      secondary: "text-purple-200",
                      chartColor: "#c084fc",
                  }
                : {
                      bg: "bg-white",
                      card: "bg-gradient-to-br from-white to-purple-50",
                      text: "text-purple-950",
                      accent: "text-purple-700",
                      border: "border-purple-400/50",
                      borderHex: "#9333ea",
                      gradient:
                          "bg-gradient-to-r from-purple-600 to-purple-700",
                      cardBg: "bg-white",
                      cardBorder: "border-purple-400/20",
                      secondary: "text-purple-800",
                      chartColor: "#9333ea",
                  },
            indigo: dark
                ? {
                      bg: "bg-black",
                      card: "bg-gradient-to-br from-[#1a1a1a] to-black",
                      text: "text-white",
                      accent: "text-indigo-300",
                      border: "border-indigo-400/60",
                      borderHex: "#a5b4fc",
                      gradient:
                          "bg-gradient-to-r from-indigo-400 to-indigo-500",
                      cardBg: "bg-[#1a1a1a]",
                      cardBorder: "border-indigo-400/30",
                      secondary: "text-indigo-200",
                      chartColor: "#a5b4fc",
                  }
                : {
                      bg: "bg-white",
                      card: "bg-gradient-to-br from-white to-indigo-50",
                      text: "text-indigo-950",
                      accent: "text-indigo-700",
                      border: "border-indigo-400/50",
                      borderHex: "#4f46e5",
                      gradient:
                          "bg-gradient-to-r from-indigo-600 to-indigo-700",
                      cardBg: "bg-white",
                      cardBorder: "border-indigo-400/20",
                      secondary: "text-indigo-800",
                      chartColor: "#4f46e5",
                  },
            sky: dark
                ? {
                      bg: "bg-black",
                      card: "bg-gradient-to-br from-[#1a1a1a] to-black",
                      text: "text-white",
                      accent: "text-sky-300",
                      border: "border-sky-400/60",
                      borderHex: "#7dd3fc",
                      gradient: "bg-gradient-to-r from-sky-400 to-sky-500",
                      cardBg: "bg-[#1a1a1a]",
                      cardBorder: "border-sky-400/30",
                      secondary: "text-sky-200",
                      chartColor: "#7dd3fc",
                  }
                : {
                      bg: "bg-white",
                      card: "bg-gradient-to-br from-white to-sky-50",
                      text: "text-sky-950",
                      accent: "text-sky-700",
                      border: "border-sky-400/50",
                      borderHex: "#0284c7",
                      gradient: "bg-gradient-to-r from-sky-600 to-sky-700",
                      cardBg: "bg-white",
                      cardBorder: "border-sky-400/20",
                      secondary: "text-sky-800",
                      chartColor: "#0284c7",
                  },
            ocean: dark
                ? {
                      bg: "bg-black",
                      card: "bg-gradient-to-br from-[#1a1a1a] to-black",
                      text: "text-white",
                      accent: "text-cyan-300",
                      border: "border-cyan-400/60",
                      borderHex: "#67e8f9",
                      gradient: "bg-gradient-to-r from-cyan-400 to-cyan-500",
                      cardBg: "bg-[#1a1a1a]",
                      cardBorder: "border-cyan-400/30",
                      secondary: "text-cyan-200",
                      chartColor: "#67e8f9",
                  }
                : {
                      bg: "bg-white",
                      card: "bg-gradient-to-br from-white to-cyan-50",
                      text: "text-cyan-950",
                      accent: "text-cyan-700",
                      border: "border-cyan-400/50",
                      borderHex: "#0891b2",
                      gradient: "bg-gradient-to-r from-cyan-600 to-cyan-700",
                      cardBg: "bg-white",
                      cardBorder: "border-cyan-400/20",
                      secondary: "text-cyan-800",
                      chartColor: "#0891b2",
                  },
            teal: dark
                ? {
                      bg: "bg-black",
                      card: "bg-gradient-to-br from-[#1a1a1a] to-black",
                      text: "text-white",
                      accent: "text-teal-300",
                      border: "border-teal-400/60",
                      borderHex: "#5eead4",
                      gradient: "bg-gradient-to-r from-teal-400 to-teal-500",
                      cardBg: "bg-[#1a1a1a]",
                      cardBorder: "border-teal-400/30",
                      secondary: "text-teal-200",
                      chartColor: "#5eead4",
                  }
                : {
                      bg: "bg-white",
                      card: "bg-gradient-to-br from-white to-teal-50",
                      text: "text-teal-950",
                      accent: "text-teal-700",
                      border: "border-teal-400/50",
                      borderHex: "#0d9488",
                      gradient: "bg-gradient-to-r from-teal-600 to-teal-700",
                      cardBg: "bg-white",
                      cardBorder: "border-teal-400/20",
                      secondary: "text-teal-800",
                      chartColor: "#0d9488",
                  },
            emerald: dark
                ? {
                      bg: "bg-black",
                      card: "bg-gradient-to-br from-[#1a1a1a] to-black",
                      text: "text-white",
                      accent: "text-emerald-300",
                      border: "border-emerald-400/60",
                      borderHex: "#6ee7b7",
                      gradient:
                          "bg-gradient-to-r from-emerald-400 to-emerald-500",
                      cardBg: "bg-[#1a1a1a]",
                      cardBorder: "border-emerald-400/30",
                      secondary: "text-emerald-200",
                      chartColor: "#6ee7b7",
                  }
                : {
                      bg: "bg-white",
                      card: "bg-gradient-to-br from-white to-emerald-50",
                      text: "text-emerald-950",
                      accent: "text-emerald-700",
                      border: "border-emerald-400/50",
                      borderHex: "#059669",
                      gradient:
                          "bg-gradient-to-r from-emerald-600 to-emerald-700",
                      cardBg: "bg-white",
                      cardBorder: "border-emerald-400/20",
                      secondary: "text-emerald-800",
                      chartColor: "#059669",
                  },
            lime: dark
                ? {
                      bg: "bg-black",
                      card: "bg-gradient-to-br from-[#1a1a1a] to-black",
                      text: "text-white",
                      accent: "text-lime-300",
                      border: "border-lime-400/60",
                      borderHex: "#a3e635",
                      gradient: "bg-gradient-to-r from-lime-400 to-lime-500",
                      cardBg: "bg-[#1a1a1a]",
                      cardBorder: "border-lime-400/30",
                      secondary: "text-lime-200",
                      chartColor: "#a3e635",
                  }
                : {
                      bg: "bg-white",
                      card: "bg-gradient-to-br from-white to-lime-50",
                      text: "text-lime-950",
                      accent: "text-lime-700",
                      border: "border-lime-400/50",
                      borderHex: "#65a30d",
                      gradient: "bg-gradient-to-r from-lime-600 to-lime-700",
                      cardBg: "bg-white",
                      cardBorder: "border-lime-400/20",
                      secondary: "text-lime-800",
                      chartColor: "#65a30d",
                  },
            amber: dark
                ? {
                      bg: "bg-black",
                      card: "bg-gradient-to-br from-[#1a1a1a] to-black",
                      text: "text-white",
                      accent: "text-amber-300",
                      border: "border-amber-400/60",
                      borderHex: "#fbbf24",
                      gradient: "bg-gradient-to-r from-amber-400 to-amber-500",
                      cardBg: "bg-[#1a1a1a]",
                      cardBorder: "border-amber-400/30",
                      secondary: "text-amber-200",
                      chartColor: "#fbbf24",
                  }
                : {
                      bg: "bg-white",
                      card: "bg-gradient-to-br from-white to-amber-50",
                      text: "text-amber-950",
                      accent: "text-amber-700",
                      border: "border-amber-400/50",
                      borderHex: "#d97706",
                      gradient: "bg-gradient-to-r from-amber-600 to-amber-700",
                      cardBg: "bg-white",
                      cardBorder: "border-amber-400/20",
                      secondary: "text-amber-800",
                      chartColor: "#d97706",
                  },
            sunset: dark
                ? {
                      bg: "bg-black",
                      card: "bg-gradient-to-br from-[#1a1a1a] to-black",
                      text: "text-white",
                      accent: "text-orange-300",
                      border: "border-orange-400/60",
                      borderHex: "#fb923c",
                      gradient:
                          "bg-gradient-to-r from-orange-400 to-orange-500",
                      cardBg: "bg-[#1a1a1a]",
                      cardBorder: "border-orange-400/30",
                      secondary: "text-orange-200",
                      chartColor: "#fb923c",
                  }
                : {
                      bg: "bg-white",
                      card: "bg-gradient-to-br from-white to-orange-50",
                      text: "text-orange-950",
                      accent: "text-orange-700",
                      border: "border-orange-400/50",
                      borderHex: "#ea580c",
                      gradient:
                          "bg-gradient-to-r from-orange-600 to-orange-700",
                      cardBg: "bg-white",
                      cardBorder: "border-orange-400/20",
                      secondary: "text-orange-800",
                      chartColor: "#ea580c",
                  },
            custom: dark
                ? {
                      bg: "bg-black",
                      card: "bg-gradient-to-br from-[#1a1a1a] to-black",
                      text: "text-white",
                      accent: "text-white",
                      border: "border-white/60",
                      borderHex: customColor,
                      gradient: "bg-gradient-to-r from-white to-gray-300",
                      cardBg: "bg-[#1a1a1a]",
                      cardBorder: "border-white/30",
                      secondary: "text-gray-300",
                      chartColor: customColor,
                  }
                : {
                      bg: "bg-white",
                      card: "bg-gradient-to-br from-white to-gray-50",
                      text: "text-gray-900",
                      accent: "text-gray-900",
                      border: "border-gray-900/50",
                      borderHex: customColor,
                      gradient: "bg-gradient-to-r from-gray-900 to-gray-700",
                      cardBg: "bg-white",
                      cardBorder: "border-gray-900/20",
                      secondary: "text-gray-700",
                      chartColor: customColor,
                  },
        };
        return themes[theme];
    };

    const colors = getColors(themeColor, isDarkMode);

    // Derived variables for easier usage
    const cardBgClass = colors.cardBg;
    const textClass = colors.text;
    const textSecondaryClass = colors.accent;
    const borderColor = colors.borderHex;

    // Handle Export Dashboard - Print to PDF (Full Page)
    const handleExport = () => {
        // Set document title for PDF filename
        const originalTitle = document.title;
        const dateStr = new Date().toISOString().slice(0, 10);
        document.title = `Fluxmare-Report-${dateStr}`;

        const message =
            language === "vi"
                ? 'Báo cáo sẽ được in với 2 trang chuyên nghiệp. Chọn "Lưu dưới dạng PDF" để lưu file.'
                : 'Report will be printed in 2 professional pages. Select "Save as PDF" to save the file.';

        toast.info(language === "vi" ? "In Báo Cáo" : "Print Report", {
            id: "export",
            description: message,
            duration: 5000,
        });

        // Open print dialog
        setTimeout(() => {
            window.print();
            // Restore original title after print
            setTimeout(() => {
                document.title = originalTitle;
            }, 1000);
        }, 300);
    };

    // Handle Add to Comparison
    const handleAddToCompare = () => {
        const compareData = {
            timestamp: new Date().toISOString(),
            query,
            fuelConsumption: analysis.fuelConsumption,
            efficiency: analysis.efficiency,
            speed: vesselInfo.speedCalc,
        };

        // Save to localStorage for comparison
        const existing = localStorage.getItem("fluxmare_comparisons");
        const comparisons = existing ? JSON.parse(existing) : [];
        comparisons.push(compareData);
        localStorage.setItem(
            "fluxmare_comparisons",
            JSON.stringify(comparisons.slice(-3))
        ); // Keep last 3

        setCopied(true);
        toast.success("Đã thêm vào So Sánh!", {
            description: "Tối đa 3 predictions để so sánh",
        });

        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={`h-full overflow-y-auto p-4 ${colors.bg} print:!h-auto print:!overflow-visible print:!p-0`}
        >
            <motion.div
                className="mb-4 flex items-end justify-end print:hidden"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        onClick={onCompareMode}
                        size="sm"
                        variant="outline"
                        className={`h-7 text-xs border-2 ${colors.border}`}
                        style={
                            themeColor === "custom"
                                ? { borderColor: colors.borderHex + "80" }
                                : {}
                        }
                    >
                        <GitCompare className="h-3 w-3 mr-1" />
                        {t("comparePredictions", language)}
                    </Button>

                    {onToggleFullscreen && (
                        <Button
                            onClick={onToggleFullscreen}
                            size="sm"
                            variant="outline"
                            className={`h-7 text-xs border-2 ${colors.border}`}
                            style={
                                themeColor === "custom"
                                    ? { borderColor: colors.borderHex + "80" }
                                    : {}
                            }
                            title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
                        >
                            {isFullscreen ? (
                                <>
                                    <Minimize2 className="h-3 w-3 mr-1" />
                                    {language === "vi" ? "Thu nhỏ" : "Minimize"}
                                </>
                            ) : (
                                <>
                                    <Maximize2 className="h-3 w-3 mr-1" />
                                    {language === "vi"
                                        ? "Toàn màn hình"
                                        : "Fullscreen"}
                                </>
                            )}
                        </Button>
                    )}

                    <Button
                        onClick={handleExport}
                        size="sm"
                        variant="outline"
                        className={`h-7 text-xs border-2 ${colors.border}`}
                        style={
                            themeColor === "custom"
                                ? { borderColor: colors.borderHex + "80" }
                                : {}
                        }
                    >
                        <Download className="h-3 w-3 mr-1" />
                        {language === "vi" ? "Tải xuống PDF" : "Download PDF"}
                    </Button>
                </div>
            </motion.div>

            {/* Dashboard Content - Wrapped with ref for export */}
            <div
                ref={dashboardRef}
                data-print-dashboard
                className={`space-y-4 ${colors.bg} p-4 rounded-lg relative print:!bg-white print:!p-0 print:!rounded-none print:space-y-0`}
            >
                {/* Print Header - Only visible when printing */}
                <div className="hidden print:!grid print:grid-cols-2 print:gap-2 print:mb-2 print:pb-1 print:border-b print:!border-gray-300">
                    <div className="print:flex print:items-center print:gap-1">
                        <Ship className="print:!w-3 print:!h-3 print:!text-gray-800" />
                        <h1 className="print:!text-gray-900 print:!text-[11px] print:!font-semibold">
                            Fluxmare Prediction Report
                        </h1>
                    </div>
                    <div className="print:text-right print:!text-[8px] print:!text-gray-600">
                        {new Date().toLocaleDateString("vi-VN")}{" "}
                        {new Date().toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                </div>

                {/* Kết quả phân tích chính */}
                <motion.div
                    className="print:!opacity-100 print:!transform-none"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card
                        className={`border-2 ${colors.border} ${colors.card}`}
                        style={
                            themeColor === "custom"
                                ? { borderColor: colors.borderHex + "99" }
                                : {}
                        }
                    >
                        <CardHeader
                            className={`${colors.accent} bg-opacity-10 p-3`}
                        >
                            <CardTitle
                                className={`flex items-center gap-2 ${colors.text} text-xs`}
                            >
                                <Fuel className={`h-4 w-4 ${colors.accent}`} />
                                {t("fuelConsumption", language)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 p-3">
                            <div className="grid grid-cols-1 gap-3">
                                <div
                                    className={`${colors.cardBg} ${colors.cardBorder} rounded-lg p-3 border-2`}
                                    style={
                                        themeColor === "custom"
                                            ? {
                                                  borderColor:
                                                      colors.borderHex + "60",
                                              }
                                            : {}
                                    }
                                >
                                    <div
                                        className={`flex items-center gap-2 ${colors.accent} mb-2`}
                                        style={
                                            themeColor === "custom"
                                                ? { color: colors.chartColor }
                                                : {}
                                        }
                                    >
                                        <Fuel className="h-4 w-4" />
                                        <span className="text-xs">
                                            {t("fuelConsumption", language)}
                                        </span>
                                    </div>
                                    <div className={`text-2xl ${colors.text}`}>
                                        {analysis.fuelConsumption.toFixed(5)} kg/s
                                    </div>
                                    <div
                                        className={`text-xs ${colors.secondary} mt-1`}
                                    >
                                        {predictionValueKg !== null
                                            ? `≈ ${(
                                                  (predictionValueKg / 3600) /
                                                  1000
                                              ).toFixed(5)} tons/s`
                                            : "N/A"}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Thông tin tàu */}
                <motion.div
                    className="print:!opacity-100 print:!transform-none"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card
                        className={`border-2 ${colors.border} ${colors.card}`}
                        style={
                            themeColor === "custom"
                                ? { borderColor: colors.borderHex + "99" }
                                : {}
                        }
                    >
                        <CardHeader
                            className={`${colors.accent} bg-opacity-10 p-3`}
                        >
                            <CardTitle
                                className={`flex items-center gap-2 ${colors.text} text-xs`}
                            >
                                <Ship className={`h-4 w-4 ${colors.accent}`} />
                                {t("vesselInfo", language)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-3 p-3">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="col-span-2">
                                    <span className={colors.secondary}>
                                        {t("vesselType", language)}:
                                    </span>
                                    <span className={`ml-2 ${colors.text}`}>
                                        {vesselDisplayName}
                                    </span>
                                </div>
                                <div>
                                    <span className={colors.secondary}>
                                        {t("speedCalc", language)}:
                                    </span>
                                    <span className={`ml-2 ${colors.text}`}>
                                        {vesselInfo.speedCalc} kn
                                    </span>
                                </div>
                                <div>
                                    <span className={colors.secondary}>
                                        {t("distance", language)}:
                                    </span>
                                    <span className={`ml-2 ${colors.text}`}>
                                        {vesselInfo.distance} nm
                                    </span>
                                </div>
                                <div>
                                    <span className={colors.secondary}>
                                        {t("interval", language)}:
                                    </span>
                                    <span className={`ml-2 ${colors.text}`}>
                                        15 {language === "vi" ? "phút" : "min"}
                                    </span>
                                </div>
                                <div>
                                    <span className={colors.secondary}>
                                        {t("analysisTime", language)}:
                                    </span>
                                    <span className={`ml-2 ${colors.text}`}>
                                        {new Date(
                                            vesselInfo.datetime
                                        ).toLocaleString("vi-VN")}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* 7 Input Features - BarChart */}
                <motion.div
                    className="print:!opacity-100 print:!transform-none"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card
                        className={`border-2 ${colors.border} ${colors.card}`}
                        style={
                            themeColor === "custom"
                                ? { borderColor: colors.borderHex + "99" }
                                : {}
                        }
                    >
                        <CardHeader
                            className={`${colors.accent} bg-opacity-10 p-3`}
                        >
                            <CardTitle
                                className={`flex items-center gap-2 ${colors.text} text-xs`}
                            >
                                <Activity
                                    className={`h-4 w-4 ${colors.accent}`}
                                />
                                {t("inputFeatures", language)} -{" "}
                                {t("environmentalConditions", language)}
                            </CardTitle>
                            <p
                                className={`text-[10px] ${colors.secondary} mt-0.5`}
                            >
                                {t("environmentalDesc", language)}
                            </p>
                        </CardHeader>
                        <CardContent className="pt-3 p-3">
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart
                                    data={featuresBarData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -10,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={isDarkMode ? "#333" : "#e0e0e0"}
                                    />
                                    <XAxis
                                        dataKey="feature"
                                        stroke={
                                            isDarkMode ? "#e5e5e5" : "#1a1a1a"
                                        }
                                        tick={{ fontSize: 10 }}
                                    />
                                    <YAxis
                                        stroke={
                                            isDarkMode ? "#e5e5e5" : "#1a1a1a"
                                        }
                                        tick={{ fontSize: 10 }}
                                        width={40}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDarkMode
                                                ? "#1a1a1a"
                                                : "#fff",
                                            border: `1px solid ${borderColor}`,
                                            fontSize: "10px",
                                            borderRadius: "6px",
                                        }}
                                        formatter={(
                                            value: number,
                                            name: string,
                                            props: any
                                        ) => {
                                            const unit = props.payload.unit;
                                            return [
                                                `${value.toFixed(2)} ${unit}`,
                                                "Value",
                                            ];
                                        }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill={borderColor}
                                        name="Value"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Radar Chart - 7 Features Normalized */}
                <motion.div
                    className="print:!opacity-100 print:!transform-none"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                >
                    <Card
                        className={`border-2 ${colors.border} ${colors.card}`}
                        style={
                            themeColor === "custom"
                                ? { borderColor: colors.borderHex + "99" }
                                : {}
                        }
                    >
                        <CardHeader
                            className={`${colors.accent} bg-opacity-10 p-3`}
                        >
                            <CardTitle
                                className={`flex items-center gap-2 ${colors.text} text-xs`}
                            >
                                <Gauge className={`h-4 w-4 ${colors.accent}`} />
                                {t("featuresAnalysis", language)} -{" "}
                                {t("inputProfile", language)}
                            </CardTitle>
                            <p
                                className={`text-[10px] ${colors.secondary} mt-0.5`}
                            >
                                {t("normalizedViz", language)}
                            </p>
                        </CardHeader>
                        <CardContent className="pt-3 p-3">
                            <ResponsiveContainer width="100%" height={280}>
                                <RadarChart data={radarData}>
                                    <PolarGrid
                                        stroke={isDarkMode ? "#444" : "#ddd"}
                                    />
                                    <PolarAngleAxis
                                        dataKey="feature"
                                        tick={{
                                            fill: isDarkMode
                                                ? "#e5e5e5"
                                                : "#1a1a1a",
                                            fontSize: 11,
                                        }}
                                    />
                                    <PolarRadiusAxis
                                        angle={90}
                                        domain={[0, 100]}
                                        tick={{
                                            fill: isDarkMode
                                                ? "#e5e5e5"
                                                : "#1a1a1a",
                                            fontSize: 9,
                                        }}
                                    />
                                    <Radar
                                        name={t("inputValues", language)}
                                        dataKey="value"
                                        stroke={borderColor}
                                        fill={borderColor}
                                        fillOpacity={0.5}
                                    />
                                    <Legend
                                        wrapperStyle={{ fontSize: "10px" }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDarkMode
                                                ? "#1a1a1a"
                                                : "#fff",
                                            border: `1px solid ${borderColor}`,
                                            fontSize: "10px",
                                            borderRadius: "6px",
                                        }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                            <p
                                className={`text-[10px] ${colors.secondary} text-center mt-2`}
                            >
                                💡 {t("featureVisualization", language)}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Features Detail Cards Grid */}
                <motion.div
                    className="print:!opacity-100 print:!transform-none"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card
                        className={`border-2 ${colors.border} ${colors.card}`}
                        style={
                            themeColor === "custom"
                                ? { borderColor: colors.borderHex + "99" }
                                : {}
                        }
                    >
                        <CardHeader
                            className={`${colors.accent} bg-opacity-10 p-3`}
                        >
                            <CardTitle
                                className={`flex items-center gap-2 ${colors.text} text-xs`}
                            >
                                <Ship className={`h-4 w-4 ${colors.accent}`} />
                                {t("inputFeaturesDetail", language)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-3 p-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <div
                                    className={`${colors.cardBg} rounded-lg p-2.5 border ${colors.cardBorder}`}
                                    style={
                                        themeColor === "custom"
                                            ? {
                                                  borderColor:
                                                      colors.borderHex + "40",
                                              }
                                            : {}
                                    }
                                >
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Ship
                                            className={`h-3 w-3 ${colors.accent}`}
                                        />
                                        <span
                                            className={`text-[10px] ${colors.secondary}`}
                                        >
                                            {getFeatureName("Speed", language)}
                                        </span>
                                    </div>
                                    <div className={`text-sm ${colors.text}`}>
                                        {inputFeatures.Ship_SpeedOverGround.toFixed(
                                            2
                                        )}{" "}
                                        kn
                                    </div>
                                </div>

                                <div
                                    className={`${colors.cardBg} rounded-lg p-2.5 border ${colors.cardBorder}`}
                                    style={
                                        themeColor === "custom"
                                            ? {
                                                  borderColor:
                                                      colors.borderHex + "40",
                                              }
                                            : {}
                                    }
                                >
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Wind
                                            className={`h-3 w-3 ${colors.accent}`}
                                        />
                                        <span
                                            className={`text-[10px] ${colors.secondary}`}
                                        >
                                            {getFeatureName("Wind", language)}
                                        </span>
                                    </div>
                                    <div className={`text-sm ${colors.text}`}>
                                        {inputFeatures.Weather_WindSpeed10M.toFixed(
                                            2
                                        )}{" "}
                                        m/s
                                    </div>
                                </div>

                                <div
                                    className={`${colors.cardBg} rounded-lg p-2.5 border ${colors.cardBorder}`}
                                    style={
                                        themeColor === "custom"
                                            ? {
                                                  borderColor:
                                                      colors.borderHex + "40",
                                              }
                                            : {}
                                    }
                                >
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Waves
                                            className={`h-3 w-3 ${colors.accent}`}
                                        />
                                        <span
                                            className={`text-[10px] ${colors.secondary}`}
                                        >
                                            {getFeatureName("Wave", language)}
                                        </span>
                                    </div>
                                    <div className={`text-sm ${colors.text}`}>
                                        {inputFeatures.Weather_WaveHeight.toFixed(
                                            2
                                        )}{" "}
                                        m
                                    </div>
                                </div>

                                <div
                                    className={`${colors.cardBg} rounded-lg p-2.5 border ${colors.cardBorder}`}
                                    style={
                                        themeColor === "custom"
                                            ? {
                                                  borderColor:
                                                      colors.borderHex + "40",
                                              }
                                            : {}
                                    }
                                >
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Activity
                                            className={`h-3 w-3 ${colors.accent}`}
                                        />
                                        <span
                                            className={`text-[10px] ${colors.secondary}`}
                                        >
                                            {getFeatureName("Period", language)}
                                        </span>
                                    </div>
                                    <div className={`text-sm ${colors.text}`}>
                                        {inputFeatures.Weather_WavePeriod.toFixed(
                                            2
                                        )}{" "}
                                        s
                                    </div>
                                </div>

                                <div
                                    className={`${colors.cardBg} rounded-lg p-2.5 border ${colors.cardBorder}`}
                                    style={
                                        themeColor === "custom"
                                            ? {
                                                  borderColor:
                                                      colors.borderHex + "40",
                                              }
                                            : {}
                                    }
                                >
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Anchor
                                            className={`h-3 w-3 ${colors.accent}`}
                                        />
                                        <span
                                            className={`text-[10px] ${colors.secondary}`}
                                        >
                                            {getFeatureName("Depth", language)}
                                        </span>
                                    </div>
                                    <div className={`text-sm ${colors.text}`}>
                                        {inputFeatures.Environment_SeaFloorDepth.toFixed(
                                            1
                                        )}{" "}
                                        m
                                    </div>
                                </div>

                                <div
                                    className={`${colors.cardBg} rounded-lg p-2.5 border ${colors.cardBorder}`}
                                    style={
                                        themeColor === "custom"
                                            ? {
                                                  borderColor:
                                                      colors.borderHex + "40",
                                              }
                                            : {}
                                    }
                                >
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Thermometer
                                            className={`h-3 w-3 ${colors.accent}`}
                                        />
                                        <span
                                            className={`text-[10px] ${colors.secondary}`}
                                        >
                                            {getFeatureName("Temp", language)}
                                        </span>
                                    </div>
                                    <div className={`text-sm ${colors.text}`}>
                                        {inputFeatures.Weather_Temperature2M.toFixed(
                                            1
                                        )}{" "}
                                        °C
                                    </div>
                                </div>

                                <div
                                    className={`${colors.cardBg} rounded-lg p-2.5 border ${colors.cardBorder}`}
                                    style={
                                        themeColor === "custom"
                                            ? {
                                                  borderColor:
                                                      colors.borderHex + "40",
                                              }
                                            : {}
                                    }
                                >
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Waves
                                            className={`h-3 w-3 ${colors.accent}`}
                                        />
                                        <span
                                            className={`text-[10px] ${colors.secondary}`}
                                        >
                                            {getFeatureName(
                                                "Current",
                                                language
                                            )}
                                        </span>
                                    </div>
                                    <div className={`text-sm ${colors.text}`}>
                                        {inputFeatures.Weather_OceanCurrentVelocity.toFixed(
                                            2
                                        )}{" "}
                                        m/s
                                    </div>
                                </div>

                                <div
                                    className={`${colors.cardBg} rounded-lg p-2.5 border-2 ${colors.border}`}
                                    style={
                                        themeColor === "custom"
                                            ? {
                                                  borderColor:
                                                      colors.borderHex + "80",
                                              }
                                            : {}
                                    }
                                >
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Fuel
                                            className={`h-3 w-3 ${colors.accent}`}
                                        />
                                        <span
                                            className={`text-[10px] ${colors.accent}`}
                                        >
                                            {t("prediction", language)}
                                        </span>
                                    </div>
                                    <div className={`text-sm ${colors.text}`}>
                                        {predictionValueKg !== null
                                            ? `${predictionValueKg >= 100
                                                  ? predictionValueKg.toFixed(0)
                                                  : predictionValueKg.toFixed(
                                                        2
                                                    )} kg/s`
                                            : "N/A"}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Khuyến nghị */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card
                        className={`border-2 ${colors.border} ${colors.card}`}
                        style={
                            themeColor === "custom"
                                ? { borderColor: colors.borderHex + "99" }
                                : {}
                        }
                    >
                        <CardHeader
                            className={`${colors.accent} bg-opacity-10 p-3`}
                        >
                            <CardTitle
                                className={`flex items-center gap-2 ${colors.text} text-xs`}
                            >
                                <AlertCircle
                                    className={`h-4 w-4 ${colors.accent}`}
                                />
                                Khuyến Nghị Tối Ưu Hóa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-3 p-3">
                            <p
                                className={`text-xs ${colors.text} leading-relaxed`}
                            >
                                {analysis.recommendation}
                            </p>
                            <div
                                className={`mt-3 p-2 rounded-lg ${colors.cardBg} border-2 ${colors.cardBorder}`}
                                style={
                                    themeColor === "custom"
                                        ? {
                                              borderColor:
                                                  colors.borderHex + "60",
                                          }
                                        : {}
                                }
                            >
                                <div className="flex items-start gap-2">
                                    <TrendingDown
                                        className={`h-4 w-4 ${colors.accent} flex-shrink-0 mt-0.5`}
                                    />
                                    <div className="text-xs">
                                        <p className={`${colors.accent} mb-1`}>
                                            Cơ hội tối ưu:
                                        </p>
                                        <ul
                                            className={`space-y-1 ${colors.secondary}`}
                                        >
                                            <li>
                                                • Điều chỉnh Speed_calc để cân
                                                bằng thời gian và nhiên liệu
                                            </li>
                                            <li>
                                                • Tối ưu hóa hệ thống động lực
                                                dựa trên loại vessel
                                            </li>
                                            <li>
                                                • Theo dõi và bảo dưỡng hệ thống
                                                động lực định kỳ
                                            </li>
                                            <li>
                                                • Phân tích lịch sử tiêu thụ để
                                                dự báo chính xác hơn
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Print Report - Hidden on screen, shown when printing */}
            <PrintReport
                data={data}
                language={language}
                vesselDisplayName={vesselDisplayName}
            />
        </div>
    );
}

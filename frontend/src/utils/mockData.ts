// Mock data for demo purposes

export interface DashboardData {
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
  // 7 Input Features
  inputFeatures?: {
    Ship_SpeedOverGround: number;
    Weather_WindSpeed10M: number;
    Weather_WaveHeight: number;
    Weather_WavePeriod: number;
    Environment_SeaFloorDepth: number;
    Weather_Temperature2M: number;
    Weather_OceanCurrentVelocity: number;
  };
  // Prediction Feature
  prediction?: {
    Total_MomentaryFuel: number; // kg/s
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
}

export interface MockMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any> | null;
  responseTime?: number;
  isFuelPrediction?: boolean;
  dashboardData?: DashboardData;
}

export interface Conversation {
  id: string;
  title: string;
  messages: MockMessage[];
  timestamp: Date;
  isFavorite?: boolean;
}

export interface MockUser {
  username: string;
  conversations: Conversation[];
}

// Mock database cho demo user
export const mockDatabase: Record<string, MockUser> = {
  'demo': {
    username: 'demo',
    conversations: [
      {
        id: 'conv-1',
        title: 'Phân tích Tàu đa năng (MPV)',
        timestamp: new Date(Date.now() - 7200000),
        isFavorite: true,
        messages: [
          {
            id: '1',
            type: 'user',
            content: '🚢 Phân tích: Tàu đa năng (MPV) | 2014-12-01T08:00 | Speed 12.5 knots | 450 nm | diesel',
            timestamp: new Date(Date.now() - 7200000),
          },
          {
            id: '2',
            type: 'bot',
            content: '🚢 Phân tích nhiên liệu hoàn tất!\n\n📊 Fuel Consumption:\n• Fuel: 8,967.82 kg (8.968 tons)\n• Chi phí ước tính: $5,829\n• Avg rate: 19.93 kg/nm\n• Hiệu suất: 86%\n\nNhấn "Dashboard" để xem phân tích chi tiết!',
            timestamp: new Date(Date.now() - 7199000),
            responseTime: 1243,
            isFuelPrediction: true,
          },
          {
            id: '3',
            type: 'user',
            content: 'Làm sao để giảm tiêu thụ nhiên liệu cho loại tàu này?',
            timestamp: new Date(Date.now() - 7100000),
          },
          {
            id: '4',
            type: 'bot',
            content: 'Để giảm Fuel Consumption [kg] cho Tàu đa năng (MPV), bạn có thể:\n\n1️⃣ Giảm Speed_calc xuống 10-11 knots (tiết kiệm ~20%)\n2️⃣ Nâng cấp lên propulsion hiệu quả hơn (LNG/Hybrid)\n3️⃣ Bảo dưỡng định kỳ hệ thống động lực\n4️⃣ Theo dõi dữ liệu mỗi 15 phút để phát hiện bất thường sớm\n5️⃣ Tối ưu tuyến đường và tránh điều kiện biển xấu',
            timestamp: new Date(Date.now() - 7098900),
            responseTime: 1100,
          },
        ]
      },
      {
        id: 'conv-2',
        title: 'Tàu container tốc độ cao',
        timestamp: new Date(Date.now() - 3600000),
        messages: [
          {
            id: '5',
            type: 'user',
            content: '🚢 Phân tích: Tàu container | 2014-12-15T14:30 | Speed 18.0 knots | 800 nm | diesel',
            timestamp: new Date(Date.now() - 3600000),
          },
          {
            id: '6',
            type: 'bot',
            content: '🚢 Phân tích nhiên liệu hoàn tất!\n\n📊 Propulsion-Fuel Consumption:\n• Fuel: 52,341.15 kg (52.341 tons)\n• Chi phí ước tính: $34,022\n• Avg rate: 65.43 kg/nm\n• Hiệu suất: 68%\n\nNhấn "Dashboard" để xem phân tích chi tiết!',
            timestamp: new Date(Date.now() - 3598800),
            responseTime: 1200,
            isFuelPrediction: true,
          },
        ]
      },
      {
        id: 'conv-3',
        title: 'Tối ưu nhiên liệu MPV',
        timestamp: new Date(Date.now() - 1800000),
        messages: [
          {
            id: '7',
            type: 'user',
            content: 'Làm thế nào để tối ưu nhiên liệu cho tàu MPV?',
            timestamp: new Date(Date.now() - 1800000),
          },
          {
            id: '8',
            type: 'bot',
            content: '🔍 So sánh Diesel vs LNG Propulsion:\n\n⛽ Diesel (tiêu chuẩn):\n• Chi phí đầu tư thấp\n• Công nghệ trưởng thành\n• Phát thải NOx, SOx cao\n• Multiplier: 1.0x\n\n💨 LNG (khí tự nhiên hóa lỏng):\n• Giảm 85% phát thải\n• Tiết kiệm 15-20% nhiên liệu\n• Chi phí đầu tư cao\n• Multiplier: 0.85x\n\n💡 Khuyến nghị: LNG cho tuyến dài, diesel cho tàu nhỏ/ngắn hạn',
            timestamp: new Date(Date.now() - 1798800),
            responseTime: 1200,
          },
        ]
      },
      {
        id: 'conv-4',
        title: 'Tàu chở dầu (Tanker)',
        timestamp: new Date(Date.now() - 900000),
        messages: [
          {
            id: '9',
            type: 'user',
            content: '🚢 Phân tích: Tàu chở dầu (Tanker) | 2015-01-05T10:15 | Speed 14.2 knots | 620 nm | heavy_fuel',
            timestamp: new Date(Date.now() - 900000),
          },
          {
            id: '10',
            type: 'bot',
            content: '🚢 Phân tích nhiên liệu hoàn tất!\n\n📊 Propulsion-Fuel Consumption:\n• Fuel: 34,567.21 kg (34.567 tons)\n• Chi phí ước tính: $22,469\n• Avg rate: 55.75 kg/nm\n• Hiệu suất: 79%\n\nNhấn "Dashboard" để xem phân tích chi tiết!',
            timestamp: new Date(Date.now() - 898900),
            responseTime: 1100,
            isFuelPrediction: true,
          },
        ]
      },
      {
        id: 'conv-5',
        title: 'Tối ưu hóa nhiên liệu',
        timestamp: new Date(Date.now() - 450000),
        messages: [
          {
            id: '11',
            type: 'user',
            content: 'Làm sao để tối ưu hóa Fuel Consumption cho chuyến đi dài?',
            timestamp: new Date(Date.now() - 450000),
          },
          {
            id: '12',
            type: 'bot',
            content: '🎯 Chiến lược tối ưu hóa Propulsion-Fuel Consumption:\n\n1️⃣ **Speed Optimization**: Giảm Speed_calc 10-20% = tiết kiệm 30-40%\n2️⃣ **Weather Routing**: Tránh sóng lớn, dòng hải lưu ngược\n3️⃣ **Trim Optimization**: Điều chỉnh mớn nước hợp lý\n4️⃣ **Engine Tuning**: Bảo dưỡng định kỳ, cleaning hull\n5️⃣ **Propulsion Choice**: LNG > Hybrid > Diesel > Heavy Fuel\n6️⃣ **Data Monitoring**: Theo dõi mỗi 15 phút để phát hiện vấn đề\n\n📊 Nhập dữ liệu vào form để nhận phân tích chi tiết!',
            timestamp: new Date(Date.now() - 448900),
            responseTime: 1100,
          },
        ]
      }
    ]
  },
  'user1': {
    username: 'user1',
    conversations: [
      {
        id: 'conv-u1-1',
        title: 'Tàu khách-xe (RoPax) Ferry',
        timestamp: new Date(Date.now() - 5400000),
        isFavorite: false,
        messages: [
          {
            id: 'u1-1',
            type: 'user',
            content: '🚢 Phân tích: Tàu khách-xe (RoPax) | 2015-02-10T09:00 | Speed 16.5 knots | 280 nm | diesel',
            timestamp: new Date(Date.now() - 5400000),
          },
          {
            id: 'u1-2',
            type: 'bot',
            content: '🚢 Phân tích nhiên liệu hoàn tất!\n\n📊 Propulsion-Fuel Consumption:\n• Fuel: 18,234.56 kg (18.235 tons)\n• Chi phí ước tính: $11,852\n• Avg rate: 65.12 kg/nm\n• Hiệu suất: 75%\n\nNhấn "Dashboard" để xem phân tích chi tiết!',
            timestamp: new Date(Date.now() - 5398900),
            responseTime: 1100,
            isFuelPrediction: true,
          },
        ]
      },
      {
        id: 'conv-u1-2',
        title: 'Tàu hỗn hợp (Diverse)',
        timestamp: new Date(Date.now() - 2700000),
        messages: [
          {
            id: 'u1-3',
            type: 'user',
            content: '🚢 Phân tích: Tàu hỗn hợp (Diverse) | 2015-03-20T15:45 | Speed 8.5 knots | 150 nm | diesel',
            timestamp: new Date(Date.now() - 2700000),
          },
          {
            id: 'u1-4',
            type: 'bot',
            content: '🚢 Phân tích nhiên liệu hoàn tất!\n\n📊 Propulsion-Fuel Consumption:\n• Fuel: 1,245.67 kg (1.246 tons)\n• Chi phí ước tính: $810\n• Avg rate: 8.30 kg/nm\n• Hiệu suất: 91%\n\nNhấn "Dashboard" để xem phân tích chi tiết!',
            timestamp: new Date(Date.now() - 2698900),
            responseTime: 1100,
            isFuelPrediction: true,
          },
        ]
      }
    ]
  }
};

// Smart suggestions based on maritime fuel analysis
export const smartSuggestions = [
  'Nếu tốc độ tàu tăng từ 8 lên 12 m/s, mức tiêu thụ nhiên liệu thay đổi thế nào?',
  'Mức tiêu thụ Total.MomentaryFuel sẽ khác nhau ra sao giữa sóng cao và sóng lặng?',
  'Nhập vận tốc tàu, gió và sóng hiện tại để dự đoán ngay mức tiêu thụ nhiên liệu?',
  'Biển động với gió mạnh thì tàu của tôi sẽ tốn nhiên liệu bao nhiêu mỗi giờ?',
  'Nếu thay đổi hướng gió từ 0° sang 180°, mức tiêu thụ nhiên liệu dự đoán có tăng nhiều không?',
];

// Lấy phản hồi ngẫu nhiên
export function getRandomResponse(category: string): string {
  const responses = {
    general: [
      'Cảm ơn bạn đã sử dụng Fluxmare!',
      'Fluxmare luôn sẵn sàng hỗ trợ phân tích nhiên liệu tàu thủy.',
      'Hãy nhập đầy đủ 4 trường để nhận phân tích chi tiết nhất!'
    ]
  };
  
  const categoryResponses = responses[category as keyof typeof responses] || responses.general;
  return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
}

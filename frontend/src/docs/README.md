# ⛴️ Fluxmare - Maritime Fuel Consumption Predictor

Ứng dụng chatbot AI chuyên phân tích và dự đoán tiêu thụ nhiên liệu cho tàu thủy, sử dụng hệ thống benchmark FuelCast với 7 features chuẩn.

![Fluxmare](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4+-blue)

## ✨ Features

### 🔐 Authentication
- Email/Password login & register
- Google OAuth integration
- JWT token-based authentication
- Persistent session management

### 💬 AI Chat Interface
- Natural language query processing
- 7-feature maritime prediction (FuelCast benchmark)
- Real-time fuel consumption analysis
- Chat history with persistent storage
- Suggested questions for quick start

### 📊 Dashboard & Analytics
- **Single Prediction Dashboard**
  - Fuel consumption metrics (kg, tons)
  - Cost estimation
  - Efficiency analysis
  - Vessel information display
  - Time-series visualization
  - AI recommendations
  
- **Comparison Dashboard**
  - Compare up to 5 predictions
  - AI-powered insights
  - Performance metrics comparison
  - Best prediction scoring
  - Export to PDF/Print

### ⚙️ Settings & Customization
- 15+ theme colors (default + 14 custom themes)
- Dark/Light mode toggle
- Custom RGB color picker
- Logo auto-adjustment for themes

### 📱 UI/UX Features
- Fully responsive design
- Glass morphism effects
- Smooth animations (Motion/Framer Motion)
- Modern SaaS-inspired UI (Notion, Linear)
- No full-page scroll (fixed layout)
- Professional gradient effects

## 🏗️ Tech Stack

### Frontend
- **React 18+** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Motion (Framer Motion)** - Animations
- **Recharts** - Data visualization
- **shadcn/ui** - Component library
- **Vite** - Build tool

### Backend (Ready to integrate)
- RESTful API endpoints
- JWT authentication
- PostgreSQL/MySQL database
- WebSocket support (optional)

## 📁 Project Structure

```
fluxmare/
├── App.tsx                      # Main application
│
├── docs/                        # All documentation
│   ├── README.md               # This file
│   ├── PROJECT_STRUCTURE.md
│   ├── API_ENDPOINTS.md
│   ├── BACKEND_INTEGRATION.md
│   └── QUICK_START.md
│
├── features/                    # Feature modules
│   ├── auth/                   # Authentication
│   ├── chat/                   # Chat & messaging
│   ├── dashboard/              # Analytics dashboards
│   ├── settings/               # App settings
│   └── admin/                  # Admin features
│
├── shared/                     # Shared resources
│   ├── components/            # Reusable components
│   ├── types/                # TypeScript types
│   └── utils/                # Utility functions
│
├── services/                  # API services
│   └── api/                  # API client & endpoints
│
├── styles/
│   └── globals.css
│
└── guidelines/
    └── Guidelines.md
```

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Installation
```bash
# Clone repository
git clone <your-repo-url>
cd fluxmare

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables
```bash
# .env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_ENABLE_MOCK_API=false
```

## 📖 Documentation

- [Project Structure](./PROJECT_STRUCTURE.md) - Detailed architecture guide
- [Quick Start](./QUICK_START.md) - Get started in 5 minutes
- [Backend Integration](./BACKEND_INTEGRATION.md) - API endpoints & database schema
- [Development Guide](./DEVELOPMENT.md) - Coding standards & best practices
- [API Reference](./API_ENDPOINTS.md) - Full API documentation
- [Migration Guide](./MIGRATION_GUIDE.md) - Refactoring guide

## 🔌 Backend Integration

Ứng dụng đã chuẩn bị sẵn các service functions để kết nối với Backend:

### Authentication
```typescript
import { authService } from './services/api/auth';

await authService.login({ email, password });
await authService.register({ email, password, fullName });
await authService.googleLogin(googleToken);
```

### Chat & Predictions
```typescript
import { chatService } from './services/api/chat';

await chatService.sendMessage({ userId, message, features });
await chatService.getChatHistory(userId);
await chatService.deleteChatHistory(userId);
```

### Dashboard
```typescript
import { dashboardService } from './services/api/dashboard';

await dashboardService.getDashboardHistory(userId);
await dashboardService.saveDashboard(data);
await dashboardService.comparePredictions({ userId, predictionIds });
```

Xem [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) để biết chi tiết.

## 🎨 Themes

Fluxmare hỗ trợ 15+ theme colors:
- **Default** - Purple/Lavender (#2002a6/#e3d5f7)
- Pink, Rose, Fuchsia
- Blue, Purple, Indigo
- Sky, Ocean, Teal
- Emerald, Lime
- Amber, Sunset
- **Custom RGB** - Tùy chỉnh màu sắc với color picker

## 📊 FuelCast 7 Features

1. **Vessel Type** - Loại tàu (Container, Tanker, MPV, etc.)
2. **Speed Calc** - Tốc độ tính toán (m/s)
3. **Distance** - Khoảng cách (nautical miles)
4. **Datetime** - Thời gian dự đoán
5. **Draft Aft** - Mớn nước sau (m)
6. **Draft Fore** - Mớn nước trước (m)
7. **Average Draft** - Mớn nước trung bình (m)

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Type Checking
```bash
npm run type-check
```

## 🧪 Testing (Coming Soon)

```bash
npm run test
npm run test:coverage
```

## 📝 License

MIT License - see [LICENSE](./LICENSE) for details

## 👥 Contributors

- Your Name - Initial work

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Project Link: [https://github.com/yourusername/fluxmare](https://github.com/yourusername/fluxmare)

---

Made with ❤️ by Fluxmare Team

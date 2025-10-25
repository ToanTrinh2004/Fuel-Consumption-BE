# Fluxmare Project Structure

## 📁 Cấu Trúc Thư Mục - Organized by Function

```
fluxmare/
├── App.tsx                      # Main application file
│
├── README.md                    # Quick overview
│
├── docs/                        # All documentation
│   ├── README.md
│   ├── PROJECT_STRUCTURE.md
│   ├── API_ENDPOINTS.md
│   ├── BACKEND_INTEGRATION.md
│   ├── DEVELOPMENT.md
│   ├── MIGRATION_GUIDE.md
│   ├── QUICK_START.md
│   ├── REFACTORING_SUMMARY.md
│   └── Attributions.md
│
├── features/                    # Feature modules
│   │
│   ├── auth/                   # 🔐 Đăng nhập & Đăng ký
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── LoginFormSolid.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── RegisterFormSolid.tsx
│   │   │   └── GoogleIcon.tsx
│   │   └── types.ts
│   │
│   ├── chat/                   # 💬 Giao diện Chatbot chính
│   │   ├── components/
│   │   │   ├── ChatBot.tsx
│   │   │   └── EmptyState.tsx
│   │   └── types.ts
│   │
│   ├── chat-input/             # ⌨️ Input Chatbot
│   │   └── components/
│   │       └── ChatInput.tsx
│   │
│   ├── chat-history/           # 📜 Lịch sử Chat
│   │   └── components/
│   │       └── ChatHistory.tsx
│   │
│   ├── dashboard/              # 📊 Dashboard Predictions
│   │   ├── components/
│   │   │   ├── FuelConsumptionDashboard.tsx
│   │   │   ├── ComparisonDashboard.tsx
│   │   │   ├── CompareDialog.tsx
│   │   │   └── AdvancedCompareDialog.tsx
│   │   └── types.ts
│   │
│   ├── dashboard-history/      # 📋 Lịch sử Dashboard
│   │   └── components/
│   │       └── DashboardHistory.tsx
│   │
│   ├── settings/               # ⚙️ Cài đặt (Theme, Dark/Light, Help)
│   │   ├── components/
│   │   │   ├── SettingsDialog.tsx
│   │   │   └── HelpDialog.tsx
│   │   └── types.ts
│   │
│   └── admin/                  # 👑 Admin Dashboard
│       └── components/
│           └── AdminDashboard.tsx
│
├── shared/                     # Shared resources
│   ├── components/
│   │   ├── ui/                # shadcn/ui components (48 files)
│   │   └── figma/
│   │       └── ImageWithFallback.tsx
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── utils/
│       ├── logoUtils.ts
│       └── mockData.ts
│
├── services/                   # API layer
│   └── api/
│       ├── client.ts
│       ├── auth.ts
│       ├── chat.ts
│       ├── dashboard.ts
│       └── settings.ts
│
├── styles/
│   └── globals.css
│
└── guidelines/
    └── Guidelines.md
```

## 🎯 Tổ Chức Theo Chức Năng

### 1. **Authentication Module** (`features/auth/`)
Tất cả files liên quan đến đăng nhập/đăng ký:
- `LoginForm.tsx` - Form đăng nhập email/password
- `LoginFormSolid.tsx` - Form đăng nhập solid variant
- `RegisterForm.tsx` - Form đăng ký
- `RegisterFormSolid.tsx` - Form đăng ký solid variant
- `GoogleIcon.tsx` - Google OAuth icon

### 2. **Chat Interface** (`features/chat/`)
Giao diện chatbot chính:
- `ChatBot.tsx` - Main chatbot component
- `EmptyState.tsx` - Empty state khi chưa có chat

### 3. **Chat Input** (`features/chat-input/`)
Component nhập liệu cho chat:
- `ChatInput.tsx` - Input box với textarea và button gửi

### 4. **Chat History** (`features/chat-history/`)
Lịch sử chat:
- `ChatHistory.tsx` - Sidebar lịch sử chat messages

### 5. **Dashboard** (`features/dashboard/`)
Dashboard dự đoán nhiên liệu:
- `FuelConsumptionDashboard.tsx` - Dashboard chính
- `ComparisonDashboard.tsx` - So sánh nhiều predictions
- `CompareDialog.tsx` - Dialog so sánh
- `AdvancedCompareDialog.tsx` - Dialog so sánh nâng cao

### 6. **Dashboard History** (`features/dashboard-history/`)
Lịch sử dashboard:
- `DashboardHistory.tsx` - Lịch sử predictions đã lưu

### 7. **Settings** (`features/settings/`)
Cài đặt ứng dụng:
- `SettingsDialog.tsx` - Theme, dark/light mode, custom colors
- `HelpDialog.tsx` - Hướng dẫn sử dụng

### 8. **Admin** (`features/admin/`)
Tính năng admin:
- `AdminDashboard.tsx` - Dashboard quản trị

## 📝 Import Paths

### From App.tsx
```typescript
// Authentication
import { LoginForm } from './features/auth/components/LoginForm';
import { RegisterForm } from './features/auth/components/RegisterForm';
import { GoogleIcon } from './features/auth/components/GoogleIcon';

// Chat Interface
import { ChatBot } from './features/chat/components/ChatBot';
import { EmptyState } from './features/chat/components/EmptyState';

// Chat Input
import { ChatInput } from './features/chat-input/components/ChatInput';

// Chat History
import { ChatHistory } from './features/chat-history/components/ChatHistory';

// Dashboard
import { FuelConsumptionDashboard } from './features/dashboard/components/FuelConsumptionDashboard';
import { ComparisonDashboard } from './features/dashboard/components/ComparisonDashboard';

// Dashboard History
import { DashboardHistory } from './features/dashboard-history/components/DashboardHistory';

// Settings
import { SettingsDialog } from './features/settings/components/SettingsDialog';
import { HelpDialog } from './features/settings/components/HelpDialog';

// Admin
import { AdminDashboard } from './features/admin/components/AdminDashboard';

// Shared
import { Button } from './shared/components/ui/button';
import { ImageWithFallback } from './shared/components/figma/ImageWithFallback';
import type { User, ThemeColor } from './shared/types';
import { logoUtils } from './shared/utils/logoUtils';
import { mockData } from './shared/utils/mockData';

// Services
import { authService } from './services/api/auth';
import { chatService } from './services/api/chat';
```

### From Feature Components
```typescript
// UI Components
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

// Types
import type { User } from '@/shared/types';

// Utils
import { logoUtils } from '@/shared/utils/logoUtils';

// Services
import { authService } from '@/services/api/auth';
import { chatService } from '@/services/api/chat';
import { dashboardService } from '@/services/api/dashboard';
```

## 🔄 Data Flow

```
User Input
   ↓
Chat Input Component (features/chat-input/)
   ↓
Chat Service (services/api/chat.ts)
   ↓
Backend API
   ↓
Chat Bot Component (features/chat/)
   ↓
Dashboard Component (features/dashboard/)
```

## 📊 Feature Dependencies

```
App.tsx
  ├── features/auth/           (uses: shared, services/api/auth)
  ├── features/chat/           (uses: shared, services/api/chat)
  ├── features/chat-input/     (uses: shared, services/api/chat)
  ├── features/chat-history/   (uses: shared, services/api/chat)
  ├── features/dashboard/      (uses: shared, services/api/dashboard)
  ├── features/dashboard-history/ (uses: shared, services/api/dashboard)
  ├── features/settings/       (uses: shared, services/api/settings)
  └── features/admin/          (uses: shared)
```

## 🎨 Benefits of This Organization

### Clear Separation
- ✅ **Auth** - All login/register files in one place
- ✅ **Chat** - Main interface separated from input and history
- ✅ **Dashboard** - Prediction dashboards grouped together
- ✅ **Settings** - Theme, help, preferences together

### Easy Navigation
```
Need login form?          → features/auth/
Need to edit chat UI?     → features/chat/
Need to edit input?       → features/chat-input/
Need to see history?      → features/chat-history/ or dashboard-history/
Need dashboard?           → features/dashboard/
Need settings?            → features/settings/
```

### Scalable
- Each feature can grow independently
- Easy to add new features
- Clear boundaries between modules

## 🚀 Quick Commands

### Find Components
```bash
# Auth components
ls features/auth/components/

# Chat interface
ls features/chat/components/

# Dashboard
ls features/dashboard/components/
```

### Add New Feature
```bash
mkdir -p features/new-feature/components
touch features/new-feature/types.ts
```

## 📚 Related Documentation

- [Quick Start Guide](./QUICK_START.md)
- [Backend Integration](./BACKEND_INTEGRATION.md)
- [Development Guidelines](./DEVELOPMENT.md)
- [Full Documentation](./README.md)

# Update Imports Guide

## 🔄 Cách Update Imports trong App.tsx

Sau khi chạy `organize.sh` (Linux/Mac) hoặc `organize.bat` (Windows), update imports như sau:

### ❌ OLD - Xóa imports cũ
```typescript
import LoginForm from './components/LoginForm';
import ChatBot from './components/ChatBot';
// ... all old imports
```

### ✅ NEW - Thay bằng imports mới

```typescript
// Auth (tsx + ts cùng folder)
import { LoginForm } from './features/auth/LoginForm';
import { LoginFormSolid } from './features/auth/LoginFormSolid';
import { RegisterForm } from './features/auth/RegisterForm';
import { RegisterFormSolid } from './features/auth/RegisterFormSolid';
import { GoogleIcon } from './features/auth/GoogleIcon';

// Chat (tsx + ts cùng folder)
import { ChatBot } from './features/chat/ChatBot';
import { EmptyState } from './features/chat/EmptyState';

// Chat Input
import { ChatInput } from './features/chat-input/ChatInput';

// Chat History
import { ChatHistory } from './features/chat-history/ChatHistory';

// Dashboard (tsx + ts cùng folder)
import { FuelConsumptionDashboard } from './features/dashboard/FuelConsumptionDashboard';
import { ComparisonDashboard } from './features/dashboard/ComparisonDashboard';
import { CompareDialog } from './features/dashboard/CompareDialog';
import { AdvancedCompareDialog } from './features/dashboard/AdvancedCompareDialog';

// Dashboard History
import { DashboardHistory } from './features/dashboard-history/DashboardHistory';

// Settings (tsx + ts cùng folder)
import { SettingsDialog } from './features/settings/SettingsDialog';
import { HelpDialog } from './features/settings/HelpDialog';

// Admin
import { AdminDashboard } from './features/admin/AdminDashboard';

// Shared Components
import { Button } from './shared/components/ui/button';
import { Card } from './shared/components/ui/card';
import { Dialog } from './shared/components/ui/dialog';
import { ImageWithFallback } from './shared/components/figma/ImageWithFallback';
// ... other UI components

// Types
import type { User, ThemeColor, PredictionData } from './shared/types';

// Utils
import { logoUtils } from './shared/utils/logoUtils';
import { mockData } from './shared/utils/mockData';

// Services
import { authService } from './services/api/auth';
import { chatService } from './services/api/chat';
import { dashboardService } from './services/api/dashboard';
import { settingsService } from './services/api/settings';

// Styles
import './styles/globals.css';
```

## 📝 Update trong Feature Files

Trong các file bên trong features, update imports:

### ❌ OLD
```typescript
import { Button } from '../../../components/ui/button';
import { logoUtils } from '../../../utils/logoUtils';
```

### ✅ NEW  
```typescript
import { Button } from '@/shared/components/ui/button';
import { logoUtils } from '@/shared/utils/logoUtils';
import type { User } from '@/shared/types';
```

## 📁 Cấu Trúc Mới

```
features/
  auth/
    ├── LoginForm.tsx
    ├── LoginFormSolid.tsx
    ├── RegisterForm.tsx
    ├── RegisterFormSolid.tsx
    ├── GoogleIcon.tsx
    └── types.ts          ← tsx + ts cùng folder
  
  chat/
    ├── ChatBot.tsx
    ├── EmptyState.tsx
    └── types.ts          ← tsx + ts cùng folder
  
  dashboard/
    ├── FuelConsumptionDashboard.tsx
    ├── ComparisonDashboard.tsx
    ├── CompareDialog.tsx
    ├── AdvancedCompareDialog.tsx
    └── types.ts          ← tsx + ts cùng folder
```

## ✅ Checklist

- [ ] Chạy `organize.sh` hoặc `organize.bat`
- [ ] Update imports trong `App.tsx`
- [ ] Update imports trong feature files (nếu có lỗi)
- [ ] Test app: `npm run dev`
- [ ] Xóa files setup sau khi hoàn thành

---

**Note:** Sau khi update xong và test OK, xóa các files: organize.sh, organize.bat, UPDATE_IMPORTS.md, FINAL_STRUCTURE.md

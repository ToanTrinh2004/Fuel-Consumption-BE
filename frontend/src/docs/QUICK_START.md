# Quick Start Guide

## 🚀 Bắt Đầu trong 5 Phút

### 1. Clone & Install
```bash
git clone <your-repo>
cd fluxmare
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

Chỉnh sửa `.env`:
```bash
VITE_API_BASE_URL=http://localhost:3000/api  # Your backend URL
VITE_GOOGLE_CLIENT_ID=your-client-id         # Google OAuth (optional)
```

### 3. Start Development
```bash
npm run dev
```

Mở trình duyệt: `http://localhost:5173`

---

## 📂 Cấu Trúc Project

```
fluxmare/
├── features/          # Các module chức năng
│   ├── auth/         # Đăng nhập, đăng ký
│   ├── chat/         # Chat với AI
│   ├── dashboard/    # Dashboard phân tích
│   └── settings/     # Cài đặt
│
├── shared/           # Code dùng chung
│   ├── components/  # UI components
│   ├── types/       # TypeScript types
│   └── utils/       # Helper functions
│
└── services/        # API services
    └── api/         # Kết nối backend
```

---

## 🎯 Workflow Cơ Bản

### Kịch Bản 1: Thêm Tính Năng Mới

**Ví dụ: Thêm Export CSV cho Dashboard**

1. **Tạo service function**
```typescript
// services/api/dashboard.ts
export const dashboardService = {
  // ... existing functions
  
  async exportToCsv(dashboardId: string): Promise<Blob> {
    const response = await apiClient.get(`/dashboard/${dashboardId}/export`, {
      responseType: 'blob'
    });
    return response.data;
  }
};
```

2. **Sử dụng trong component**
```typescript
// features/dashboard/components/FuelConsumptionDashboard.tsx
import { dashboardService } from '@/services/api/dashboard';

const handleExportCsv = async () => {
  try {
    const blob = await dashboardService.exportToCsv(dashboardId);
    // Download file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prediction.csv';
    a.click();
  } catch (error) {
    console.error('Export failed:', error);
  }
};
```

3. **Thêm button UI**
```typescript
<Button onClick={handleExportCsv}>
  <Download className="h-4 w-4 mr-2" />
  Export CSV
</Button>
```

---

### Kịch Bản 2: Kết Nối Backend

**Ví dụ: Kết nối Login với real API**

1. **Backend đã có endpoint:** `POST /api/auth/login`

2. **Frontend đã có service function:**
```typescript
// services/api/auth.ts
export const authService = {
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  }
};
```

3. **Sử dụng trong LoginForm:**
```typescript
// features/auth/components/LoginForm.tsx
import { authService } from '@/services/api/auth';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // Gọi API thật
    const { user, token } = await authService.login({ email, password });
    
    // Lưu token
    localStorage.setItem('fluxmare_token', token);
    
    // Update state
    onSuccess(user, token);
    
    toast.success('Login successful!');
  } catch (error: any) {
    toast.error(error.message || 'Login failed');
  }
};
```

**Vậy là xong!** Frontend tự động:
- Thêm token vào headers
- Handle errors (401, 403, 500)
- Retry failed requests
- Redirect nếu unauthorized

---

### Kịch Bản 3: Thêm Component Mới

**Ví dụ: Thêm "Share Dashboard" button**

1. **Tạo component**
```typescript
// features/dashboard/components/ShareButton.tsx
import { Share } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner@2.0.3';

interface ShareButtonProps {
  dashboardId: string;
}

export function ShareButton({ dashboardId }: ShareButtonProps) {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/dashboard/${dashboardId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };
  
  return (
    <Button onClick={handleShare} variant="outline" size="sm">
      <Share className="h-4 w-4 mr-2" />
      Share
    </Button>
  );
}
```

2. **Sử dụng component**
```typescript
// features/dashboard/components/FuelConsumptionDashboard.tsx
import { ShareButton } from './ShareButton';

// Trong JSX
<div className="flex gap-2">
  <ShareButton dashboardId={data.id} />
  <Button onClick={handleExport}>Export</Button>
</div>
```

---

## 🔧 Common Tasks

### Task 1: Thêm API Endpoint Mới

**File:** `services/api/[feature].ts`

```typescript
// services/api/chat.ts
export const chatService = {
  // Existing functions...
  
  // ✅ Thêm function mới
  async translateMessage(messageId: string, targetLang: string) {
    const response = await apiClient.post(`/chat/translate`, {
      messageId,
      targetLang
    });
    return response.data;
  }
};
```

### Task 2: Thêm Type Mới

**File:** `shared/types/index.ts`

```typescript
// Thêm interface mới
export interface ShareSettings {
  isPublic: boolean;
  expiresAt?: Date;
  allowedEmails?: string[];
}
```

### Task 3: Update Component Props

**File:** `features/[feature]/types.ts`

```typescript
// features/dashboard/types.ts
export interface DashboardProps {
  data: PredictionData;
  themeColor: ThemeColor;
  isDarkMode: boolean;
  
  // ✅ Thêm props mới
  onShare?: (dashboardId: string) => void;
  shareSettings?: ShareSettings;
}
```

---

## 🐛 Debugging

### Issue: API Call Failed

**Check:**
1. Backend đang chạy? `http://localhost:3000/api/health`
2. Token hợp lệ? Check localStorage: `fluxmare_token`
3. CORS configured? Backend phải allow origin `http://localhost:5173`

**Debug:**
```typescript
// Bật debug mode trong API client
console.log('Request:', config);
console.log('Response:', response);
console.log('Error:', error);
```

### Issue: Component Not Re-rendering

**Check:**
1. State được update đúng cách?
```typescript
// ❌ Wrong
state.value = newValue;

// ✅ Correct
setState({ ...state, value: newValue });
```

2. Dependencies trong useEffect?
```typescript
useEffect(() => {
  fetchData();
}, [dependency]); // Phải list đủ dependencies
```

---

## 📚 Tài Liệu Khác

- [Project Structure](../PROJECT_STRUCTURE.md) - Hiểu cấu trúc project
- [Backend Integration](./BACKEND_INTEGRATION.md) - Chi tiết API endpoints
- [Development Guide](./DEVELOPMENT.md) - Best practices
- [API Endpoints](./API_ENDPOINTS.md) - Full API reference

---

## 💡 Tips & Tricks

### Tip 1: Reuse Components
```typescript
// ❌ Bad - Duplicate code
<Button className="px-4 py-2 bg-blue-500">Save</Button>
<Button className="px-4 py-2 bg-blue-500">Submit</Button>

// ✅ Good - Reuse
import { Button } from '@/shared/components/ui/button';
<Button>Save</Button>
<Button>Submit</Button>
```

### Tip 2: Use Types
```typescript
// ❌ Bad
const data: any = await fetchData();

// ✅ Good
import type { PredictionData } from '@/shared/types';
const data: PredictionData = await fetchData();
```

### Tip 3: Error Handling
```typescript
// ✅ Always wrap API calls in try-catch
try {
  const data = await apiCall();
  // Success handling
} catch (error) {
  console.error('API Error:', error);
  toast.error('Something went wrong');
}
```

---

## 🎉 Bắt Đầu Ngay!

Bạn đã sẵn sàng! Chọn một task và bắt đầu code:

- [ ] Kết nối login với backend
- [ ] Thêm feature mới
- [ ] Cải thiện UI
- [ ] Viết tests
- [ ] Deploy lên production

**Happy Coding! 🚀**

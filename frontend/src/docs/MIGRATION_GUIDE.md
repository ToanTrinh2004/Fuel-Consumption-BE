# Migration Guide - Refactoring to Feature-Based Architecture

## 🎯 Mục Tiêu

Tổ chức lại codebase theo module/feature-based architecture để:
- Dễ bảo trì và mở rộng
- Chuẩn bị sẵn cho kết nối Backend
- Code sạch sẽ, rõ ràng hơn
- Tách biệt concerns

## 📦 Di Chuyển Files

### Bước 1: Tạo Cấu Trúc Thư Mục

```bash
# Tạo feature folders
mkdir -p features/auth/components
mkdir -p features/chat/components
mkdir -p features/dashboard/components
mkdir -p features/settings/components
mkdir -p features/admin/components

# Tạo shared folders
mkdir -p shared/components
mkdir -p shared/types
mkdir -p shared/utils

# Tạo service folders
mkdir -p services/api
mkdir -p services/database

# Tạo docs folder
mkdir -p docs
```

### Bước 2: Di Chuyển Components

#### Auth Components
```bash
# Di chuyển auth components
mv components/LoginForm.tsx features/auth/components/
mv components/LoginFormSolid.tsx features/auth/components/
mv components/RegisterForm.tsx features/auth/components/
mv components/RegisterFormSolid.tsx features/auth/components/

# Copy GoogleIcon to shared (vì nhiều nơi dùng)
cp components/GoogleIcon.tsx shared/components/
```

#### Chat Components
```bash
mv components/ChatBot.tsx features/chat/components/
mv components/ChatHistory.tsx features/chat/components/
mv components/ChatInput.tsx features/chat/components/
mv components/EmptyState.tsx features/chat/components/
```

#### Dashboard Components
```bash
mv components/FuelConsumptionDashboard.tsx features/dashboard/components/
mv components/ComparisonDashboard.tsx features/dashboard/components/
mv components/DashboardHistory.tsx features/dashboard/components/
mv components/CompareDialog.tsx features/dashboard/components/
mv components/AdvancedCompareDialog.tsx features/dashboard/components/
```

#### Settings Components
```bash
mv components/SettingsDialog.tsx features/settings/components/
mv components/HelpDialog.tsx features/settings/components/
```

#### Admin Components
```bash
mv components/AdminDashboard.tsx features/admin/components/
```

#### Shared Components
```bash
# UI components đã có sẵn ở components/ui
# Di chuyển figma folder
mv components/figma shared/components/
```

### Bước 3: Di Chuyển Utils
```bash
mv utils/logoUtils.ts shared/utils/
mv utils/mockData.ts shared/utils/
```

### Bước 4: Xóa Folder Cũ (Sau khi đã di chuyển hết)
```bash
# Kiểm tra kỹ trước khi xóa!
rm -rf components/
rm -rf utils/
```

## 🔄 Cập Nhật Import Paths

### Trong App.tsx

**Trước:**
```typescript
import LoginForm from './components/LoginForm';
import ChatBot from './components/ChatBot';
import FuelConsumptionDashboard from './components/FuelConsumptionDashboard';
```

**Sau:**
```typescript
import { LoginForm } from './features/auth/components/LoginForm';
import { ChatBot } from './features/chat/components/ChatBot';
import { FuelConsumptionDashboard } from './features/dashboard/components/FuelConsumptionDashboard';
```

### Trong Feature Components

**Trước:**
```typescript
import { Button } from './components/ui/button';
import { logoUtils } from './utils/logoUtils';
```

**Sau:**
```typescript
import { Button } from '@/shared/components/ui/button';
import { logoUtils } from '@/shared/utils/logoUtils';
import type { User } from '@/shared/types';
```

### Cấu Hình Path Aliases (tsconfig.json)

Đảm bảo có path aliases:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/features/*": ["./features/*"],
      "@/shared/*": ["./shared/*"],
      "@/services/*": ["./services/*"]
    }
  }
}
```

## 📝 Cập Nhật Component Exports

### Chuyển từ Default Export sang Named Export

**Trước:**
```typescript
// LoginForm.tsx
export default function LoginForm() {
  // ...
}
```

**Sau:**
```typescript
// LoginForm.tsx
export function LoginForm() {
  // ...
}
```

**Lý do:** Named exports dễ refactor và IDE support tốt hơn.

## 🔗 Kết Nối với Services

### Thay Mock Data bằng API Calls

**Trước:**
```typescript
// Trong component
const handleLogin = () => {
  // Mock login
  setUser({ id: '1', email: 'user@example.com' });
};
```

**Sau:**
```typescript
import { authService } from '@/services/api/auth';

const handleLogin = async () => {
  try {
    const { user, token } = await authService.login({ email, password });
    localStorage.setItem('fluxmare_token', token);
    setUser(user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

## 🧹 Dọn Dẹp Code

### Loại Bỏ Comments Dư Thừa

**Trước:**
```typescript
// This is a button
// It handles click events
// Don't forget to add onClick prop
<Button onClick={handleClick}>Click me</Button>
```

**Sau:**
```typescript
<Button onClick={handleClick}>Click me</Button>
```

**Giữ lại comments có ý nghĩa:**
```typescript
// TODO: Connect to real API endpoint
// FIXME: Handle edge case when user is offline
// Database connection point for AI analysis
```

### Clean Up Unused Imports

```bash
# Sử dụng ESLint để tìm unused imports
npm run lint
```

## ✅ Checklist

### Phase 1: Structure Setup
- [ ] Tạo tất cả folders mới
- [ ] Copy/Di chuyển files theo feature
- [ ] Copy shared components
- [ ] Di chuyển utils

### Phase 2: Update Imports
- [ ] Cập nhật imports trong App.tsx
- [ ] Cập nhật imports trong auth components
- [ ] Cập nhật imports trong chat components
- [ ] Cập nhật imports trong dashboard components
- [ ] Cập nhật imports trong settings components
- [ ] Fix các import errors

### Phase 3: Type Definitions
- [ ] Tạo shared/types/index.ts
- [ ] Tạo feature-specific types
- [ ] Update component props với proper types
- [ ] Remove any types

### Phase 4: Services Setup
- [ ] Setup API client
- [ ] Create auth service
- [ ] Create chat service
- [ ] Create dashboard service
- [ ] Create settings service

### Phase 5: Testing & Cleanup
- [ ] Test login/register flow
- [ ] Test chat functionality
- [ ] Test dashboard features
- [ ] Test settings
- [ ] Remove commented code
- [ ] Remove unused imports
- [ ] Remove console.logs
- [ ] Verify no TypeScript errors

### Phase 6: Documentation
- [ ] Update README.md
- [ ] Create API documentation
- [ ] Add inline documentation where needed
- [ ] Create .env.example

## 🚨 Common Issues & Solutions

### Issue 1: Import Path Errors
```
Error: Cannot find module '@/features/auth/components/LoginForm'
```

**Solution:** 
- Check tsconfig.json path aliases
- Restart TypeScript server in IDE
- Clear node_modules and reinstall

### Issue 2: Circular Dependencies
```
Error: Circular dependency detected
```

**Solution:**
- Move shared types to shared/types
- Use type imports: `import type { User } from '@/shared/types'`

### Issue 3: Component Not Found After Move
```
Error: Module not found: './components/LoginForm'
```

**Solution:**
- Update all import statements
- Search globally for old import paths
- Use IDE's "Find in Files" feature

## 📊 Progress Tracking

```
[ ████████░░ ] 80% Complete

✅ Documentation created
✅ Folder structure defined
✅ Type definitions created
✅ API services created
⏳ File migration (manual step)
⏳ Import updates (manual step)
⏳ Testing
```

## 🎓 Best Practices Going Forward

1. **New Features**: Always create in `features/` folder
2. **Shared Code**: Place in `shared/` if used by 2+ features
3. **API Calls**: Always use services, never direct axios in components
4. **Types**: Define in feature's types.ts or shared/types
5. **Comments**: Only add if explaining WHY, not WHAT

## 📞 Need Help?

Nếu gặp vấn đề trong quá trình migration:
1. Check [DEVELOPMENT.md](./DEVELOPMENT.md) for guidelines
2. Review [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for API patterns
3. Refer to [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md) for architecture

---

**Estimated Time:** 2-3 hours for complete migration
**Complexity:** Medium
**Risk:** Low (có thể rollback nếu backup code)

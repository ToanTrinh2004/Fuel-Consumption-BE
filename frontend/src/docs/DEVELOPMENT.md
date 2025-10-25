# Development Guide

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Installation
```bash
# Clone repository
git clone <repository-url>
cd fluxmare

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Project Architecture

### Feature Structure
Mỗi feature module bao gồm:
```
features/[feature-name]/
├── components/          # React components
├── hooks/              # Custom hooks (optional)
├── types.ts            # TypeScript types
└── utils.ts            # Helper functions (optional)
```

### Component Guidelines

#### 1. Component Structure
```typescript
// features/auth/components/LoginForm.tsx

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { authService } from '@/services/api/auth';
import type { LoginFormProps } from '../types';

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await authService.login(email, password);
      onSuccess(data);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Component JSX */}
    </form>
  );
}
```

#### 2. Props Interface
```typescript
// features/auth/types.ts

export interface LoginFormProps {
  onSuccess: (data: AuthResponse) => void;
  onError?: (error: Error) => void;
}

export interface AuthResponse {
  user: User;
  token: string;
}
```

### State Management

#### Local State (useState)
```typescript
// For component-specific state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState<FormData>({});
```

#### Global State (Context - if needed)
```typescript
// shared/context/AuthContext.tsx
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## 🎨 Styling Guidelines

### Tailwind CSS Classes
```typescript
// ✅ Good - Organized by category
className="
  flex items-center justify-between
  p-4 rounded-lg
  bg-white dark:bg-gray-900
  border-2 border-gray-200
  hover:bg-gray-50 transition-colors
"

// ❌ Bad - Random order
className="bg-white flex border-2 p-4 hover:bg-gray-50 items-center"
```

### Dark Mode
```typescript
// Use conditional classes
className={`
  ${isDarkMode ? 'bg-[#1a1a1a] text-white' : 'bg-white text-gray-900'}
`}
```

## 📝 TypeScript Best Practices

### Type Definitions
```typescript
// shared/types/index.ts

export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
}

export interface PredictionAnalysis {
  fuelConsumption: number;
  fuelConsumptionTons: number;
  estimatedCost: number;
  efficiency: number;
  avgConsumptionRate: number;
  recommendation: string;
}

export type ThemeColor = 
  | 'default' 
  | 'pink' 
  | 'rose' 
  | 'fuchsia' 
  | 'blue' 
  | 'purple'
  | 'custom';
```

### Function Types
```typescript
// Use explicit return types
export async function fetchUserData(userId: string): Promise<User> {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
}
```

## 🧪 Testing (Future)

### Unit Tests
```typescript
// features/auth/__tests__/LoginForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../components/LoginForm';

describe('LoginForm', () => {
  it('should render login form', () => {
    render(<LoginForm onSuccess={jest.fn()} />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });
});
```

## 🔧 Utilities

### Helper Functions
```typescript
// shared/utils/format.ts

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
```

## 📦 Build & Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🐛 Debugging

### Console Logging
```typescript
// Use structured logging
console.log('[Auth]', 'Login attempt:', { email, timestamp: Date.now() });

// Avoid
console.log('login'); // Not helpful
```

### Error Handling
```typescript
try {
  await apiCall();
} catch (error) {
  if (error instanceof ApiError) {
    console.error('[API Error]', error.code, error.message);
  } else {
    console.error('[Unknown Error]', error);
  }
}
```

## 📚 Code Review Checklist

- [ ] Component follows single responsibility principle
- [ ] Props are properly typed
- [ ] Loading states are handled
- [ ] Error states are handled
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Dark mode support
- [ ] Responsive design
- [ ] No console.log in production code
- [ ] Proper import paths (@/ prefix)
- [ ] TypeScript strict mode passes

## 🔄 Git Workflow

### Commit Messages
```bash
# Format: [type] description

[feat] Add login functionality
[fix] Fix dashboard loading issue
[refactor] Reorganize auth components
[docs] Update API documentation
[style] Improve button styling
[test] Add unit tests for chat
```

### Branch Naming
```bash
feature/auth-google-login
fix/dashboard-crash
refactor/chat-components
```

## 🎯 Performance Tips

1. **Lazy Loading**
```typescript
const Dashboard = lazy(() => import('@/features/dashboard/components/FuelConsumptionDashboard'));
```

2. **Memoization**
```typescript
const expensiveCalculation = useMemo(() => 
  calculateFuelConsumption(data),
  [data]
);
```

3. **Debouncing**
```typescript
const debouncedSearch = useDebouncedCallback((value) => {
  searchAPI(value);
}, 500);
```

## 📖 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

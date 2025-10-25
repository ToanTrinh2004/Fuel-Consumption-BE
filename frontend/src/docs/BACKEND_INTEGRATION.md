# Backend Integration Guide

## 🎯 Overview

Tài liệu này hướng dẫn cách kết nối Frontend với Backend API cho ứng dụng Fluxmare.

## 🔌 API Connection Points

### 1. Authentication (`/services/api/auth.ts`)

#### Register User
```typescript
// Frontend → Backend
POST /api/auth/register
Body: {
  email: string;
  password: string;
  fullName: string;
}

// Backend → Frontend
Response: {
  success: boolean;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  token: string;
}
```

#### Login User
```typescript
// Frontend → Backend
POST /api/auth/login
Body: {
  email: string;
  password: string;
}

// Backend → Frontend
Response: {
  success: boolean;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  token: string;
}
```

#### Google OAuth
```typescript
// Frontend → Backend
POST /api/auth/google
Body: {
  googleToken: string;
}

// Backend → Frontend
Response: {
  success: boolean;
  user: User;
  token: string;
}
```

---

### 2. Chat & Predictions (`/services/api/chat.ts`)

#### Send Message & Get Prediction
```typescript
// Frontend → Backend
POST /api/chat/predict
Headers: {
  Authorization: 'Bearer {token}'
}
Body: {
  userId: string;
  message: string;
  features?: {
    vessel_type: string;
    speed_calc: number;
    distance: number;
    datetime: string;
    draft_aft: number;
    draft_fore: number;
    average_draft: number;
  };
}

// Backend → Frontend
Response: {
  success: boolean;
  prediction: {
    id: string;
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
  };
}
```

#### Get Chat History
```typescript
// Frontend → Backend
GET /api/chat/history?userId={userId}&limit=50
Headers: {
  Authorization: 'Bearer {token}'
}

// Backend → Frontend
Response: {
  success: boolean;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
}
```

#### Delete Chat History
```typescript
// Frontend → Backend
DELETE /api/chat/history/{userId}
Headers: {
  Authorization: 'Bearer {token}'
}

// Backend → Frontend
Response: {
  success: boolean;
  message: string;
}
```

---

### 3. Dashboard (`/services/api/dashboard.ts`)

#### Get Dashboard History
```typescript
// Frontend → Backend
GET /api/dashboard/history?userId={userId}&limit=100
Headers: {
  Authorization: 'Bearer {token}'
}

// Backend → Frontend
Response: {
  success: boolean;
  dashboards: Array<{
    id: string;
    timestamp: Date;
    query: string;
    analysis: PredictionAnalysis;
    vesselInfo: VesselInfo;
  }>;
}
```

#### Save Dashboard
```typescript
// Frontend → Backend
POST /api/dashboard/save
Headers: {
  Authorization: 'Bearer {token}'
}
Body: {
  userId: string;
  query: string;
  analysis: PredictionAnalysis;
  vesselInfo: VesselInfo;
}

// Backend → Frontend
Response: {
  success: boolean;
  dashboardId: string;
}
```

#### Compare Predictions (AI Analysis)
```typescript
// Frontend → Backend
POST /api/dashboard/compare
Headers: {
  Authorization: 'Bearer {token}'
}
Body: {
  userId: string;
  predictionIds: string[];
}

// Backend → Frontend
Response: {
  success: boolean;
  aiAnalysis: {
    summary: string;
    recommendations: string[];
    bestPrediction: {
      id: string;
      score: number;
      reasoning: string;
    };
    insights: {
      fuelVariation: string;
      efficiencyPattern: string;
      speedOptimization: string;
      costAnalysis: string;
    };
  };
}
```

---

### 4. Settings (`/services/api/settings.ts`)

#### Get User Settings
```typescript
// Frontend → Backend
GET /api/settings/{userId}
Headers: {
  Authorization: 'Bearer {token}'
}

// Backend → Frontend
Response: {
  success: boolean;
  settings: {
    theme: 'default' | 'custom';
    customColor?: string;
    isDarkMode: boolean;
    language: 'vi' | 'en';
  };
}
```

#### Update User Settings
```typescript
// Frontend → Backend
PUT /api/settings/{userId}
Headers: {
  Authorization: 'Bearer {token}'
}
Body: {
  theme?: 'default' | 'custom';
  customColor?: string;
  isDarkMode?: boolean;
  language?: 'vi' | 'en';
}

// Backend → Frontend
Response: {
  success: boolean;
  settings: UserSettings;
}
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Chat Messages Table
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
```

### Predictions Table
```sql
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  
  -- Analysis Results
  fuel_consumption DECIMAL(10,2) NOT NULL,
  fuel_consumption_tons DECIMAL(10,4) NOT NULL,
  estimated_cost INTEGER NOT NULL,
  efficiency INTEGER NOT NULL,
  avg_consumption_rate DECIMAL(10,2) NOT NULL,
  recommendation TEXT,
  
  -- Vessel Info
  vessel_type VARCHAR(100) NOT NULL,
  speed_calc DECIMAL(10,2) NOT NULL,
  distance DECIMAL(10,2) NOT NULL,
  datetime TIMESTAMP NOT NULL,
  draft_aft DECIMAL(10,2),
  draft_fore DECIMAL(10,2),
  average_draft DECIMAL(10,2),
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_predictions_user_id ON predictions(user_id);
CREATE INDEX idx_predictions_created_at ON predictions(created_at);
```

### User Settings Table
```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(50) DEFAULT 'default',
  custom_color VARCHAR(7),
  is_dark_mode BOOLEAN DEFAULT false,
  language VARCHAR(2) DEFAULT 'vi',
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Authentication Flow

### JWT Token
```typescript
// Token Structure
{
  userId: string;
  email: string;
  iat: number;  // Issued at
  exp: number;  // Expiration (7 days)
}

// Store in localStorage
localStorage.setItem('fluxmare_token', token);

// Add to API requests
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Refresh Token (Optional)
```typescript
// Frontend → Backend
POST /api/auth/refresh
Body: {
  refreshToken: string;
}

// Backend → Frontend
Response: {
  success: boolean;
  token: string;
}
```

---

## 🚀 Implementation Steps

### Step 1: Setup API Client
```typescript
// services/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('fluxmare_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fluxmare_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Step 2: Create Service Functions
```typescript
// services/api/auth.ts
import apiClient from './client';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: RegisterData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  googleLogin: async (googleToken: string) => {
    const response = await apiClient.post('/auth/google', { googleToken });
    return response.data;
  },
};
```

### Step 3: Use in Components
```typescript
// features/auth/components/LoginForm.tsx
import { authService } from '@/services/api/auth';

const handleLogin = async () => {
  try {
    const data = await authService.login(email, password);
    localStorage.setItem('fluxmare_token', data.token);
    setUser(data.user);
    navigate('/dashboard');
  } catch (error) {
    toast.error('Login failed');
  }
};
```

---

## 🧪 Testing

### Mock API for Development
```typescript
// services/api/mock.ts
export const mockAPI = {
  predict: async (message: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      prediction: {
        // ... mock data
      }
    };
  }
};
```

---

## 📝 Environment Variables

Create `.env` file:
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Feature Flags
VITE_ENABLE_MOCK_API=false
```

---

## 🔍 Error Handling

### Standard Error Response
```typescript
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid email format',
    details?: any
  }
}
```

### Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Server error

---

## 📊 WebSocket for Real-time Updates (Optional)

```typescript
// services/websocket/client.ts
const ws = new WebSocket(process.env.VITE_WS_URL);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle real-time prediction updates
};
```

---

## ✅ Checklist

- [ ] Setup API client with interceptors
- [ ] Implement authentication endpoints
- [ ] Create chat/prediction endpoints
- [ ] Setup dashboard data fetching
- [ ] Configure database schema
- [ ] Add error handling
- [ ] Test all API endpoints
- [ ] Add loading states
- [ ] Implement retry logic
- [ ] Setup WebSocket (optional)

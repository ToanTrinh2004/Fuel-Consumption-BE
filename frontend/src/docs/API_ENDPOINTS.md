# API Endpoints Reference

## Base URL
```
Production: https://api.fluxmare.com
Development: http://localhost:3000/api
```

## Authentication

All authenticated requests require Bearer token in header:
```
Authorization: Bearer {token}
```

---

## 🔐 Auth Endpoints

### POST /auth/register
Tạo tài khoản mới

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "Nguyen Van A"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400` - Validation error (email exists, weak password)
- `500` - Server error

---

### POST /auth/login
Đăng nhập

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "fullName": "Nguyen Van A"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `401` - Invalid credentials
- `404` - User not found

---

### POST /auth/google
Google OAuth login

**Request:**
```json
{
  "googleToken": "google-oauth-token-here"
}
```

**Response:** Same as login

---

### GET /auth/me
Get current user info (requires auth)

**Response (200):**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

---

### POST /auth/logout
Logout user (requires auth)

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 💬 Chat Endpoints

### POST /chat/predict
Gửi message và nhận prediction

**Request:**
```json
{
  "userId": "uuid-here",
  "message": "Predict fuel for container ship, 12 knots, 500nm",
  "features": {
    "vessel_type": "container_1_tier1",
    "speed_calc": 6.17,
    "distance": 500,
    "datetime": "2024-01-15T10:00:00Z",
    "draft_aft": 8.5,
    "draft_fore": 8.2,
    "average_draft": 8.35
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "prediction": {
    "id": "pred-uuid",
    "timestamp": "2024-01-15T10:05:30Z",
    "query": "Predict fuel for container ship...",
    "analysis": {
      "fuelConsumption": 1234.56,
      "fuelConsumptionTons": 1.235,
      "estimatedCost": 850000,
      "efficiency": 78,
      "avgConsumptionRate": 2.47,
      "recommendation": "Tốc độ hiện tại tối ưu..."
    },
    "vesselInfo": {
      "type": "container_1_tier1",
      "speedCalc": 6.17,
      "distance": 500,
      "datetime": "2024-01-15T10:00:00Z"
    }
  },
  "messageId": "msg-uuid"
}
```

---

### GET /chat/history
Lấy lịch sử chat

**Query Params:**
- `userId` (required)
- `limit` (default: 50)
- `offset` (default: 0)

**Response (200):**
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg-uuid-1",
      "role": "user",
      "content": "Predict fuel consumption...",
      "timestamp": "2024-01-15T10:00:00Z"
    },
    {
      "id": "msg-uuid-2",
      "role": "assistant",
      "content": "Based on your input...",
      "timestamp": "2024-01-15T10:00:15Z"
    }
  ],
  "total": 42
}
```

---

### DELETE /chat/history/:userId
Xóa toàn bộ lịch sử chat

**Response (200):**
```json
{
  "success": true,
  "message": "Chat history deleted",
  "deletedCount": 42
}
```

---

### DELETE /chat/messages/:messageId
Xóa 1 message

**Response (200):**
```json
{
  "success": true,
  "message": "Message deleted"
}
```

---

## 📊 Dashboard Endpoints

### GET /dashboard/history
Lấy lịch sử dashboard predictions

**Query Params:**
- `userId` (required)
- `limit` (default: 100)
- `offset` (default: 0)

**Response (200):**
```json
{
  "success": true,
  "dashboards": [
    {
      "id": "dash-uuid",
      "timestamp": "2024-01-15T10:00:00Z",
      "query": "Container ship prediction",
      "analysis": { /* same as prediction.analysis */ },
      "vesselInfo": { /* same as prediction.vesselInfo */ }
    }
  ],
  "total": 25
}
```

---

### POST /dashboard/save
Lưu dashboard prediction

**Request:**
```json
{
  "userId": "uuid-here",
  "query": "Container ship prediction",
  "analysis": {
    "fuelConsumption": 1234.56,
    "fuelConsumptionTons": 1.235,
    "estimatedCost": 850000,
    "efficiency": 78,
    "avgConsumptionRate": 2.47,
    "recommendation": "..."
  },
  "vesselInfo": {
    "type": "container_1_tier1",
    "speedCalc": 6.17,
    "distance": 500,
    "datetime": "2024-01-15T10:00:00Z"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "dashboardId": "dash-uuid"
}
```

---

### POST /dashboard/compare
So sánh predictions với AI analysis

**Request:**
```json
{
  "userId": "uuid-here",
  "predictionIds": ["pred-uuid-1", "pred-uuid-2", "pred-uuid-3"]
}
```

**Response (200):**
```json
{
  "success": true,
  "aiAnalysis": {
    "summary": "Dựa trên 3 predictions, Prediction #2 là tối ưu nhất...",
    "recommendations": [
      "Giảm tốc độ 10% để tiết kiệm 15% fuel",
      "Tối ưu draft để cải thiện efficiency",
      "Chọn route ngắn hơn nếu có thể"
    ],
    "bestPrediction": {
      "id": "pred-uuid-2",
      "score": 85,
      "reasoning": "Cân bằng tốt giữa fuel, speed và cost"
    },
    "insights": {
      "fuelVariation": "Chênh lệch 23% giữa worst và best case",
      "efficiencyPattern": "Efficiency giảm 5% khi tăng speed 20%",
      "speedOptimization": "Tốc độ tối ưu: 5.5-6.0 m/s",
      "costAnalysis": "Tiết kiệm $150,000 với optimal profile"
    }
  }
}
```

---

### DELETE /dashboard/:dashboardId
Xóa dashboard

**Response (200):**
```json
{
  "success": true,
  "message": "Dashboard deleted"
}
```

---

## ⚙️ Settings Endpoints

### GET /settings/:userId
Lấy user settings

**Response (200):**
```json
{
  "success": true,
  "settings": {
    "theme": "default",
    "customColor": null,
    "isDarkMode": false,
    "language": "vi"
  }
}
```

---

### PUT /settings/:userId
Cập nhật settings

**Request:**
```json
{
  "theme": "purple",
  "isDarkMode": true,
  "customColor": "#8b5cf6",
  "language": "vi"
}
```

**Response (200):**
```json
{
  "success": true,
  "settings": {
    "theme": "purple",
    "customColor": "#8b5cf6",
    "isDarkMode": true,
    "language": "vi"
  }
}
```

---

## 🚨 Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      "field": "email",
      "issue": "Email already exists"
    }
  }
}
```

### Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Not authenticated
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict (e.g., duplicate email)
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

---

## 📈 Rate Limiting

- Authentication: 5 requests/minute
- Chat/Predictions: 20 requests/minute
- Dashboard: 50 requests/minute
- Settings: 10 requests/minute

**Rate Limit Headers:**
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1705320000
```

---

## 🔍 Pagination

Endpoints supporting pagination:
- `/chat/history`
- `/dashboard/history`

**Query params:**
```
?limit=50&offset=0
```

**Response meta:**
```json
{
  "data": [...],
  "total": 142,
  "limit": 50,
  "offset": 0,
  "hasMore": true
}
```

---

## ✅ Health Check

### GET /health

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "redis": "connected",
    "ai_model": "ready"
  }
}
```

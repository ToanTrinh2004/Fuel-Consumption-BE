# Fluxmare - Maritime Fuel Consumption Predictor

AI-powered chatbot for ship fuel analysis using FuelCast 7-feature benchmark

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📁 Project Structure

```
fluxmare/
├── App.tsx                          # Main application
│
├── features/                        # Feature modules (tsx + ts same folder)
│   ├── auth/                       # Login & Register
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── GoogleIcon.tsx
│   │   └── types.ts               ← Same folder as tsx
│   │
│   ├── chat/                       # Main chat interface
│   │   ├── ChatBot.tsx
│   │   ├── EmptyState.tsx
│   │   └── types.ts               ← Same folder
│   │
│   ├── chat-input/                 # Chat input box
│   ├── chat-history/               # Chat history
│   │
│   ├── dashboard/                  # Prediction dashboards
│   │   ├── FuelConsumptionDashboard.tsx
│   │   ├── ComparisonDashboard.tsx
│   │   └── types.ts               ← Same folder
│   │
│   ├── dashboard-history/          # Dashboard history
│   ├── settings/                   # Settings & themes
│   └── admin/                      # Admin panel
│
├── shared/                          # Shared resources
│   ├── components/
│   │   ├── ui/                     # shadcn components (48 files)
│   │   └── figma/                  # Figma imports
│   ├── types/                      # Global types
│   └── utils/                      # Helper functions
│
├── services/api/                    # API services
└── styles/                          # Global styles
```

## ⚡ Setup Instructions

1. **Run organization script:**

   **Linux/Mac:**
   ```bash
   chmod +x organize.sh
   ./organize.sh
   ```

   **Windows:**
   ```bash
   organize.bat
   ```

2. **Update imports** in App.tsx (see UPDATE_IMPORTS.md)

3. **Test application:**
   ```bash
   npm run dev
   ```

4. **Cleanup** (after success):
   ```bash
   rm organize.sh organize.bat UPDATE_IMPORTS.md FINAL_STRUCTURE.md
   ```

## ✨ Features

- 🔐 **Authentication** - Email + Google OAuth
- 💬 **AI Chat Interface** - FuelCast predictions with 7 features
- 📊 **Fuel Dashboard** - Real-time consumption analysis
- 🔄 **Comparison** - Compare up to 5 predictions
- 🎨 **Theming** - 15+ colors + Dark/Light mode + Custom RGB
- 📱 **Responsive** - Mobile & Desktop optimized

## 🛠️ Tech Stack

- **React 18** + **TypeScript**
- **Tailwind CSS v4**
- **Motion** (Framer Motion)
- **Recharts** - Data visualization
- **shadcn/ui** - Component library
- **Vite** - Build tool

## 🔌 Backend Integration

Service functions ready for API connection:

```typescript
import { authService } from './services/api/auth';
import { chatService } from './services/api/chat';
import { dashboardService } from './services/api/dashboard';
import { settingsService } from './services/api/settings';
```

## 📝 Import Example

```typescript
// Feature imports (no /components/ subfolder)
import { ChatBot } from './features/chat/ChatBot';
import { LoginForm } from './features/auth/LoginForm';
import { SettingsDialog } from './features/settings/SettingsDialog';

// Shared imports
import { Button } from './shared/components/ui/button';
import { logoUtils } from './shared/utils/logoUtils';
import type { User } from './shared/types';

// Service imports
import { chatService } from './services/api/chat';
```

## 🎯 Key Design Principles

- **Flat Structure** - tsx + ts files in same folder (no /components/ subfolder)
- **Function-Based** - Each feature has dedicated folder
- **Colocation** - Related files grouped together
- **Clean Imports** - Simple, direct import paths

## 📄 License

MIT License

---

Made with ❤️ by Fluxmare Team

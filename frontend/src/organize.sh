#!/bin/bash

echo "🚀 Organizing Fluxmare project structure..."

# Create feature folders (NO components subfolder)
mkdir -p features/auth
mkdir -p features/chat
mkdir -p features/chat-input
mkdir -p features/chat-history
mkdir -p features/dashboard
mkdir -p features/dashboard-history
mkdir -p features/settings
mkdir -p features/admin
mkdir -p shared/components/ui
mkdir -p shared/components/figma
mkdir -p shared/utils
mkdir -p shared/types

# Move Auth files (tsx + ts together)
mv components/LoginForm.tsx features/auth/ 2>/dev/null
mv components/LoginFormSolid.tsx features/auth/ 2>/dev/null
mv components/RegisterForm.tsx features/auth/ 2>/dev/null
mv components/RegisterFormSolid.tsx features/auth/ 2>/dev/null
mv components/GoogleIcon.tsx features/auth/ 2>/dev/null
mv features/auth/types.ts features/auth/types.ts 2>/dev/null

# Move Chat files (tsx + ts together)
mv components/ChatBot.tsx features/chat/ 2>/dev/null
mv components/EmptyState.tsx features/chat/ 2>/dev/null
mv features/chat/types.ts features/chat/types.ts 2>/dev/null

# Move Chat Input files
mv components/ChatInput.tsx features/chat-input/ 2>/dev/null

# Move Chat History files
mv components/ChatHistory.tsx features/chat-history/ 2>/dev/null

# Move Dashboard files (tsx + ts together)
mv components/FuelConsumptionDashboard.tsx features/dashboard/ 2>/dev/null
mv components/ComparisonDashboard.tsx features/dashboard/ 2>/dev/null
mv components/CompareDialog.tsx features/dashboard/ 2>/dev/null
mv components/AdvancedCompareDialog.tsx features/dashboard/ 2>/dev/null
mv features/dashboard/types.ts features/dashboard/types.ts 2>/dev/null

# Move Dashboard History files
mv components/DashboardHistory.tsx features/dashboard-history/ 2>/dev/null

# Move Settings files (tsx + ts together)
mv components/SettingsDialog.tsx features/settings/ 2>/dev/null
mv components/HelpDialog.tsx features/settings/ 2>/dev/null
mv features/settings/types.ts features/settings/types.ts 2>/dev/null

# Move Admin files
mv components/AdminDashboard.tsx features/admin/ 2>/dev/null

# Move UI components to shared
mv components/ui/* shared/components/ui/ 2>/dev/null

# Move figma to shared
mv components/figma/* shared/components/figma/ 2>/dev/null

# Move utils to shared
mv utils/* shared/utils/ 2>/dev/null

# Move types to shared
mv shared/types/index.ts shared/types/index.ts 2>/dev/null

# Clean up empty folders
rmdir components/ui 2>/dev/null
rmdir components/figma 2>/dev/null
rmdir components 2>/dev/null
rmdir utils 2>/dev/null

# Delete all documentation folders and files
rm -rf docs
rm -rf guidelines
rm -f Attributions.md

echo "✅ Organization complete!"
echo ""
echo "📁 New structure:"
echo "├── App.tsx"
echo "├── README.md"
echo "├── features/"
echo "│   ├── auth/ (LoginForm.tsx, RegisterForm.tsx, types.ts...)"
echo "│   ├── chat/ (ChatBot.tsx, EmptyState.tsx, types.ts)"
echo "│   ├── chat-input/ (ChatInput.tsx)"
echo "│   ├── chat-history/ (ChatHistory.tsx)"
echo "│   ├── dashboard/ (FuelConsumptionDashboard.tsx, types.ts...)"
echo "│   ├── dashboard-history/ (DashboardHistory.tsx)"
echo "│   ├── settings/ (SettingsDialog.tsx, HelpDialog.tsx, types.ts)"
echo "│   └── admin/ (AdminDashboard.tsx)"
echo "├── shared/"
echo "│   ├── components/ui/ (48 shadcn files)"
echo "│   ├── components/figma/ (ImageWithFallback.tsx)"
echo "│   ├── types/ (index.ts)"
echo "│   └── utils/ (logoUtils.ts, mockData.ts)"
echo "├── services/api/"
echo "└── styles/"
echo ""
echo "🔄 Next: Update imports in App.tsx (see UPDATE_IMPORTS.md)"

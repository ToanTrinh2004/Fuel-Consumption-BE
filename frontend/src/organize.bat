@echo off
echo 🚀 Organizing Fluxmare project structure...

REM Create feature folders (NO components subfolder)
mkdir features\auth 2>nul
mkdir features\chat 2>nul
mkdir features\chat-input 2>nul
mkdir features\chat-history 2>nul
mkdir features\dashboard 2>nul
mkdir features\dashboard-history 2>nul
mkdir features\settings 2>nul
mkdir features\admin 2>nul
mkdir shared\components\ui 2>nul
mkdir shared\components\figma 2>nul
mkdir shared\utils 2>nul
mkdir shared\types 2>nul

REM Move Auth files (tsx + ts together)
move components\LoginForm.tsx features\auth\ 2>nul
move components\LoginFormSolid.tsx features\auth\ 2>nul
move components\RegisterForm.tsx features\auth\ 2>nul
move components\RegisterFormSolid.tsx features\auth\ 2>nul
move components\GoogleIcon.tsx features\auth\ 2>nul

REM Move Chat files (tsx + ts together)
move components\ChatBot.tsx features\chat\ 2>nul
move components\EmptyState.tsx features\chat\ 2>nul

REM Move Chat Input files
move components\ChatInput.tsx features\chat-input\ 2>nul

REM Move Chat History files
move components\ChatHistory.tsx features\chat-history\ 2>nul

REM Move Dashboard files (tsx + ts together)
move components\FuelConsumptionDashboard.tsx features\dashboard\ 2>nul
move components\ComparisonDashboard.tsx features\dashboard\ 2>nul
move components\CompareDialog.tsx features\dashboard\ 2>nul
move components\AdvancedCompareDialog.tsx features\dashboard\ 2>nul

REM Move Dashboard History files
move components\DashboardHistory.tsx features\dashboard-history\ 2>nul

REM Move Settings files (tsx + ts together)
move components\SettingsDialog.tsx features\settings\ 2>nul
move components\HelpDialog.tsx features\settings\ 2>nul

REM Move Admin files
move components\AdminDashboard.tsx features\admin\ 2>nul

REM Move UI components to shared
move components\ui\* shared\components\ui\ 2>nul

REM Move figma to shared
move components\figma\* shared\components\figma\ 2>nul

REM Move utils to shared
move utils\* shared\utils\ 2>nul

REM Clean up empty folders
rmdir components\ui 2>nul
rmdir components\figma 2>nul
rmdir components 2>nul
rmdir utils 2>nul

REM Delete all documentation folders and files
rmdir /s /q docs 2>nul
rmdir /s /q guidelines 2>nul
del Attributions.md 2>nul

echo ✅ Organization complete!
echo.
echo 📁 New structure:
echo ├── App.tsx
echo ├── README.md
echo ├── features/
echo │   ├── auth/ (LoginForm.tsx, RegisterForm.tsx, types.ts...)
echo │   ├── chat/ (ChatBot.tsx, EmptyState.tsx, types.ts)
echo │   ├── chat-input/ (ChatInput.tsx)
echo │   ├── chat-history/ (ChatHistory.tsx)
echo │   ├── dashboard/ (FuelConsumptionDashboard.tsx, types.ts...)
echo │   ├── dashboard-history/ (DashboardHistory.tsx)
echo │   ├── settings/ (SettingsDialog.tsx, HelpDialog.tsx, types.ts)
echo │   └── admin/ (AdminDashboard.tsx)
echo ├── shared/
echo │   ├── components/ui/ (48 shadcn files)
echo │   ├── components/figma/ (ImageWithFallback.tsx)
echo │   ├── types/ (index.ts)
echo │   └── utils/ (logoUtils.ts, mockData.ts)
echo ├── services/api/
echo └── styles/
echo.
echo 🔄 Next: Update imports in App.tsx (see UPDATE_IMPORTS.md)
pause

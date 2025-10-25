import { useState, useEffect } from 'react';
import LoginForm from './features/auth/LoginForm';
import RegisterForm from './components/RegisterForm';
import ChatBot from './components/ChatBot';
import AdminDashboard from './components/AdminDashboard';
import { Toaster } from './components/ui/sonner';

export type ThemeColor = 'default' | 'pink' | 'blue' | 'purple' | 'ocean' | 'sunset' | 'emerald' | 'rose' | 'indigo' | 'teal' | 'amber' | 'lime' | 'fuchsia' | 'sky' | 'custom';
export type Language = 'vi' | 'en';

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [themeColor, setThemeColor] = useState<ThemeColor>('default');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [customColor, setCustomColor] = useState<string>('#ff0080');
  const [language, setLanguage] = useState<Language>('vi');

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    const userEmail = localStorage.getItem('currentUserEmail');
    const savedTheme = localStorage.getItem('themeColor') as ThemeColor;
    const savedDarkMode = localStorage.getItem('isDarkMode');
    const savedCustomColor = localStorage.getItem('customColor');
    const savedLanguage = localStorage.getItem('language') as Language;
    if (user) {
      setCurrentUser(user);
    }
    if (userEmail) {
      setCurrentUserEmail(userEmail);
    }
    if (savedTheme) {
      setThemeColor(savedTheme);
    }
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === 'true');
    }
    if (savedCustomColor) {
      setCustomColor(savedCustomColor);
    }
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLogin = (usernameOrEmail: string, password?: string) => {
    // Check admin account
    if (usernameOrEmail === 'fluxmare_admin@gmail.com' && password === '19062004') {
      setCurrentUser('admin');
      setCurrentUserEmail('fluxmare_admin@gmail.com');
      localStorage.setItem('currentUser', 'admin');
      localStorage.setItem('currentUserEmail', 'fluxmare_admin@gmail.com');
      return;
    }

    // Regular user login
    setCurrentUser(usernameOrEmail);
    setCurrentUserEmail(usernameOrEmail);
    localStorage.setItem('currentUser', usernameOrEmail);
    localStorage.setItem('currentUserEmail', usernameOrEmail);
  };

  const handleRegister = (username: string, email: string, password: string) => {
    localStorage.setItem(`user_${username}`, password);
    localStorage.setItem(`email_${username}`, email);
    setCurrentUser(username);
    setCurrentUserEmail(email);
    localStorage.setItem('currentUser', username);
    localStorage.setItem('currentUserEmail', email);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserEmail(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserEmail');
  };

  const handleChangeTheme = (theme: ThemeColor) => {
    setThemeColor(theme);
    localStorage.setItem('themeColor', theme);
  };

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('isDarkMode', String(newMode));
  };

  const handleChangeCustomColor = (color: string) => {
    setCustomColor(color);
    localStorage.setItem('customColor', color);
    setThemeColor('custom');
    localStorage.setItem('themeColor', 'custom');
  };

  const handleChangeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  if (!currentUser) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-white'} flex items-center justify-center p-4 relative overflow-hidden`}>
        {/* Animated background pattern */}
        <div className={`absolute inset-0 ${isDarkMode ? 'opacity-5' : 'opacity-10'}`}>
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-600 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10">
          {showRegister ? (
            <RegisterForm 
              onRegister={handleRegister}
              onToggleForm={() => setShowRegister(false)}
              isDarkMode={isDarkMode}
              accentColor={themeColor === 'custom' ? customColor : undefined}
            />
          ) : (
            <LoginForm 
              onLogin={handleLogin}
              onToggleForm={() => setShowRegister(true)}
              isDarkMode={isDarkMode}
              accentColor={themeColor === 'custom' ? customColor : undefined}
            />
          )}
        </div>
      </div>
    );
  }

  // Check if admin
  if (currentUser === 'admin' && currentUserEmail === 'fluxmare_admin@gmail.com') {
    return (
      <>
        <AdminDashboard onLogout={handleLogout} />
        <Toaster 
          position="top-right"
          theme={isDarkMode ? 'dark' : 'light'}
          closeButton
          richColors
        />
      </>
    );
  }

  return (
    <>
      <ChatBot 
        username={currentUser}
        onLogout={handleLogout}
        themeColor={themeColor}
        isDarkMode={isDarkMode}
        customColor={customColor}
        language={language}
        onChangeTheme={handleChangeTheme}
        onToggleDarkMode={handleToggleDarkMode}
        onChangeCustomColor={handleChangeCustomColor}
        onChangeLanguage={handleChangeLanguage}
      />
      <Toaster 
        position="top-right"
        theme={isDarkMode ? 'dark' : 'light'}
        closeButton
        richColors
      />
    </>
  );
}
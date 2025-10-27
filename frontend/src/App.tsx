import { useState, useEffect } from 'react';
import LoginForm from './features/auth/LoginForm';
import RegisterForm from './components/RegisterForm';
import ChatBot from './components/ChatBot';
import AdminDashboard from './components/AdminDashboard';
import { Toaster } from './components/ui/sonner';
import { authService } from './services/api/auth';

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
    const token = localStorage.getItem('fluxmare_token');
    const savedTheme = localStorage.getItem('themeColor') as ThemeColor;
    const savedDarkMode = localStorage.getItem('isDarkMode');
    const savedCustomColor = localStorage.getItem('customColor');
    const savedLanguage = localStorage.getItem('language') as Language;
    if (!token) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentUserEmail');
    }

    if (user && token) {
      setCurrentUser(user);
    }
    if (userEmail && token) {
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

  const handleLogin = async (usernameOrEmail: string, password?: string) => {
    const email = usernameOrEmail.trim().toLowerCase();
    const adminEmail = 'fluxmare_admin@gmail.com';
    const adminPassword = '19062004';

    if (!password) {
      throw new Error('Vui lòng nhập mật khẩu.');
    }

    if (email === adminEmail && password === adminPassword) {
      setCurrentUser('admin');
      setCurrentUserEmail(adminEmail);
      localStorage.setItem('currentUser', 'admin');
      localStorage.setItem('currentUserEmail', adminEmail);
      localStorage.setItem('fluxmare_token', 'admin-session');
      return;
    }

    try {
      const { access_token } = await authService.login({ email, password });
      localStorage.setItem('fluxmare_token', access_token);
      setCurrentUser(email);
      setCurrentUserEmail(email);
      localStorage.setItem('currentUser', email);
      localStorage.setItem('currentUserEmail', email);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const fullName = username.trim();
    try {
      const { access_token } = await authService.register({
        email: normalizedEmail,
        password,
        fullName: fullName || undefined,
      });
      localStorage.setItem('fluxmare_token', access_token);
      setCurrentUser(fullName || normalizedEmail);
      setCurrentUserEmail(normalizedEmail);
      localStorage.setItem('currentUser', fullName || normalizedEmail);
      localStorage.setItem('currentUserEmail', normalizedEmail);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserEmail(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('fluxmare_token');
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

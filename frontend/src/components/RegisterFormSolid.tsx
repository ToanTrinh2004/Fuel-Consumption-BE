import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, UserPlus, User, Chrome } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import fluxmareLogo from 'figma:asset/48159e3c19318e6ee94d6f46a7da4911deba57ae.png';

interface RegisterFormProps {
  onRegister: (username: string, email: string, password: string) => void;
  onToggleForm: () => void;
  isDarkMode: boolean;
}

export default function RegisterFormSolid({ onRegister, onToggleForm, isDarkMode }: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }

    if (!agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản sử dụng!');
      return;
    }

    if (password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Email không hợp lệ!');
      return;
    }

    onRegister(username, email, password);
  };

  // Solid colors based on theme
  const primaryColor = isDarkMode ? '#a855f7' : '#8b5cf6'; // purple-500 / purple-600
  const accentColor = isDarkMode ? '#ec4899' : '#db2777'; // pink-500 / pink-600

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${
      isDarkMode 
        ? 'bg-black' 
        : 'bg-white'
    }`}>
      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Glass card with solid border */}
        <div className={`relative rounded-3xl p-5 backdrop-blur-xl shadow-2xl ${
          isDarkMode 
            ? 'bg-slate-900/40 border-2' 
            : 'bg-white/60 border-2'
        }`}
        style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.4), rgba(30, 41, 59, 0.3))'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(248, 250, 252, 0.5))',
          borderColor: primaryColor
        }}
        >
          {/* Solid border glow effect */}
          <div 
            className="absolute inset-0 rounded-3xl blur-xl -z-10 opacity-30" 
            style={{ backgroundColor: primaryColor }}
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-3"
          >
            <img 
              src={fluxmareLogo} 
              alt="Fluxmare Logo" 
              className="w-14 h-14 object-contain"
            />
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-5"
          >
            <h1 
              className="text-xl mb-1.5"
              style={{ 
                color: primaryColor,
                textShadow: isDarkMode ? `0 0 40px ${primaryColor}40` : 'none'
              }}
            >
              Tạo tài khoản Fluxmare
            </h1>
            <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Bắt đầu phân tích nhiên liệu tàu thủy
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Username Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className={`block text-xs mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Username
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`pl-11 h-9 rounded-xl border-2 transition-all ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500' 
                      : 'bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                  style={{ borderColor: 'transparent' }}
                  onFocus={(e) => e.target.style.borderColor = primaryColor}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  placeholder="johndoe"
                  required
                />
              </div>
            </motion.div>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className={`block text-xs mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-11 h-9 rounded-xl border-2 transition-all ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500' 
                      : 'bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                  style={{ borderColor: 'transparent' }}
                  onFocus={(e) => e.target.style.borderColor = primaryColor}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className={`block text-xs mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-11 pr-11 h-9 rounded-xl border-2 transition-all ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500' 
                      : 'bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                  style={{ borderColor: 'transparent' }}
                  onFocus={(e) => e.target.style.borderColor = primaryColor}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
                  } transition-colors`}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className={`block text-xs mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-11 pr-11 h-9 rounded-xl border-2 transition-all ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500' 
                      : 'bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                  style={{ borderColor: 'transparent' }}
                  onFocus={(e) => e.target.style.borderColor = primaryColor}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
                  } transition-colors`}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </motion.div>

            {/* Terms & Conditions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-start gap-2 pt-1"
            >
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className={`mt-0.5 ${isDarkMode ? 'border-slate-600' : 'border-slate-300'}`}
              />
              <label
                htmlFor="terms"
                className={`text-xs cursor-pointer ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}
              >
                Tôi đồng ý với{' '}
                <span style={{ color: primaryColor }}>
                  Điều khoản sử dụng
                </span>
                {' '}và{' '}
                <span style={{ color: primaryColor }}>
                  Chính sách bảo mật
                </span>
              </label>
            </motion.div>

            {/* Register Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                type="submit"
                className="w-full h-9 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:opacity-90"
                style={{
                  backgroundColor: primaryColor,
                }}
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Đăng ký
              </Button>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="relative my-3 flex items-center gap-4"
            >
              <div className={`flex-1 border-t ${isDarkMode ? 'border-slate-600' : 'border-slate-300'}`} />
              <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
                hoặc tiếp tục với
              </span>
              <div className={`flex-1 border-t ${isDarkMode ? 'border-slate-600' : 'border-slate-300'}`} />
            </motion.div>

            {/* Google Login Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Button
                type="button"
                onClick={() => alert('Google login sẽ được tích hợp trong phiên bản production')}
                variant="outline"
                className={`w-full h-9 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                  isDarkMode 
                    ? 'bg-slate-800/50 hover:bg-slate-800' 
                    : 'bg-white/80 hover:bg-white'
                }`}
                style={{
                  borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.5)'
                }}
              >
                <Chrome className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`} />
                <span className={isDarkMode ? 'text-slate-200' : 'text-slate-900'}>
                  Continue with Google
                </span>
              </Button>
            </motion.div>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center mt-3"
            >
              <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Đã có tài khoản?{' '}
              </span>
              <button
                type="button"
                onClick={onToggleForm}
                className="text-sm transition-all hover:opacity-80"
                style={{ color: primaryColor }}
              >
                Đăng nhập ngay
              </button>
            </motion.div>
          </form>
        </div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center mt-3"
        >
          <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            © 2025 Fluxmare. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

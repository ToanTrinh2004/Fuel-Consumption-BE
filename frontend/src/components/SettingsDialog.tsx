import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Settings, Trash2, Download, Upload, Bell, Type, Palette, AlertTriangle, Languages } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { ThemeColor, Language } from '../App';
import { t } from '../utils/translations';

interface SettingsDialogProps {
  themeColor: ThemeColor;
  isDarkMode: boolean;
  customColor: string;
  language: Language;
  onChangeTheme: (theme: ThemeColor) => void;
  onChangeCustomColor: (color: string) => void;
  onChangeLanguage: (lang: Language) => void;
  onClearHistory: () => void;
  username: string;
}

export default function SettingsDialog({ themeColor, isDarkMode, customColor, language, onChangeTheme, onChangeCustomColor, onChangeLanguage, onClearHistory, username }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [showClearAlert, setShowClearAlert] = useState(false);
  const [fontSize, setFontSize] = useState(parseInt(localStorage.getItem('fontSize') || '14'));
  const [notifications, setNotifications] = useState(localStorage.getItem('notifications') !== 'false');
  const [autoSave, setAutoSave] = useState(localStorage.getItem('autoSave') !== 'false');

  const themeColors: { value: ThemeColor; label: string; previewLight?: string; previewDark?: string; isCustom?: boolean }[] = [
    { value: 'default', label: t('defaultTheme', language), previewLight: 'bg-white border-2 border-[#2002a6]', previewDark: 'bg-black border-2 border-[#e3d5f7]' },
    { value: 'custom', label: t('customTheme', language), isCustom: true },
  ];

  const handleThemeChange = (theme: ThemeColor) => {
    onChangeTheme(theme);
    toast.success(t('themeChanged', language));
  };

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    localStorage.setItem('fontSize', String(newSize));
    document.documentElement.style.setProperty('--font-size', `${newSize}px`);
  };

  const handleNotificationsChange = (checked: boolean) => {
    setNotifications(checked);
    localStorage.setItem('notifications', String(checked));
    toast.success(checked ? t('notificationsEnabled', language) : t('notificationsDisabled', language));
  };

  const handleAutoSaveChange = (checked: boolean) => {
    setAutoSave(checked);
    localStorage.setItem('autoSave', String(checked));
    toast.success(checked ? t('autoSaveEnabled', language) : t('autoSaveDisabled', language));
  };

  const handleLanguageChange = (lang: Language) => {
    onChangeLanguage(lang);
    toast.success(t('languageChanged', lang));
  };

  const handleExportData = () => {
    const data = {
      username,
      conversations: localStorage.getItem(`conversations_${username}`),
      settings: {
        themeColor,
        fontSize,
        notifications,
        autoSave,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fluxmare-backup-${username}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success(t('dataExported', language));
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            if (data.conversations) {
              localStorage.setItem(`conversations_${username}`, data.conversations);
            }
            if (data.settings) {
              Object.entries(data.settings).forEach(([key, value]) => {
                localStorage.setItem(key, String(value));
              });
            }
            toast.success(t('dataImported', language));
          } catch (error) {
            toast.error(t('invalidFile', language));
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearHistoryConfirm = () => {
    onClearHistory();
    setShowClearAlert(false);
    setOpen(false);
    toast.success(t('historyCleared', language));
  };

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';

  const getColors = (theme: ThemeColor, dark: boolean) => {
    const base = {
      default: dark ? { accent: 'text-[#e3d5f7]', border: 'border-[#e3d5f7]/60' } : { accent: 'text-[#2002a6]', border: 'border-[#2002a6]/50' },
      pink: dark ? { accent: 'text-pink-300', border: 'border-pink-400/60' } : { accent: 'text-pink-700', border: 'border-pink-400/50' },
      rose: dark ? { accent: 'text-rose-300', border: 'border-rose-400/60' } : { accent: 'text-rose-700', border: 'border-rose-400/50' },
      fuchsia: dark ? { accent: 'text-fuchsia-300', border: 'border-fuchsia-400/60' } : { accent: 'text-fuchsia-700', border: 'border-fuchsia-400/50' },
      purple: dark ? { accent: 'text-purple-300', border: 'border-purple-400/50' } : { accent: 'text-purple-700', border: 'border-purple-400/50' },
      indigo: dark ? { accent: 'text-indigo-300', border: 'border-indigo-400/60' } : { accent: 'text-indigo-700', border: 'border-indigo-400/50' },
      blue: dark ? { accent: 'text-blue-300', border: 'border-blue-400/50' } : { accent: 'text-blue-700', border: 'border-blue-400/50' },
      sky: dark ? { accent: 'text-sky-300', border: 'border-sky-400/60' } : { accent: 'text-sky-700', border: 'border-sky-400/50' },
      ocean: dark ? { accent: 'text-cyan-300', border: 'border-cyan-400/50' } : { accent: 'text-cyan-700', border: 'border-cyan-400/50' },
      teal: dark ? { accent: 'text-teal-300', border: 'border-teal-400/60' } : { accent: 'text-teal-700', border: 'border-teal-400/50' },
      emerald: dark ? { accent: 'text-emerald-300', border: 'border-emerald-400/50' } : { accent: 'text-emerald-700', border: 'border-emerald-400/50' },
      lime: dark ? { accent: 'text-lime-300', border: 'border-lime-400/60' } : { accent: 'text-lime-700', border: 'border-lime-400/50' },
      amber: dark ? { accent: 'text-amber-300', border: 'border-amber-400/60' } : { accent: 'text-amber-700', border: 'border-amber-400/50' },
      sunset: dark ? { accent: 'text-orange-300', border: 'border-orange-400/50' } : { accent: 'text-orange-700', border: 'border-orange-400/50' },
      custom: dark ? { accent: 'text-white', border: 'border-white/60' } : { accent: 'text-gray-900', border: 'border-gray-900/50' },
    };
    return base[theme];
  };

  const colors = getColors(themeColor, isDarkMode);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className={`inline-flex items-center justify-center rounded-md ${colors.border} ${colors.accent} hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all h-7 w-7 border-2`}
          title={t('settings', language)}
        >
          <Settings className="h-3 w-3" />
        </DialogTrigger>
        <DialogContent className={`max-w-2xl max-h-[85vh] overflow-hidden ${bgClass}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${textClass}`}>
              <Settings className="h-5 w-5" />
              {t('settingsTitle', language)}
            </DialogTitle>
            <DialogDescription className={isDarkMode ? 'text-pink-300' : 'text-purple-600'}>
              {t('settingsDescription', language)}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className={`grid w-full grid-cols-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white/80'}`}>
              <TabsTrigger value="appearance" className="text-xs">
                <Palette className="h-3 w-3 mr-1" />
                {t('appearance', language)}
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs">
                <Bell className="h-3 w-3 mr-1" />
                {t('notifications', language)}
              </TabsTrigger>
              <TabsTrigger value="data" className="text-xs">
                <Download className="h-3 w-3 mr-1" />
                {t('data', language)}
              </TabsTrigger>
            </TabsList>

            <div className="overflow-y-auto max-h-[calc(85vh-200px)] mt-4 pr-2">
              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white/80'}`}>
                    <Label className={`${textClass} mb-3 block`}>{t('themeColor', language)}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {themeColors.map((theme) => (
                        <Button
                          key={theme.value}
                          variant={themeColor === theme.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleThemeChange(theme.value)}
                          className={`justify-start h-9 ${
                            themeColor === theme.value
                              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0'
                              : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                          }`}
                        >
                          {theme.isCustom ? (
                            <div className="flex items-center gap-2 mr-2">
                              <div 
                                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: customColor }}
                              ></div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 mr-2">
                              <div className={`w-3 h-3 rounded-full ${theme.previewLight}`}></div>
                              <div className={`w-3 h-3 rounded-full ${theme.previewDark}`}></div>
                            </div>
                          )}
                          <span className="text-xs">{theme.label}</span>
                        </Button>
                      ))}
                    </div>
                    
                    {/* RGB Color Picker */}
                    <div className={`mt-3 p-4 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                      <Label className={`${textClass} text-xs mb-2 block`}>{t('customColorPicker', language)}</Label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={customColor}
                          onChange={(e) => onChangeCustomColor(e.target.value)}
                          className="h-12 w-24 rounded cursor-pointer border-2 border-gray-400"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={customColor}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (/^#[0-9A-F]{6}$/i.test(val)) {
                                onChangeCustomColor(val);
                              }
                            }}
                            onBlur={(e) => {
                              // Auto-complete partial hex codes
                              const val = e.target.value;
                              if (/^#[0-9A-F]{0,5}$/i.test(val) && val.length < 7) {
                                onChangeCustomColor(customColor);
                              }
                            }}
                            placeholder="#FF0080"
                            className={`w-full px-3 py-2 text-sm rounded border-2 ${
                              isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'
                            }`}
                          />
                        </div>
                      </div>
                      <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Nhấp vào ô màu hoặc nhập mã hex (vd: #FF0080, #00FF00)
                      </p>
                    </div>
                    
                    <p className={`text-xs mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Màu mặc định + Vô số tùy chọn RGB tùy chỉnh × 2 chế độ sáng/tối
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white/80'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Languages className={`h-4 w-4 ${isDarkMode ? 'text-pink-300' : 'text-purple-500'}`} />
                      <Label className={textClass}>{t('language', language)}</Label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={language === 'vi' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleLanguageChange('vi')}
                        className={`justify-center h-9 ${
                          language === 'vi'
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0'
                            : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                        }`}
                      >
                        🇻🇳 Tiếng Việt
                      </Button>
                      <Button
                        variant={language === 'en' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleLanguageChange('en')}
                        className={`justify-center h-9 ${
                          language === 'en'
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0'
                            : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                        }`}
                      >
                        🇬🇧 English
                      </Button>
                    </div>
                    <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t('languageDescription', language)}
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white/80'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Type className={`h-4 w-4 ${isDarkMode ? 'text-pink-300' : 'text-purple-500'}`} />
                        <Label className={textClass}>{t('fontSize', language)}: {fontSize}px</Label>
                      </div>
                    </div>
                    <Slider
                      value={[fontSize]}
                      onValueChange={handleFontSizeChange}
                      min={12}
                      max={18}
                      step={1}
                      className="w-full"
                    />
                    <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t('fontSizeDescription', language)}
                    </p>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white/80'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <Label className={textClass}>{t('notifications', language)}</Label>
                      <Switch checked={notifications} onCheckedChange={handleNotificationsChange} />
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t('notificationsSetting', language)}
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white/80'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <Label className={textClass}>{t('autoSave', language)}</Label>
                      <Switch checked={autoSave} onCheckedChange={handleAutoSaveChange} />
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t('autoSaveDescription', language)}
                    </p>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Data Tab */}
              <TabsContent value="data" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white/80'}`}>
                    <Label className={`${textClass} mb-3 block`}>{t('dataManagement', language)}</Label>
                    <div className="space-y-2">
                      <Button
                        onClick={handleExportData}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {t('exportData', language)}
                      </Button>
                      <Button
                        onClick={handleImportData}
                        variant="outline"
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {t('importData', language)}
                      </Button>
                    </div>
                    <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {language === 'vi' ? 'Sao lưu và khôi phục dữ liệu của bạn' : 'Backup and restore your data'}
                    </p>
                  </div>

                  <Separator />

                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} border-2 ${isDarkMode ? 'border-red-500/50' : 'border-red-200'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <Label className="text-red-500">{language === 'vi' ? 'Vùng nguy hiểm' : 'Danger Zone'}</Label>
                    </div>
                    <Button
                      onClick={() => setShowClearAlert(true)}
                      variant="destructive"
                      className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('clearHistory', language)}
                    </Button>
                    <p className={`text-xs mt-2 text-red-500`}>
                      {language === 'vi' ? 'Hành động này không thể hoàn tác!' : 'This action cannot be undone!'}
                    </p>
                  </div>
                </motion.div>
              </TabsContent>

              
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Clear History Confirmation */}
      <AlertDialog open={showClearAlert} onOpenChange={setShowClearAlert}>
        <AlertDialogContent className={isDarkMode ? 'bg-gray-900 border-red-500' : 'bg-white'}>
          <AlertDialogHeader>
            <AlertDialogTitle className={`flex items-center gap-2 ${textClass}`}>
              <AlertTriangle className="h-5 w-5 text-red-500" />
              {language === 'vi' ? 'Xác nhận xóa lịch sử' : 'Confirm Clear History'}
            </AlertDialogTitle>
            <AlertDialogDescription className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              {t('clearHistoryConfirm', language)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel', language)}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearHistoryConfirm}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            >
              {language === 'vi' ? 'Xóa tất cả' : 'Delete All'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

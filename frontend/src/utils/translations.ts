import { Language } from '../App';

export const translations = {
  vi: {
    // Common
    save: 'Lưu',
    cancel: 'Hủy',
    delete: 'Xóa',
    edit: 'Sửa',
    close: 'Đóng',
    confirm: 'Xác nhận',
    
    // Auth
    login: 'Đăng nhập',
    register: 'Đăng ký',
    logout: 'Thoát',
    email: 'Email',
    password: 'Mật khẩu',
    username: 'Tên người dùng',
    
    // Header
    darkMode: 'Chế độ tối',
    lightMode: 'Chế độ sáng',
    settings: 'Cài đặt',
    help: 'Trợ giúp',
    
    // Sidebar
    history: 'Lịch sử',
    newChat: 'Trò chuyện mới',
    dashboardHistory: 'Lịch sử Dashboard',
    hideHistory: 'Ẩn lịch sử',
    showHistory: 'Hiện lịch sử',
    
    // Chat
    typeMessage: 'Nhập tin nhắn...',
    send: 'Gửi',
    suggestions: 'Gợi ý câu hỏi',
    
    // Dashboard Common
    dashboard: 'Bảng điều khiển',
    compare: 'So Sánh',
    added: 'Đã thêm',
    comparePredictions: 'So Sánh Predictions',
    export: 'Xuất dữ liệu',
    fullscreen: 'Toàn màn hình',
    exitFullscreen: 'Thoát toàn màn hình',
    
    // Features (7 inputs)
    features: 'Thông số đầu vào',
    speedOverGround: 'Tốc độ tàu',
    windSpeed: 'Tốc độ gió',
    waveHeight: 'Độ cao sóng',
    wavePeriod: 'Chu kỳ sóng',
    seaFloorDepth: 'Độ sâu đáy biển',
    temperature: 'Nhiệt độ',
    oceanCurrent: 'Dòng chảy đại dương',
    
    // Units
    knots: 'hải lý/h',
    metersPerSecond: 'm/s',
    meters: 'm',
    seconds: 'giây',
    celsius: '°C',
    kgPerSecond: 'kg/s',
    
    // Fuel Dashboard
    fuelConsumption: 'Tiêu thụ nhiên liệu',
    momentaryFuel: 'Nhiên liệu tức thời',
    prediction: 'Dự đoán',
    vesselInfo: 'Thông tin tàu',
    vesselType: 'Loại tàu',
    speedCalc: 'Tốc độ tính toán',
    distance: 'Quãng đường',
    interval: 'Khoảng thời gian',
    analysisTime: 'Thời gian phân tích',
    environmentalConditions: 'Điều kiện môi trường',
    operationalMetrics: 'Chỉ số vận hành',
    datetime: 'Ngày giờ',
    inputFeatures: '7 Thông Số Đầu Vào',
    inputFeaturesDetail: 'Chi Tiết 7 Thông Số + Dự Đoán',
    environmentalDesc: 'Điều kiện môi trường và vận hành thực tế',
    featuresAnalysis: 'Phân Tích Thông Số',
    inputProfile: 'Hồ Sơ Đầu Vào',
    normalizedViz: 'Trực quan hóa normalized (thang 0-100)',
    inputValues: 'Giá Trị Đầu Vào',
    featureVisualization: 'Trực quan hóa 7 thông số đầu vào (normalized)',
    comparisonTable: 'Bảng so sánh đầy đủ các thông số đầu vào và kết quả dự đoán',
    savedAnalyses: 'phân tích đã lưu',
    dashboardHistoryTitle: 'Lịch sử Dashboard',
    containerShip: 'Tàu container',
    
    // Comparison Dashboard
    comparisonDashboard: 'Bảng so sánh',
    fuelTrend: 'Xu hướng nhiên liệu',
    radarComparison: 'So sánh radar',
    detailedComparison: 'So sánh chi tiết',
    optimal: 'Tối ưu',
    fluxmareAnalysis: 'Phân Tích Fluxmare',
    aiOptimization: 'Tối ưu hóa dựa trên phân tích dữ liệu và AI',
    poweredBy: 'Được hỗ trợ bởi Fluxmare Fuel Optimization Engine',
    
    // Settings
    settingsTitle: 'Cài đặt Fluxmare',
    settingsDescription: 'Tùy chỉnh trải nghiệm chatbot của bạn',
    appearance: 'Giao diện',
    notifications: 'Thông báo',
    data: 'Dữ liệu',
    privacy: 'Bảo mật',
    language: 'Ngôn ngữ / Language',
    languageDescription: 'Chọn ngôn ngữ hiển thị giao diện',
    themeColor: 'Theme Màu Sắc',
    defaultTheme: '🎨 Mặc định',
    customTheme: '🎨 Tùy chỉnh RGB',
    customColorPicker: 'Bảng màu RGB tùy chỉnh',
    fontSize: 'Kích thước chữ',
    fontSizeDescription: 'Điều chỉnh kích thước chữ hiển thị',
    notificationsSetting: 'Nhận thông báo khi có phản hồi mới',
    autoSave: 'Tự động lưu',
    autoSaveDescription: 'Tự động lưu cuộc trò chuyện',
    dataManagement: 'Quản lý dữ liệu',
    exportData: 'Xuất dữ liệu',
    importData: 'Nhập dữ liệu',
    clearHistory: 'Xóa lịch sử',
    clearHistoryConfirm: 'Bạn có chắc muốn xóa toàn bộ lịch sử?',
    
    // Toast messages
    themeChanged: 'Đã thay đổi theme!',
    languageChanged: 'Đã chuyển sang tiếng Việt',
    notificationsEnabled: 'Đã bật thông báo',
    notificationsDisabled: 'Đã tắt thông báo',
    autoSaveEnabled: 'Đã bật tự động lưu',
    autoSaveDisabled: 'Đã tắt tự động lưu',
    dataExported: 'Đã xuất dữ liệu thành công!',
    dataImported: 'Đã nhập dữ liệu thành công! Vui lòng tải lại trang.',
    invalidFile: 'File không hợp lệ!',
    historyCleared: 'Đã xóa toàn bộ lịch sử!',
  },
  en: {
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    confirm: 'Confirm',
    
    // Auth
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    username: 'Username',
    
    // Header
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    settings: 'Settings',
    help: 'Help',
    
    // Sidebar
    history: 'History',
    newChat: 'New Chat',
    dashboardHistory: 'Dashboard History',
    hideHistory: 'Hide History',
    showHistory: 'Show History',
    
    // Chat
    typeMessage: 'Type a message...',
    send: 'Send',
    suggestions: 'Suggested Questions',
    
    // Dashboard Common
    dashboard: 'Dashboard',
    compare: 'Compare',
    added: 'Added',
    comparePredictions: 'Compare Predictions',
    export: 'Export',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    
    // Features (7 inputs)
    features: 'Input Features',
    speedOverGround: 'Ship Speed',
    windSpeed: 'Wind Speed',
    waveHeight: 'Wave Height',
    wavePeriod: 'Wave Period',
    seaFloorDepth: 'Sea Floor Depth',
    temperature: 'Temperature',
    oceanCurrent: 'Ocean Current',
    
    // Units
    knots: 'knots',
    metersPerSecond: 'm/s',
    meters: 'm',
    seconds: 's',
    celsius: '°C',
    kgPerSecond: 'kg/s',
    
    // Fuel Dashboard
    fuelConsumption: 'Fuel Consumption',
    momentaryFuel: 'Momentary Fuel',
    prediction: 'Prediction',
    vesselInfo: 'Vessel Information',
    vesselType: 'Vessel Type',
    speedCalc: 'Calculated Speed',
    distance: 'Distance',
    interval: 'Interval',
    analysisTime: 'Analysis Time',
    environmentalConditions: 'Environmental Conditions',
    operationalMetrics: 'Operational Metrics',
    datetime: 'Date & Time',
    inputFeatures: '7 Input Features',
    inputFeaturesDetail: '7 Features + Prediction Details',
    environmentalDesc: 'Actual environmental and operational conditions',
    featuresAnalysis: 'Features Analysis',
    inputProfile: 'Input Profile',
    normalizedViz: 'Normalized visualization (0-100 scale)',
    inputValues: 'Input Values',
    featureVisualization: 'Visualization of 7 input features (normalized)',
    comparisonTable: 'Complete comparison table of input features and prediction results',
    savedAnalyses: 'saved analyses',
    dashboardHistoryTitle: 'Dashboard History',
    containerShip: 'Container Ship',
    
    // Comparison Dashboard
    comparisonDashboard: 'Comparison Dashboard',
    fuelTrend: 'Fuel Trend',
    radarComparison: 'Radar Comparison',
    detailedComparison: 'Detailed Comparison',
    optimal: 'Optimal',
    fluxmareAnalysis: 'Fluxmare Analysis',
    aiOptimization: 'AI-powered optimization based on data analysis',
    poweredBy: 'Powered by Fluxmare Fuel Optimization Engine',
    
    // Settings
    settingsTitle: 'Fluxmare Settings',
    settingsDescription: 'Customize your chatbot experience',
    appearance: 'Appearance',
    notifications: 'Notifications',
    data: 'Data',
    privacy: 'Privacy',
    language: 'Language / Ngôn ngữ',
    languageDescription: 'Select interface language',
    themeColor: 'Theme Color',
    defaultTheme: '🎨 Default',
    customTheme: '🎨 Custom RGB',
    customColorPicker: 'Custom RGB Color Picker',
    fontSize: 'Font Size',
    fontSizeDescription: 'Adjust display font size',
    notificationsSetting: 'Receive notifications for new responses',
    autoSave: 'Auto Save',
    autoSaveDescription: 'Automatically save conversations',
    dataManagement: 'Data Management',
    exportData: 'Export Data',
    importData: 'Import Data',
    clearHistory: 'Clear History',
    clearHistoryConfirm: 'Are you sure you want to clear all history?',
    
    // Toast messages
    themeChanged: 'Theme changed!',
    languageChanged: 'Switched to English',
    notificationsEnabled: 'Notifications enabled',
    notificationsDisabled: 'Notifications disabled',
    autoSaveEnabled: 'Auto save enabled',
    autoSaveDisabled: 'Auto save disabled',
    dataExported: 'Data exported successfully!',
    dataImported: 'Data imported successfully! Please reload the page.',
    invalidFile: 'Invalid file!',
    historyCleared: 'All history cleared!',
  }
};

export const t = (key: string, lang: Language): string => {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};

// Feature names mapping
export const getFeatureName = (englishName: string, lang: Language): string => {
  const featureMap: Record<string, { vi: string; en: string }> = {
    'Ship_SpeedOverGround': { vi: 'Tốc độ tàu', en: 'Ship Speed' },
    'Weather_WindSpeed10M': { vi: 'Tốc độ gió', en: 'Wind Speed' },
    'Weather_WaveHeight': { vi: 'Độ cao sóng', en: 'Wave Height' },
    'Weather_WavePeriod': { vi: 'Chu kỳ sóng', en: 'Wave Period' },
    'Environment_SeaFloorDepth': { vi: 'Độ sâu đáy biển', en: 'Sea Floor Depth' },
    'Weather_Temperature2M': { vi: 'Nhiệt độ', en: 'Temperature' },
    'Weather_OceanCurrentVelocity': { vi: 'Dòng chảy đại dương', en: 'Ocean Current' },
    'Total_MomentaryFuel': { vi: 'Nhiên liệu tức thời', en: 'Momentary Fuel' },
    'Total.MomentaryFuel': { vi: 'Nhiên liệu tức thời', en: 'Momentary Fuel' },
    // Short names
    'Speed': { vi: 'Tốc độ', en: 'Speed' },
    'Wind': { vi: 'Gió', en: 'Wind' },
    'Wave': { vi: 'Sóng', en: 'Wave' },
    'Period': { vi: 'Chu kỳ', en: 'Period' },
    'Depth': { vi: 'Độ sâu', en: 'Depth' },
    'Temp': { vi: 'Nhiệt độ', en: 'Temp' },
    'Current': { vi: 'Dòng chảy', en: 'Current' },
    'Fuel': { vi: 'Nhiên liệu', en: 'Fuel' },
  };
  
  return featureMap[englishName]?.[lang] || englishName;
};

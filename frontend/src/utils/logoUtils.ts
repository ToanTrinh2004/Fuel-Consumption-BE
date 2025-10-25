// Helper function to get dynamic logo filter based on theme and mode
export const getLogoFilter = (
  isDarkMode: boolean,
  themeColor: string,
  customColor?: string
): string => {
  // For custom color mode, sidebar background is:
  // - Dark mode: #0a0a0a (very dark) -> use white logo
  // - Light mode: #ffffff (white) -> use dark logo
  // So we base it on isDarkMode, NOT customColor
  if (themeColor === 'custom') {
    return isDarkMode 
      ? 'brightness(0) invert(1)' // White logo for dark background
      : 'brightness(0.25) contrast(1.5) saturate(1.2)'; // Dark logo for light background
  }

  // For default themes, use simple dark/light logic
  if (isDarkMode) {
    return 'brightness(0) invert(1)'; // White logo for dark mode
  } else {
    // Light mode: Make logo very dark for maximum contrast
    return 'brightness(0.25) contrast(1.5) saturate(1.2)';
  }
};

// Calculate luminance of a hex color
const getColorLuminance = (hexColor: string): number => {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  // Calculate relative luminance
  const [rs, gs, bs] = [r, g, b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Get logo opacity based on context (normal vs empty state)
export const getLogoOpacity = (isEmptyState: boolean = false): number => {
  return isEmptyState ? 0.5 : 1;
};

// Get contrasting text color based on background
export const getContrastColor = (
  isDarkMode: boolean,
  themeColor: string,
  customColor?: string,
  opacity: number = 1
): string => {
  // For custom color mode, we need to check the actual background color of the sidebar
  // Sidebar background is ALWAYS:
  // - Dark mode: #0a0a0a (very dark)
  // - Light mode: #ffffff (white)
  // So we calculate contrast based on isDarkMode, NOT customColor
  if (themeColor === 'custom') {
    // In dark mode, sidebar is #0a0a0a (dark) -> use light text
    // In light mode, sidebar is #ffffff (light) -> use dark text
    return isDarkMode 
      ? `rgba(255, 255, 255, ${opacity})` 
      : `rgba(10, 10, 10, ${opacity})`;
  }

  // For default themes - ensure strong contrast
  return isDarkMode 
    ? `rgba(255, 255, 255, ${opacity})` 
    : `rgba(10, 10, 10, ${opacity})`; // Very dark for light mode
};

// Get secondary text color (for subtitles, timestamps, etc.)
export const getSecondaryTextColor = (
  isDarkMode: boolean,
  themeColor: string,
  customColor?: string
): string => {
  return getContrastColor(isDarkMode, themeColor, customColor, isDarkMode ? 0.6 : 0.65);
};

// Get icon color with proper contrast
export const getIconColor = (
  isDarkMode: boolean,
  themeColor: string,
  customColor?: string
): string => {
  return getContrastColor(isDarkMode, themeColor, customColor, isDarkMode ? 0.7 : 0.75);
};

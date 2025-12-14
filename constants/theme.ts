import { Platform } from 'react-native';

export const Colors = {
  primary: '#F47B20',
  primaryLight: '#FFF3E0', // Light version of orange
  text: '#11181C', // Dark grey/black (not solid)
  black: '#11181C', // Not solid black
  white: '#FCFCFC', // Not solid white
  red: '#D32F2F', // Error color
  redLight: '#FFEBEE', // Very light shade of red
  green: '#388E3C', // Success color
  greenLight: '#E8F5E9', // Light green
  yellow: '#FBC02D', // Warning color
  yellowLight: '#FFF9C4', // Light yellow
  greyNormal: '#9E9E9E',
  greyLight: '#E0E0E0',
  greyDark: '#616161',
  greyNeutral: '#0B1220',
  background: '#FCFCFC', // Added background for compatibility
  tint: '#F28C28', // Added tint for compatibility
  icon: '#687076', // Added icon for compatibility
  tabIconDefault: '#687076', // Added tabIconDefault for compatibility
  tabIconSelected: '#F28C28', // Added tabIconSelected for compatibility
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

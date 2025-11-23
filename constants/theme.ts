/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Palette = {
  transparent: '#00000000',
  colorPrimary: '#e81c4f',
  colorPrimaryDark: '#b1183f',
  colorPrimaryExtraDark: '#700c25',
  colorAccent: '#FFAB40',
  colorAccentDark: '#FF6D00',
  white: '#FFFFFF',
  black: '#000000',
  textPrimaryLight: '#F8BBD0',
  textPrimary: '#212121',
  textSecondary: '#757575',
  listChoiceNormalBgLight: '#fafafa',
  listChoicePressedBgLight: '#ffdddd',
  icons: '#FFFFFF',
  divider: '#BDBDBD',
};

const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: Palette.textPrimary,
    background: Palette.white,
    tint: Palette.colorPrimary,
    icon: Palette.textSecondary,
    tabIconDefault: Palette.textSecondary,
    tabIconSelected: Palette.colorPrimary,
    primary: Palette.colorPrimary,
    primaryDark: Palette.colorPrimaryDark,
    accent: Palette.colorAccent,
    textSecondary: Palette.textSecondary,
    divider: Palette.divider,
    headerBackground: Palette.colorPrimary,
    sectionHeaderBackground: Palette.colorPrimaryDark,
    listBackground: Palette.listChoiceNormalBgLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
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

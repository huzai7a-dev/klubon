/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors
) {
  // We are now forcing light mode and using a flat color structure
  // If a specific color is passed via props (though we should discourage this), return it.
  // Otherwise return the color from our Colors constant.
  
  if (props.light) {
    return props.light;
  }
  
  return Colors[colorName];
}

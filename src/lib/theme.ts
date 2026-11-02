import { useColorScheme } from 'react-native';

const light = {
  bg: '#FFF8F2',
  card: '#FFFFFF',
  text: '#2B1D14',
  muted: '#8A776A',
  border: '#EADFD6',
  primary: '#E2672B',
  onPrimary: '#FFFFFF',
  danger: '#C62828',
};

const dark: typeof light = {
  bg: '#17110D',
  card: '#241B15',
  text: '#F5ECE4',
  muted: '#A8978A',
  border: '#3A2E26',
  primary: '#F08A4B',
  onPrimary: '#1A0F08',
  danger: '#EF5350',
};

export type Theme = typeof light;

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}

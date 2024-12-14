import { useMediaQuery, useTheme } from "@mui/material";

export const useScreenSize = (): string => {
  const theme = useTheme();

  const isSmScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMdScreen = useMediaQuery(theme.breakpoints.up('sm') && theme.breakpoints.down('md'));
  const isLgScreen = useMediaQuery(theme.breakpoints.up('md') && theme.breakpoints.down('lg'));
  const isXlScreen = useMediaQuery(theme.breakpoints.up('lg'));

  if (isSmScreen) return 'sm';
  if (isMdScreen) return 'md';
  if (isLgScreen) return 'lg';
  if (isXlScreen) return 'xl';
  
  return 'xs'; // Fallback for extra small screens (xs)
};
import React, { createContext, useContext, useMemo } from 'react';
import type { RadarTheme, ThemeMode } from '@gatsby-techradar/core';
import { LIGHT_THEME, createTheme } from '@gatsby-techradar/core';

/**
 * What `<RadarChart theme={...}>` accepts: a mode name, a partial token set
 * (merged over that mode's built-in theme), or a complete theme.
 */
export type ThemeInput = ThemeMode | Partial<RadarTheme> | RadarTheme;

const RadarThemeContext = createContext<RadarTheme>(LIGHT_THEME);

/** Normalize any accepted theme input into a complete RadarTheme. */
export function resolveThemeInput(input?: ThemeInput): RadarTheme {
  if (!input) return LIGHT_THEME;
  if (typeof input === 'string') return createTheme(input);
  return createTheme(input.mode ?? 'light', input);
}

export const RadarThemeProvider: React.FC<{
  theme?: ThemeInput;
  children: React.ReactNode;
}> = ({ theme, children }) => {
  const value = useMemo(() => resolveThemeInput(theme), [theme]);
  return (
    <RadarThemeContext.Provider value={value}>
      {children}
    </RadarThemeContext.Provider>
  );
};

/** Read the active radar theme. Defaults to LIGHT_THEME outside a provider. */
export function useRadarTheme(): RadarTheme {
  return useContext(RadarThemeContext);
}

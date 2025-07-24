import { useState, useCallback, useMemo } from 'react';
import type { ColorState, UseColorsReturn, HexColor } from '../types/colors';
import { DEFAULT_COLORS, replaceAllColors, isValidHexColor } from '../utils/colorUtils';

/**
 * Хук для управления цветами SVG логотипа
 */
export const useColors = (
  initialColors: Partial<ColorState> = {},
  svgContent?: string
): UseColorsReturn => {
  // Состояние цветов с дефолтными значениями
  const [colors, setColors] = useState<ColorState>(() => ({
    ...DEFAULT_COLORS,
    ...initialColors
  }));

  /**
   * Установка цвета для конкретной группы
   */
  const setColor = useCallback((group: keyof ColorState, color: HexColor) => {
    if (!isValidHexColor(color)) {
      console.warn(`Недопустимый HEX цвет: ${color}`);
      return;
    }

    setColors(prevColors => ({
      ...prevColors,
      [group]: color
    }));
  }, []);

  /**
   * Сброс цветов к дефолтным значениям
   */
  const resetColors = useCallback(() => {
    setColors(DEFAULT_COLORS);
  }, []);

  /**
   * Применение цветовой схемы
   */
  const applyColorScheme = useCallback((scheme: Partial<ColorState>) => {
    // Валидация всех цветов в схеме
    const validatedScheme: Partial<ColorState> = {};
    
    Object.entries(scheme).forEach(([key, value]) => {
      if (value && isValidHexColor(value)) {
        validatedScheme[key as keyof ColorState] = value;
      } else {
        console.warn(`Недопустимый цвет в схеме для ${key}: ${value}`);
      }
    });

    setColors(prevColors => ({
      ...prevColors,
      ...validatedScheme
    }));
  }, []);

  /**
   * Получение модифицированного SVG с примененными цветами
   */
  const getModifiedSvg = useCallback((): string => {
    if (!svgContent) {
      console.warn('SVG контент не предоставлен');
      return '';
    }

    const result = replaceAllColors(svgContent, colors, {
      caseSensitive: false,
      preserveGradients: true
    });

    if (result.errors.length > 0) {
      console.warn('Ошибки при замене цветов:', result.errors);
    }

    return result.modifiedSvg;
  }, [svgContent, colors]);

  // Мемоизированный результат
  const memoizedReturn = useMemo<UseColorsReturn>(() => ({
    colors,
    setColor,
    resetColors,
    applyColorScheme,
    getModifiedSvg
  }), [colors, setColor, resetColors, applyColorScheme, getModifiedSvg]);

  return memoizedReturn;
};

/**
 * Предустановленные цветовые схемы
 */
export const COLOR_SCHEMES = {
  default: DEFAULT_COLORS,
  
  corporate: {
    primary: '#2C3E50',
    secondary: '#3498DB',
    accent: '#1ABC9C',
    neutral: '#ECF0F1',
    special: '#3498DB',
    gradientStart: '#34495E',
    gradientEnd: '#2C3E50'
  },
  
  warm: {
    primary: '#E74C3C',
    secondary: '#F39C12',
    accent: '#D35400',
    neutral: '#FDF2E9',
    special: '#F39C12',
    gradientStart: '#EC7063',
    gradientEnd: '#E74C3C'
  },
  
  cool: {
    primary: '#3498DB',
    secondary: '#9B59B6',
    accent: '#2980B9',
    neutral: '#EBF5FB',
    special: '#9B59B6',
    gradientStart: '#5DADE2',
    gradientEnd: '#3498DB'
  },
  
  nature: {
    primary: '#27AE60',
    secondary: '#16A085',
    accent: '#229954',
    neutral: '#E8F8F5',
    special: '#16A085',
    gradientStart: '#58D68D',
    gradientEnd: '#27AE60'
  },
  
  sunset: {
    primary: '#FF6B6B',
    secondary: '#FFE66D',
    accent: '#FF8E53',
    neutral: '#FFF3E0',
    special: '#FFE66D',
    gradientStart: '#FF8A80',
    gradientEnd: '#FF6B6B'
  },
  
  monochrome: {
    primary: '#2C3E50',
    secondary: '#7F8C8D',
    accent: '#34495E',
    neutral: '#F8F9FA',
    special: '#7F8C8D',
    gradientStart: '#5D6D7E',
    gradientEnd: '#2C3E50'
  }
} as const;

/**
 * Хук для работы с предустановленными схемами
 */
export const useColorSchemes = () => {
  const [currentScheme, setCurrentScheme] = useState<keyof typeof COLOR_SCHEMES>('default');

  const applyScheme = useCallback((schemeName: keyof typeof COLOR_SCHEMES) => {
    setCurrentScheme(schemeName);
    return COLOR_SCHEMES[schemeName];
  }, []);

  const getSchemeNames = useCallback(() => {
    return Object.keys(COLOR_SCHEMES) as Array<keyof typeof COLOR_SCHEMES>;
  }, []);

  const getCurrentScheme = useCallback(() => {
    return COLOR_SCHEMES[currentScheme];
  }, [currentScheme]);

  return {
    currentScheme,
    applyScheme,
    getSchemeNames,
    getCurrentScheme,
    schemes: COLOR_SCHEMES
  };
};

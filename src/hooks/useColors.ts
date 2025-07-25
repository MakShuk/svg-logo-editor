import { useState, useCallback, useEffect, useRef } from 'react';
import type { ColorState, UseColorsReturn, HexColor } from '../types/colors';
import {
  DEFAULT_COLORS,
  replaceAllColors,
  isValidHexColor,
} from '../utils/colorUtils';

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
    ...initialColors,
  }));

  // Ref для отслеживания внутренних изменений
  const isInternalUpdate = useRef(false);

  // Ref для хранения предыдущих initialColors
  const prevInitialColors = useRef<Partial<ColorState>>(initialColors);

  // Синхронизация с внешними изменениями initialColors
  useEffect(() => {
    if (
      !isInternalUpdate.current &&
      initialColors &&
      Object.keys(initialColors).length > 0
    ) {
      // Проверяем, действительно ли initialColors изменились
      const initialColorsChanged =
        JSON.stringify(prevInitialColors.current) !==
        JSON.stringify(initialColors);

      if (initialColorsChanged) {
        // Проверяем, действительно ли цвета изменились
        const hasChanges = Object.entries(initialColors).some(
          ([key, value]) => colors[key as keyof ColorState] !== value
        );

        if (hasChanges) {
          setColors(prevColors => ({
            ...prevColors,
            ...initialColors,
          }));
        }

        prevInitialColors.current = initialColors;
      }
    }
    isInternalUpdate.current = false;
  }, [initialColors, colors]);

  /**
   * Установка цвета для конкретной группы
   */
  const setColor = useCallback((group: keyof ColorState, color: HexColor) => {
    if (!isValidHexColor(color)) {
      console.warn(`Недопустимый HEX цвет: ${color}`);
      return;
    }

    isInternalUpdate.current = true;
    setColors(prevColors => ({
      ...prevColors,
      [group]: color,
    }));
  }, []);

  /**
   * Сброс цветов к дефолтным значениям
   */
  const resetColors = useCallback(() => {
    isInternalUpdate.current = true;
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

    isInternalUpdate.current = true;
    setColors(prevColors => ({
      ...prevColors,
      ...validatedScheme,
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
      preserveGradients: true,
    });

    if (result.errors.length > 0) {
      console.warn('Ошибки при замене цветов:', result.errors);
    }

    return result.modifiedSvg;
  }, [svgContent, colors]);

  return {
    colors,
    setColor,
    resetColors,
    applyColorScheme,
    getModifiedSvg,
  };
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
    gradientEnd: '#2C3E50',
    backgroundColor: '#f8f9fa',
  },

  warm: {
    primary: '#E74C3C',
    secondary: '#F39C12',
    accent: '#D35400',
    neutral: '#FDF2E9',
    special: '#F39C12',
    gradientStart: '#EC7063',
    gradientEnd: '#E74C3C',
    backgroundColor: '#fff5f5',
  },

  cool: {
    primary: '#3498DB',
    secondary: '#9B59B6',
    accent: '#2980B9',
    neutral: '#EBF5FB',
    special: '#9B59B6',
    gradientStart: '#5DADE2',
    gradientEnd: '#3498DB',
    backgroundColor: '#f0f8ff',
  },

  nature: {
    primary: '#27AE60',
    secondary: '#16A085',
    accent: '#229954',
    neutral: '#E8F8F5',
    special: '#16A085',
    gradientStart: '#58D68D',
    gradientEnd: '#27AE60',
    backgroundColor: '#f0fff4',
  },

  sunset: {
    primary: '#FF6B6B',
    secondary: '#FFE66D',
    accent: '#FF8E53',
    neutral: '#FFF3E0',
    special: '#FFE66D',
    gradientStart: '#FF8A80',
    gradientEnd: '#FF6B6B',
    backgroundColor: '#fff8f0',
  },

  monochrome: {
    primary: '#2C3E50',
    secondary: '#7F8C8D',
    accent: '#34495E',
    neutral: '#F8F9FA',
    special: '#7F8C8D',
    gradientStart: '#5D6D7E',
    gradientEnd: '#2C3E50',
    backgroundColor: '#ffffff',
  },

  // Градиентные темы
  oceanGradient: {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#5a67d8',
    neutral: '#f7fafc',
    special: '#764ba2',
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    backgroundColor: '#f0f4f8',
  },

  sunsetGradient: {
    primary: '#ff7e5f',
    secondary: '#feb47b',
    accent: '#ff6b35',
    neutral: '#fff8f3',
    special: '#feb47b',
    gradientStart: '#ff7e5f',
    gradientEnd: '#feb47b',
    backgroundColor: '#fff5f0',
  },

  forestGradient: {
    primary: '#11998e',
    secondary: '#38ef7d',
    accent: '#0d7377',
    neutral: '#f0fff4',
    special: '#38ef7d',
    gradientStart: '#11998e',
    gradientEnd: '#38ef7d',
    backgroundColor: '#f0fdf4',
  },

  purpleGradient: {
    primary: '#8360c3',
    secondary: '#2ebf91',
    accent: '#6a4c93',
    neutral: '#faf5ff',
    special: '#2ebf91',
    gradientStart: '#8360c3',
    gradientEnd: '#2ebf91',
    backgroundColor: '#f7f3ff',
  },

  fireGradient: {
    primary: '#ff416c',
    secondary: '#ff4b2b',
    accent: '#e73c7e',
    neutral: '#fff5f5',
    special: '#ff4b2b',
    gradientStart: '#ff416c',
    gradientEnd: '#ff4b2b',
    backgroundColor: '#fff1f1',
  },

  skyGradient: {
    primary: '#74b9ff',
    secondary: '#0984e3',
    accent: '#6c5ce7',
    neutral: '#f8fbff',
    special: '#0984e3',
    gradientStart: '#74b9ff',
    gradientEnd: '#0984e3',
    backgroundColor: '#f1f8ff',
  },

  goldGradient: {
    primary: '#f7971e',
    secondary: '#ffd200',
    accent: '#ff6348',
    neutral: '#fffbf0',
    special: '#ffd200',
    gradientStart: '#f7971e',
    gradientEnd: '#ffd200',
    backgroundColor: '#fffcf0',
  },
} as const;

/**
 * Хук для работы с предустановленными схемами
 */
export const useColorSchemes = () => {
  const [currentScheme, setCurrentScheme] =
    useState<keyof typeof COLOR_SCHEMES>('default');

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
    schemes: COLOR_SCHEMES,
  };
};

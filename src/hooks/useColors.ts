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

  // Новые современные темы

  spring: {
    primary: '#98fb98',
    secondary: '#ffb6c1',
    accent: '#90ee90',
    neutral: '#f0fff0',
    special: '#ffb6c1',
    gradientStart: '#98fb98',
    gradientEnd: '#ffb6c1',
    backgroundColor: '#f5fffa',
  },

  summer: {
    primary: '#ffd700',
    secondary: '#ff6347',
    accent: '#ffa500',
    neutral: '#fffacd',
    special: '#ff6347',
    gradientStart: '#ffd700',
    gradientEnd: '#ff6347',
    backgroundColor: '#fffff0',
  },

  midnight: {
    primary: '#191970',
    secondary: '#4169e1',
    accent: '#6495ed',
    neutral: '#f8f8ff',
    special: '#4169e1',
    gradientStart: '#191970',
    gradientEnd: '#4169e1',
    backgroundColor: '#f0f0f0',
  },

  royal: {
    primary: '#4b0082',
    secondary: '#daa520',
    accent: '#9370db',
    neutral: '#f5f5f5',
    special: '#daa520',
    gradientStart: '#4b0082',
    gradientEnd: '#9370db',
    backgroundColor: '#faf0e6',
  },

  tropical: {
    primary: '#ff4500',
    secondary: '#32cd32',
    accent: '#ff1493',
    neutral: '#f0ffff',
    special: '#32cd32',
    gradientStart: '#ff4500',
    gradientEnd: '#ff1493',
    backgroundColor: '#f0fff0',
  },
  arctic: {
    primary: '#b0c4de',
    secondary: '#87cefa',
    accent: '#4682b4',
    neutral: '#f0f8ff',
    special: '#87cefa',
    gradientStart: '#b0c4de',
    gradientEnd: '#87cefa',
    backgroundColor: '#f8f8ff',
  },

  volcano: {
    primary: '#dc143c',
    secondary: '#ff4500',
    accent: '#b22222',
    neutral: '#ffe4e1',
    special: '#ff4500',
    gradientStart: '#dc143c',
    gradientEnd: '#ff4500',
    backgroundColor: '#fff0f5',
  },

  // Драгоценные камни
  emerald: {
    primary: '#50c878',
    secondary: '#00ff7f',
    accent: '#3cb371',
    neutral: '#f0fff0',
    special: '#00ff7f',
    gradientStart: '#50c878',
    gradientEnd: '#00ff7f',
    backgroundColor: '#f5fffa',
  },

  ruby: {
    primary: '#e0115f',
    secondary: '#ff69b4',
    accent: '#dc143c',
    neutral: '#fff0f5',
    special: '#ff69b4',
    gradientStart: '#e0115f',
    gradientEnd: '#ff69b4',
    backgroundColor: '#ffe4e1',
  },

  // Уникальные градиентные темы

  deepSea: {
    primary: '#006994',
    secondary: '#4682b4',
    accent: '#5f9ea0',
    neutral: '#f0f8ff',
    special: '#4682b4',
    gradientStart: '#006994',
    gradientEnd: '#4682b4',
    backgroundColor: '#f0f8ff',
  },

  goldRush: {
    primary: '#ffd700',
    secondary: '#ffb347',
    accent: '#daa520',
    neutral: '#fffacd',
    special: '#ffb347',
    gradientStart: '#ffd700',
    gradientEnd: '#ffb347',
    backgroundColor: '#fffff0',
  },

  mysticForest: {
    primary: '#228b22',
    secondary: '#32cd32',
    accent: '#006400',
    neutral: '#f0fff0',
    special: '#32cd32',
    gradientStart: '#228b22',
    gradientEnd: '#32cd32',
    backgroundColor: '#f5fffa',
  },

  cosmicDust: {
    primary: '#663399',
    secondary: '#9966cc',
    accent: '#8b008b',
    neutral: '#f8f8ff',
    special: '#9966cc',
    gradientStart: '#663399',
    gradientEnd: '#9966cc',
    backgroundColor: '#f5f5f5',
  },
  // Экзотические темы
  neonCyan: {
    primary: '#00ffff',
    secondary: '#40e0d0',
    accent: '#00ced1',
    neutral: '#f0ffff',
    special: '#40e0d0',
    gradientStart: '#00ffff',
    gradientEnd: '#40e0d0',
    backgroundColor: '#f0fffe',
  },

  electricBlue: {
    primary: '#7df9ff',
    secondary: '#00bfff',
    accent: '#1e90ff',
    neutral: '#f0f8ff',
    special: '#00bfff',
    gradientStart: '#7df9ff',
    gradientEnd: '#00bfff',
    backgroundColor: '#f8fcff',
  },
} as const;

/**
 * Русские названия цветовых схем
 */
export const COLOR_SCHEME_NAMES: Record<keyof typeof COLOR_SCHEMES, string> = {
  default: 'По умолчанию',
  corporate: 'Корпоративная',
  warm: 'Теплая',
  cool: 'Холодная',
  nature: 'Природная',
  sunset: 'Закат',
  monochrome: 'Монохром',
  forestGradient: 'Лесной градиент',
  purpleGradient: 'Фиолетовый градиент',
  fireGradient: 'Огненный градиент',
  skyGradient: 'Небесный градиент',
  spring: 'Весна',
  summer: 'Лето',
  midnight: 'Полночь',
  royal: 'Королевская',
  tropical: 'Тропическая',
  arctic: 'Арктическая',
  volcano: 'Вулкан',
  emerald: 'Изумруд',
  ruby: 'Рубин',
  deepSea: 'Глубокое море',
  goldRush: 'Золотая лихорадка',
  mysticForest: 'Мистический лес',
  cosmicDust: 'Космическая пыль',
  neonCyan: 'Неоновый циан',
  electricBlue: 'Электрический синий',
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

  const getSchemeName = useCallback(
    (schemeName: keyof typeof COLOR_SCHEMES) => {
      return COLOR_SCHEME_NAMES[schemeName];
    },
    []
  );

  return {
    currentScheme,
    applyScheme,
    getSchemeNames,
    getCurrentScheme,
    getSchemeName,
    schemes: COLOR_SCHEMES,
    schemeNames: COLOR_SCHEME_NAMES,
  };
};

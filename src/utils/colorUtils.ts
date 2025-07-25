import type {
  ColorState,
  ColorReplacementOptions,
  ColorReplacementResult,
  HexColor,
} from '../types/colors';

/**
 * Утилиты для работы с цветами в SVG
 */

// Дефолтные цвета из анализа
export const DEFAULT_COLORS: ColorState = {
  primary: '#DA5038',
  secondary: '#219BC3',
  accent: '#1a7a93',
  neutral: '#f2ead8',
  special: '#219bc3',
  gradientStart: '#E66A49',
  gradientEnd: '#B97467',
  backgroundColor: '#fafafa',
};

/**
 * Валидация HEX цвета
 */
export const isValidHexColor = (color: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
};

/**
 * Нормализация HEX цвета (приведение к верхнему регистру)
 */
export const normalizeHexColor = (color: HexColor): HexColor => {
  if (!isValidHexColor(color)) {
    throw new Error(`Недопустимый HEX цвет: ${color}`);
  }
  return color.toUpperCase();
};

/**
 * Создание регулярного выражения для поиска цвета
 */
const createColorRegex = (color: HexColor, caseSensitive = false): RegExp => {
  const escapedColor = color.replace('#', '\\#');
  const flags = caseSensitive ? 'g' : 'gi';
  return new RegExp(`(fill=["']?)${escapedColor}(["']?)`, flags);
};

/**
 * Создание регулярного выражения для поиска цвета в градиенте
 */
const createGradientColorRegex = (
  color: HexColor,
  caseSensitive = false
): RegExp => {
  const escapedColor = color.replace('#', '\\#');
  const flags = caseSensitive ? 'g' : 'gi';
  return new RegExp(`(stop-color=["']?)${escapedColor}(["']?)`, flags);
};

/**
 * Замена цвета в SVG строке
 */
export const replaceColorInSvg = (
  svgContent: string,
  oldColor: HexColor,
  newColor: HexColor,
  options: ColorReplacementOptions = {}
): string => {
  const { caseSensitive = false } = options;

  if (!isValidHexColor(oldColor) || !isValidHexColor(newColor)) {
    throw new Error('Недопустимые HEX цвета');
  }

  let modifiedSvg = svgContent;

  // Замена в обычных fill атрибутах
  const fillRegex = createColorRegex(oldColor, caseSensitive);
  modifiedSvg = modifiedSvg.replace(fillRegex, `$1${newColor}$2`);

  // Замена в градиентах
  const gradientRegex = createGradientColorRegex(oldColor, caseSensitive);
  modifiedSvg = modifiedSvg.replace(gradientRegex, `$1${newColor}$2`);

  return modifiedSvg;
};

/**
 * Замена всех цветов в SVG согласно цветовой схеме
 */
export const replaceAllColors = (
  svgContent: string,
  colors: Partial<ColorState>,
  options: ColorReplacementOptions = {}
): ColorReplacementResult => {
  let modifiedSvg = svgContent;
  const replacedColors: Record<string, string> = {};
  const errors: string[] = [];

  try {
    // Замена основных цветов
    if (colors.primary) {
      modifiedSvg = replaceColorInSvg(
        modifiedSvg,
        DEFAULT_COLORS.primary,
        colors.primary,
        options
      );
      replacedColors[DEFAULT_COLORS.primary] = colors.primary;
    }

    if (colors.secondary) {
      modifiedSvg = replaceColorInSvg(
        modifiedSvg,
        DEFAULT_COLORS.secondary,
        colors.secondary,
        options
      );
      replacedColors[DEFAULT_COLORS.secondary] = colors.secondary;
    }

    if (colors.accent) {
      modifiedSvg = replaceColorInSvg(
        modifiedSvg,
        DEFAULT_COLORS.accent,
        colors.accent,
        options
      );
      replacedColors[DEFAULT_COLORS.accent] = colors.accent;
    }

    if (colors.neutral) {
      modifiedSvg = replaceColorInSvg(
        modifiedSvg,
        DEFAULT_COLORS.neutral,
        colors.neutral,
        options
      );
      replacedColors[DEFAULT_COLORS.neutral] = colors.neutral;
    }

    if (colors.special) {
      modifiedSvg = replaceColorInSvg(
        modifiedSvg,
        DEFAULT_COLORS.special,
        colors.special,
        options
      );
      replacedColors[DEFAULT_COLORS.special] = colors.special;
    }

    // Замена градиентных цветов
    if (colors.gradientStart) {
      modifiedSvg = replaceColorInSvg(
        modifiedSvg,
        DEFAULT_COLORS.gradientStart,
        colors.gradientStart,
        options
      );
      replacedColors[DEFAULT_COLORS.gradientStart] = colors.gradientStart;
    }

    if (colors.gradientEnd) {
      modifiedSvg = replaceColorInSvg(
        modifiedSvg,
        DEFAULT_COLORS.gradientEnd,
        colors.gradientEnd,
        options
      );
      replacedColors[DEFAULT_COLORS.gradientEnd] = colors.gradientEnd;
    }

    // Применение пользовательских маппингов
    if (options.customMappings) {
      Object.entries(options.customMappings).forEach(([oldColor, newColor]) => {
        try {
          modifiedSvg = replaceColorInSvg(
            modifiedSvg,
            oldColor,
            newColor,
            options
          );
          replacedColors[oldColor] = newColor;
        } catch (error) {
          errors.push(`Ошибка замены ${oldColor} на ${newColor}: ${error}`);
        }
      });
    }
  } catch (error) {
    errors.push(`Общая ошибка замены цветов: ${error}`);
  }

  return {
    modifiedSvg,
    replacedColors,
    errors,
  };
};

/**
 * Извлечение всех цветов из SVG
 */
export const extractColorsFromSvg = (svgContent: string): HexColor[] => {
  const colorRegex = /#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}/g;
  const matches = svgContent.match(colorRegex);

  if (!matches) return [];

  // Удаление дубликатов и нормализация
  const uniqueColors = [...new Set(matches)].map(normalizeHexColor);
  return uniqueColors;
};

/**
 * Проверка контрастности цветов (упрощенная версия)
 */
export const getColorContrast = (
  color1: HexColor,
  color2: HexColor
): number => {
  const getLuminance = (hex: HexColor): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Генерация случайного HEX цвета
 */
export const generateRandomColor = (): HexColor => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor.padStart(6, '0').toUpperCase()}`;
};

/**
 * Конвертация HEX в RGB
 */
export const hexToRgb = (
  hex: HexColor
): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Конвертация RGB в HEX
 */
export const rgbToHex = (r: number, g: number, b: number): HexColor => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

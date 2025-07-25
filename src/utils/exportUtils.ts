import { saveAs } from 'file-saver';
import type {
  ExportOptions,
  ExportResult,
  ColorState,
  ColorSchemeExport,
} from '../types/colors';

/**
 * Утилиты для экспорта логотипа в различных форматах
 */

/**
 * Экспорт SVG логотипа
 */
export const exportSVG = async (
  svgContent: string,
  options: ExportOptions
): Promise<ExportResult> => {
  try {
    const filename = options.filename || `logo-${Date.now()}.svg`;

    // Создаем Blob с SVG контентом
    const blob = new Blob([svgContent], {
      type: 'image/svg+xml;charset=utf-8',
    });

    // Сохраняем файл
    saveAs(blob, filename);

    return {
      success: true,
      filename,
      data: blob,
    };
  } catch (error) {
    return {
      success: false,
      error: `Ошибка экспорта SVG: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
    };
  }
};

/**
 * Экспорт цветовой схемы в JSON
 */
export const exportColorScheme = async (
  colors: ColorState,
  options: ExportOptions
): Promise<ExportResult> => {
  try {
    const filename = options.filename || `color-scheme-${Date.now()}.json`;

    const colorScheme: ColorSchemeExport = {
      name: filename.replace('.json', ''),
      colors,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };

    const jsonContent = JSON.stringify(colorScheme, null, 2);
    const blob = new Blob([jsonContent], {
      type: 'application/json;charset=utf-8',
    });

    saveAs(blob, filename);

    return {
      success: true,
      filename,
      data: blob,
    };
  } catch (error) {
    return {
      success: false,
      error: `Ошибка экспорта JSON: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
    };
  }
};

/**
 * Универсальная функция экспорта
 */
export const exportLogo = async (
  svgContent: string,
  _svgElement: HTMLElement,
  colors: ColorState,
  options: ExportOptions
): Promise<ExportResult> => {
  switch (options.format) {
    case 'svg':
      return exportSVG(svgContent, options);
    case 'json':
      return exportColorScheme(colors, options);
    default:
      return {
        success: false,
        error: `Неподдерживаемый формат экспорта: ${options.format}`,
      };
  }
};

/**
 * Получение рекомендуемых размеров для различных форматов
 */
export const getRecommendedSizes = (format: ExportOptions['format']) => {
  const sizes = {
    svg: [{ name: 'Оригинал', width: 'auto', height: 'auto' }],
    json: [{ name: 'Цветовая схема', width: 'auto', height: 'auto' }],
  };

  return sizes[format] || sizes.svg;
};

/**
 * Валидация опций экспорта
 */
export const validateExportOptions = (options: ExportOptions): string[] => {
  const errors: string[] = [];

  if (!options.format) {
    errors.push('Не указан формат экспорта');
  }

  return errors;
};

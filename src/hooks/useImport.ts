import { useCallback, useState } from 'react';
import type { ColorState, ColorSchemeExport } from '../types/colors';

/**
 * Хук для импорта цветовых схем
 */
export const useImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  /**
   * Импорт цветовой схемы из JSON файла
   */
  const importColorScheme = useCallback(
    (file: File): Promise<ColorState | null> => {
      return new Promise((resolve) => {
        setIsImporting(true);
        setImportError(null);

        const reader = new FileReader();

        reader.onload = (event) => {
          try {
            const content = event.target?.result as string;
            const data = JSON.parse(content) as ColorSchemeExport;

            // Валидация структуры файла
            if (!data.colors) {
              throw new Error('Файл не содержит цветовую схему');
            }

            // Валидация цветов
            const requiredColors = ['primary', 'secondary', 'accent', 'neutral', 'special', 'gradientStart', 'gradientEnd'];
            const missingColors = requiredColors.filter(color => !data.colors[color as keyof ColorState]);

            if (missingColors.length > 0) {
              console.warn(`Отсутствуют цвета: ${missingColors.join(', ')}`);
            }

            // Валидация HEX цветов
            const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            const invalidColors = Object.entries(data.colors).filter(
              ([, color]) => color && !hexColorRegex.test(color)
            );

            if (invalidColors.length > 0) {
              throw new Error(`Недопустимые цвета: ${invalidColors.map(([key]) => key).join(', ')}`);
            }

            setIsImporting(false);
            resolve(data.colors);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка чтения файла';
            setImportError(errorMessage);
            setIsImporting(false);
            resolve(null);
          }
        };

        reader.onerror = () => {
          setImportError('Ошибка чтения файла');
          setIsImporting(false);
          resolve(null);
        };

        reader.readAsText(file);
      });
    },
    []
  );

  /**
   * Сброс состояния ошибки
   */
  const clearError = useCallback(() => {
    setImportError(null);
  }, []);

  return {
    importColorScheme,
    isImporting,
    importError,
    clearError,
  };
};

/**
 * Утилита для валидации файла перед импортом
 */
export const validateImportFile = (file: File): string | null => {
  // Проверка типа файла
  if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
    return 'Поддерживаются только JSON файлы';
  }

  // Проверка размера файла (максимум 1MB)
  if (file.size > 1024 * 1024) {
    return 'Файл слишком большой (максимум 1MB)';
  }

  return null;
};

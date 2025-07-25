/**
 * Тесты для утилит экспорта
 */

import { validateExportOptions, getRecommendedSizes } from '../exportUtils';
import type { ExportOptions } from '../../types/colors';

describe('exportUtils', () => {
  describe('validateExportOptions', () => {
    it('должен возвращать ошибку если не указан формат', () => {
      const options = {} as ExportOptions;
      const errors = validateExportOptions(options);
      expect(errors).toContain('Не указан формат экспорта');
    });

    it('должен пропускать валидные опции', () => {
      const options: ExportOptions = {
        format: 'svg',
        filename: 'test.svg',
      };
      const errors = validateExportOptions(options);
      expect(errors).toHaveLength(0);
    });
  });

  describe('getRecommendedSizes', () => {
    it('должен возвращать размеры для SVG', () => {
      const sizes = getRecommendedSizes('svg');
      expect(sizes).toHaveLength(1);
      expect(sizes[0].name).toBe('Оригинал');
    });

    it('должен возвращать размеры для JSON', () => {
      const sizes = getRecommendedSizes('json');
      expect(sizes).toHaveLength(1);
      expect(sizes[0].name).toBe('Цветовая схема');
    });
  });
});

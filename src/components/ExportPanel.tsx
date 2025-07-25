import React, { useState, useCallback } from 'react';
import type { ExportOptions, ExportFormat, ColorState } from '../types/colors';
import { exportLogo, validateExportOptions } from '../utils/exportUtils';

interface ExportPanelProps {
  svgContent: string;
  colors: ColorState;
  className?: string;
}

/**
 * Компонент панели экспорта логотипа
 */
export const ExportPanel: React.FC<ExportPanelProps> = ({
  svgContent,
  colors,
  className = '',
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('svg');
  const [filename, setFilename] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string>('');

  /**
   * Обработчик изменения формата экспорта
   */
  const handleFormatChange = useCallback((format: ExportFormat) => {
    setSelectedFormat(format);
    setExportMessage('');
  }, []);

  /**
   * Обработчик экспорта
   */
  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setExportMessage('');

    try {
      const exportOptions: ExportOptions = {
        format: selectedFormat,
        filename: filename || undefined,
        includeColorScheme: selectedFormat === 'json',
      };

      // Валидация опций
      const validationErrors = validateExportOptions(exportOptions);
      if (validationErrors.length > 0) {
        setExportMessage(`Ошибки валидации: ${validationErrors.join(', ')}`);
        return;
      }

      // Получаем SVG элемент (не используется для SVG и JSON, но нужен для совместимости)
      const svgElement = document.querySelector('.svg-logo') as HTMLElement;

      // Выполняем экспорт
      const result = await exportLogo(
        svgContent,
        svgElement,
        colors,
        exportOptions
      );

      if (result.success) {
        setExportMessage(`✅ Успешно экспортировано: ${result.filename}`);
      } else {
        setExportMessage(`❌ ${result.error}`);
      }
    } catch (error) {
      setExportMessage(
        `❌ Ошибка экспорта: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
      );
    } finally {
      setIsExporting(false);
    }
  }, [selectedFormat, filename, svgContent, colors]);

  return (
    <div className={`export-panel ${className}`}>
      <h3>Экспорт логотипа</h3>

      {/* Выбор формата */}
      <div className="export-section">
        <label className="export-label">Формат экспорта:</label>
        <div className="format-buttons">
          {(['svg', 'json'] as ExportFormat[]).map(format => (
            <button
              key={format}
              type="button"
              className={`format-button ${selectedFormat === format ? 'active' : ''}`}
              onClick={() => handleFormatChange(format)}
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Имя файла */}
      <div className="export-section">
        <label htmlFor="filename" className="export-label">
          Имя файла (необязательно):
        </label>
        <input
          id="filename"
          type="text"
          value={filename}
          onChange={e => setFilename(e.target.value)}
          placeholder={`logo-${Date.now()}.${selectedFormat}`}
          className="filename-input"
        />
      </div>

      {/* Кнопка экспорта */}
      <div className="export-section">
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="export-button"
        >
          {isExporting
            ? 'Экспортируется...'
            : `Экспортировать ${selectedFormat.toUpperCase()}`}
        </button>
      </div>

      {/* Сообщение о результате */}
      {exportMessage && (
        <div
          className={`export-message ${exportMessage.includes('✅') ? 'success' : 'error'}`}
        >
          {exportMessage}
        </div>
      )}

      {/* Информация о формате */}
      <div className="format-info">
        {selectedFormat === 'svg' && (
          <p>SVG - векторный формат, масштабируется без потери качества</p>
        )}
        {selectedFormat === 'json' && (
          <p>JSON - экспорт цветовой схемы для последующего импорта</p>
        )}
      </div>
    </div>
  );
};

export default ExportPanel;

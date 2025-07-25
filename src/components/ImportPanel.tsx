import React, { useRef, useCallback } from 'react';
import type { ColorState } from '../types/colors';
import { useImport, validateImportFile } from '../hooks/useImport';

interface ImportPanelProps {
  onImport: (colors: ColorState) => void;
  className?: string;
}

/**
 * Компонент панели импорта цветовых схем
 */
export const ImportPanel: React.FC<ImportPanelProps> = ({
  onImport,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importColorScheme, isImporting, importError, clearError } =
    useImport();

  /**
   * Обработчик выбора файла
   */
  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      clearError();

      // Валидация файла
      const validationError = validateImportFile(file);
      if (validationError) {
        alert(validationError);
        return;
      }

      // Импорт цветовой схемы
      const colors = await importColorScheme(file);
      if (colors) {
        onImport(colors);
        // Очищаем input для возможности повторного выбора того же файла
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [importColorScheme, onImport, clearError]
  );

  /**
   * Обработчик клика по кнопке импорта
   */
  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Обработчик drag & drop
   */
  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      clearError();

      const files = Array.from(event.dataTransfer.files);
      const jsonFile = files.find(
        file => file.type === 'application/json' || file.name.endsWith('.json')
      );

      if (!jsonFile) {
        alert('Пожалуйста, перетащите JSON файл с цветовой схемой');
        return;
      }

      // Валидация файла
      const validationError = validateImportFile(jsonFile);
      if (validationError) {
        alert(validationError);
        return;
      }

      // Импорт цветовой схемы
      const colors = await importColorScheme(jsonFile);
      if (colors) {
        onImport(colors);
      }
    },
    [importColorScheme, onImport, clearError]
  );

  /**
   * Обработчик drag over
   */
  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  return (
    <div className={`import-panel ${className}`}>
      <h3>Импорт цветовой схемы</h3>

      <div
        className={`import-dropzone ${isImporting ? 'importing' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="import-content">
          <div className="import-icon">📁</div>
          <p className="import-text">Перетащите JSON файл сюда или</p>
          <button
            type="button"
            onClick={handleImportClick}
            disabled={isImporting}
            className="import-button"
          >
            {isImporting ? 'Импортируется...' : 'Выберите файл'}
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {importError && <div className="import-error">❌ {importError}</div>}
    </div>
  );
};

export default ImportPanel;

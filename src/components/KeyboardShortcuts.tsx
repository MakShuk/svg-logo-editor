import { useState, useEffect } from 'react';
import './KeyboardShortcuts.css';

interface KeyboardShortcutsProps {
  onThemeToggle: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const KeyboardShortcuts = ({
  onThemeToggle,
  onExport,
  onImport,
}: KeyboardShortcutsProps) => {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Проверяем, что фокус не на input элементе
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Ctrl/Cmd + комбинации
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'e':
            event.preventDefault();
            onExport();
            break;
          case 'i':
            event.preventDefault();
            onImport();
            break;
          case 'd':
            event.preventDefault();
            onThemeToggle();
            break;
          case '/':
          case '?':
            event.preventDefault();
            setShowHelp(prev => !prev);
            break;
        }
      }

      // Простые клавиши
      switch (event.key) {
        case 'Escape':
          setShowHelp(false);
          break;
        case '?':
          if (!event.ctrlKey && !event.metaKey) {
            setShowHelp(prev => !prev);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onThemeToggle, onExport, onImport]);

  const shortcuts = [
    { key: 'Ctrl + E', description: 'Экспорт логотипа' },
    { key: 'Ctrl + I', description: 'Импорт цветовой схемы' },
    { key: 'Ctrl + D', description: 'Переключить тему' },
    { key: '?', description: 'Показать/скрыть горячие клавиши' },
    { key: 'Esc', description: 'Закрыть справку' },
  ];

  if (!showHelp) {
    return (
      <button
        className="shortcuts-help-button"
        onClick={() => setShowHelp(true)}
        title="Горячие клавиши (?)"
      >
        ⌨️
      </button>
    );
  }

  return (
    <>
      <div className="shortcuts-overlay" onClick={() => setShowHelp(false)} />
      <div className="shortcuts-modal">
        <div className="shortcuts-header">
          <h3>Горячие клавиши</h3>
          <button
            className="shortcuts-close"
            onClick={() => setShowHelp(false)}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>
        <div className="shortcuts-content">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="shortcut-item">
              <kbd className="shortcut-key">{shortcut.key}</kbd>
              <span className="shortcut-description">
                {shortcut.description}
              </span>
            </div>
          ))}
        </div>
        <div className="shortcuts-footer">
          <p>
            Нажмите <kbd>Esc</kbd> или кликните вне окна, чтобы закрыть
          </p>
        </div>
      </div>
    </>
  );
};

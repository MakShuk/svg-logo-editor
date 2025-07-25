import { useState } from 'react';
import { SVGLogoPreview } from './components/SVGLogo';
import { ExportPanel } from './components/ExportPanel';
import { ImportPanel } from './components/ImportPanel';
import { ThemeToggle } from './components/ThemeToggle';

import { ToastContainer, useToast } from './components/Toast';

import { COLOR_SCHEMES, useColorSchemes } from './hooks/useColors';
import { useColors } from './hooks/useColors';
import { SVG_LOGO_CONTENT } from './constants/svgContent';
import { DEFAULT_COLORS } from './utils/colorUtils';
import type { ColorState } from './types/colors';
import './App.css';
import './styles/SVGLogo.css';
import './styles/ExportPanel.css';
import './styles/ImportPanel.css';

function App() {
  const [currentColors, setCurrentColors] = useState<Partial<ColorState>>({});
  const { currentScheme, applyScheme, getSchemeNames } = useColorSchemes();

  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  // Используем хук для получения модифицированного SVG
  const { getModifiedSvg } = useColors(currentColors, SVG_LOGO_CONTENT);

  const handleColorGroupChange = (group: string, color: string) => {
    setCurrentColors(prev => ({
      ...prev,
      [group]: color,
    }));
  };

  const handleSchemeChange = (schemeName: keyof typeof COLOR_SCHEMES) => {
    const scheme = applyScheme(schemeName);
    setCurrentColors(scheme);
    showInfo('Цветовая схема изменена', `Применена схема "${schemeName}"`);
  };

  const handleImport = (colors: ColorState) => {
    setCurrentColors(colors);
    showSuccess('Цвета импортированы', 'Цветовая схема успешно загружена');
  };

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <div className="app-header-content">
            <div className="app-header-text">
              <h1>SVG Logo Editor</h1>
              <p>Динамическое изменение цветов SVG логотипа</p>
            </div>
            <div className="app-header-controls">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="app-main">
          <section className="logo-section app-section">
            <h2>Предварительный просмотр</h2>
            <div className="logo-preview-container">
              <SVGLogoPreview
                colors={currentColors}
                width={300}
                height={450}
                showControls={true}
                onColorGroupChange={handleColorGroupChange}
                className="svg-logo--animated"
              />
            </div>
          </section>

          <section className="schemes-section app-section">
            <h2>Цветовые схемы</h2>
            <div className="scheme-buttons">
              {getSchemeNames().map(schemeName => (
                <button
                  key={schemeName}
                  onClick={() => handleSchemeChange(schemeName)}
                  className={`scheme-button ${currentScheme === schemeName ? 'active' : ''}`}
                >
                  {schemeName === 'default'
                    ? 'По умолчанию'
                    : schemeName === 'corporate'
                      ? 'Корпоративная'
                      : schemeName === 'warm'
                        ? 'Теплая'
                        : schemeName === 'cool'
                          ? 'Холодная'
                          : schemeName === 'nature'
                            ? 'Природная'
                            : schemeName === 'sunset'
                              ? 'Закат'
                              : schemeName === 'monochrome'
                                ? 'Монохром'
                                : schemeName}
                </button>
              ))}
            </div>
          </section>

          <section className="info-section app-section">
            <h2>Информация о цветах</h2>
            <div className="color-info">
              <div className="color-item">
                <span className="color-label">Основной:</span>
                <span className="color-value">
                  {currentColors.primary || '#DA5038'}
                </span>
                <div
                  className="color-preview"
                  style={{
                    backgroundColor: currentColors.primary || '#DA5038',
                  }}
                />
              </div>
              <div className="color-item">
                <span className="color-label">Вторичный:</span>
                <span className="color-value">
                  {currentColors.secondary || '#219BC3'}
                </span>
                <div
                  className="color-preview"
                  style={{
                    backgroundColor: currentColors.secondary || '#219BC3',
                  }}
                />
              </div>
              <div className="color-item">
                <span className="color-label">Акцентный:</span>
                <span className="color-value">
                  {currentColors.accent || '#1a7a93'}
                </span>
                <div
                  className="color-preview"
                  style={{ backgroundColor: currentColors.accent || '#1a7a93' }}
                />
              </div>
            </div>
          </section>

          <section className="export-section app-section">
            <ExportPanel
              svgContent={getModifiedSvg()}
              colors={{ ...DEFAULT_COLORS, ...currentColors }}
            />
          </section>

          <section className="import-section app-section">
            <ImportPanel onImport={handleImport} />
          </section>
        </main>

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </div>
  );
}

export default App;

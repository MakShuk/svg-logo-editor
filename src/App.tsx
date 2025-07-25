import { useState } from 'react';
import { SVGLogoPreview } from './components/SVGLogo';
import { ExportPanel } from './components/ExportPanel';
import { ImportPanel } from './components/ImportPanel';
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

  // Используем хук для получения модифицированного SVG
  const { getModifiedSvg } = useColors(currentColors, SVG_LOGO_CONTENT);

  const handleColorChange = (colors: ColorState) => {
    setCurrentColors(colors);
  };

  const handleColorGroupChange = (group: string, color: string) => {
    setCurrentColors(prev => ({
      ...prev,
      [group]: color,
    }));
  };

  const handleSchemeChange = (schemeName: keyof typeof COLOR_SCHEMES) => {
    const scheme = applyScheme(schemeName);
    setCurrentColors(scheme);
  };

  const handleImport = (colors: ColorState) => {
    setCurrentColors(colors);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>SVG Logo Editor</h1>
        <p>Динамическое изменение цветов SVG логотипа</p>
      </header>

      <main className="app-main">
        <div className="logo-section">
          <h2>Предварительный просмотр</h2>
          <SVGLogoPreview
            colors={currentColors}
            width={300}
            height={450}
            showControls={true}
            onColorGroupChange={handleColorGroupChange}
            className="svg-logo--animated"
          />
        </div>

        <div className="schemes-section">
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
        </div>

        <div className="info-section">
          <h2>Информация о цветах</h2>
          <div className="color-info">
            <div className="color-item">
              <span className="color-label">Основной:</span>
              <span className="color-value">
                {currentColors.primary || '#DA5038'}
              </span>
              <div
                className="color-preview"
                style={{ backgroundColor: currentColors.primary || '#DA5038' }}
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
        </div>

        <div className="export-section">
          <ExportPanel
            svgContent={getModifiedSvg()}
            colors={{ ...DEFAULT_COLORS, ...currentColors }}
          />
        </div>

        <div className="import-section">
          <ImportPanel onImport={handleImport} />
        </div>
      </main>
    </div>
  );
}

export default App;

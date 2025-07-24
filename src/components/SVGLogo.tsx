import React, { useMemo, useEffect } from 'react';
import type { SVGLogoProps } from '../types/colors';
import { useColors } from '../hooks/useColors';
import { SVG_LOGO_CONTENT } from '../constants/svgContent';

/**
 * Компонент SVGLogo с поддержкой динамических цветов
 */
export const SVGLogo: React.FC<SVGLogoProps> = ({
  colors = {},
  width = '100%',
  height = 'auto',
  className = '',
  style = {},
  onColorChange
}) => {
  // Используем хук для управления цветами
  const { colors: currentColors, applyColorScheme, getModifiedSvg } = useColors(colors, SVG_LOGO_CONTENT);

  // Применяем переданные цвета при изменении пропсов
  useEffect(() => {
    if (Object.keys(colors).length > 0) {
      applyColorScheme(colors);
    }
  }, [colors, applyColorScheme]);

  // Уведомляем родительский компонент об изменении цветов
  useEffect(() => {
    if (onColorChange) {
      onColorChange(currentColors);
    }
  }, [currentColors, onColorChange]);

  // Получаем модифицированный SVG с примененными цветами
  const modifiedSvgContent = useMemo(() => {
    return getModifiedSvg();
  }, [getModifiedSvg]);

  // Стили для контейнера
  const containerStyle: React.CSSProperties = {
    width,
    height,
    display: 'inline-block',
    ...style
  };

  return (
    <div 
      className={`svg-logo ${className}`}
      style={containerStyle}
      data-testid="svg-logo"
    >
      <div
        dangerouslySetInnerHTML={{ __html: modifiedSvgContent }}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

/**
 * Компонент SVGLogo с предустановленными размерами
 */
export const SVGLogoSmall: React.FC<Omit<SVGLogoProps, 'width' | 'height'>> = (props) => (
  <SVGLogo {...props} width={128} height={192} />
);

export const SVGLogoMedium: React.FC<Omit<SVGLogoProps, 'width' | 'height'>> = (props) => (
  <SVGLogo {...props} width={256} height={384} />
);

export const SVGLogoLarge: React.FC<Omit<SVGLogoProps, 'width' | 'height'>> = (props) => (
  <SVGLogo {...props} width={512} height={768} />
);

/**
 * Компонент для предварительного просмотра с контролами цветов
 */
interface SVGLogoPreviewProps extends SVGLogoProps {
  showControls?: boolean;
  onColorGroupChange?: (group: string, color: string) => void;
}

export const SVGLogoPreview: React.FC<SVGLogoPreviewProps> = ({
  showControls = false,
  onColorGroupChange,
  ...logoProps
}) => {
  const { colors: currentColors, setColor } = useColors(logoProps.colors, SVG_LOGO_CONTENT);

  const handleColorChange = (group: keyof typeof currentColors, color: string) => {
    setColor(group, color);
    if (onColorGroupChange) {
      onColorGroupChange(group, color);
    }
  };

  return (
    <div className="svg-logo-preview">
      <SVGLogo {...logoProps} colors={currentColors} />
      
      {showControls && (
        <div className="color-controls" style={{ marginTop: '1rem' }}>
          <div className="color-control">
            <label htmlFor="primary-color">Основной цвет:</label>
            <input
              id="primary-color"
              type="color"
              value={currentColors.primary}
              onChange={(e) => handleColorChange('primary', e.target.value)}
            />
          </div>
          
          <div className="color-control">
            <label htmlFor="secondary-color">Вторичный цвет:</label>
            <input
              id="secondary-color"
              type="color"
              value={currentColors.secondary}
              onChange={(e) => handleColorChange('secondary', e.target.value)}
            />
          </div>
          
          <div className="color-control">
            <label htmlFor="accent-color">Акцентный цвет:</label>
            <input
              id="accent-color"
              type="color"
              value={currentColors.accent}
              onChange={(e) => handleColorChange('accent', e.target.value)}
            />
          </div>
          
          <div className="color-control">
            <label htmlFor="neutral-color">Нейтральный цвет:</label>
            <input
              id="neutral-color"
              type="color"
              value={currentColors.neutral}
              onChange={(e) => handleColorChange('neutral', e.target.value)}
            />
          </div>
          
          <div className="color-control">
            <label htmlFor="gradient-start">Градиент (начало):</label>
            <input
              id="gradient-start"
              type="color"
              value={currentColors.gradientStart}
              onChange={(e) => handleColorChange('gradientStart', e.target.value)}
            />
          </div>
          
          <div className="color-control">
            <label htmlFor="gradient-end">Градиент (конец):</label>
            <input
              id="gradient-end"
              type="color"
              value={currentColors.gradientEnd}
              onChange={(e) => handleColorChange('gradientEnd', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SVGLogo;

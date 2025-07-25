/**
 * Типы для системы управления цветами SVG логотипа
 */

// Базовые типы для цветов
export type HexColor = string;
export type ColorPriority = 'high' | 'medium' | 'low';

// Элемент SVG с цветовой информацией
export interface SVGElement {
  id: string;
  line: string;
  description: string;
}

// Группа цветовых элементов
export interface ColorGroup {
  name: string;
  priority: ColorPriority;
  defaultColor: HexColor;
  elements: SVGElement[];
  note?: string;
}

// Стоп-точка градиента
export interface GradientStop {
  offset: string;
  color: HexColor;
  description: string;
}

// Координаты градиента
export interface GradientCoordinates {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
}

// Определение градиента
export interface GradientDefinition {
  id: string;
  line: string;
  type: 'linearGradient' | 'radialGradient';
  usedBy: string[];
  coordinates: GradientCoordinates;
  stops: GradientStop[];
}

// Коллекции градиентов
export interface GradientsCollection {
  active: Record<string, GradientDefinition>;
  unused: Record<string, GradientDefinition>;
}

// Цветовая палитра
export interface ColorPalette {
  primary: HexColor;
  secondary: HexColor;
  accent: HexColor;
  neutral: HexColor;
  gradientColors: HexColor[];
}

// Технические заметки
export interface TechnicalNotes {
  caseIssue: string;
  gradientUsage: string;
  replacementStrategy: string;
  priorityOrder: string[];
}

// Анализ цветов
export interface ColorAnalysis {
  version: string;
  lastUpdated: string;
  svgFile: string;
  totalElements: number;
  totalGradients: number;
}

// Основная конфигурация цветов
export interface ColorMappingConfig {
  colorAnalysis: ColorAnalysis;
  colorGroups: Record<string, ColorGroup>;
  gradients: GradientsCollection;
  colorPalette: ColorPalette;
  technicalNotes: TechnicalNotes;
}

// Состояние цветов для компонента
export interface ColorState {
  primary: HexColor;
  secondary: HexColor;
  accent: HexColor;
  neutral: HexColor;
  special: HexColor;
  gradientStart: HexColor;
  gradientEnd: HexColor;
  backgroundColor: HexColor;
}

// Пропсы для SVGLogo компонента
export interface SVGLogoProps {
  colors?: Partial<ColorState>;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  onColorChange?: (colors: ColorState) => void;
}

// Опции для замены цветов
export interface ColorReplacementOptions {
  caseSensitive?: boolean;
  preserveGradients?: boolean;
  customMappings?: Record<string, string>;
}

// Результат замены цветов
export interface ColorReplacementResult {
  modifiedSvg: string;
  replacedColors: Record<string, string>;
  errors: string[];
}

// Хук для управления цветами
export interface UseColorsReturn {
  colors: ColorState;
  setColor: (group: keyof ColorState, color: HexColor) => void;
  resetColors: () => void;
  applyColorScheme: (scheme: Partial<ColorState>) => void;
  getModifiedSvg: () => string;
}

// Типы для экспорта
export type ExportFormat = 'svg' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  width?: number;
  height?: number;
  quality?: number; // для PNG (0-1)
  filename?: string;
  includeColorScheme?: boolean; // для JSON экспорта
}

export interface ExportResult {
  success: boolean;
  filename?: string;
  error?: string;
  data?: string | Blob;
}

export interface ColorSchemeExport {
  name: string;
  colors: ColorState;
  timestamp: string;
  version: string;
}

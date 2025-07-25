import { render, screen } from '@testing-library/react';
import { SVGLogoPreview } from '../SVGLogo';

// Мокаем хуки
jest.mock('../../hooks/useColors', () => ({
  useColors: () => ({
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      backgroundColor: '#ffffff',
    },
    setColor: jest.fn(),
    resetColors: jest.fn(),
  }),
}));

describe('SVGLogoPreview', () => {
  test('renders without crashing', () => {
    render(<SVGLogoPreview />);
    const previewElement = screen.getByRole('generic');
    expect(previewElement).toBeInTheDocument();
  });

  test('applies correct CSS class for theme support', () => {
    render(<SVGLogoPreview />);
    const previewElement = document.querySelector('.svg-logo-preview');
    expect(previewElement).toBeInTheDocument();
    expect(previewElement).toHaveClass('svg-logo-preview');
  });

  test('renders with controls when showControls is true', () => {
    render(<SVGLogoPreview showControls={true} />);
    const controlsElement = document.querySelector('.color-controls');
    expect(controlsElement).toBeInTheDocument();
  });

  test('does not render controls when showControls is false', () => {
    render(<SVGLogoPreview showControls={false} />);
    const controlsElement = document.querySelector('.color-controls');
    expect(controlsElement).not.toBeInTheDocument();
  });
});

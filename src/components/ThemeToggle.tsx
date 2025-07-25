import { useTheme } from '../hooks/useTheme';
import './ThemeToggle.css';

export const ThemeToggle = () => {
  const { theme, currentTheme, toggleTheme } = useTheme();

  const getIcon = () => {
    return theme === 'light' ? '☀️' : '🌙';
  };

  const getLabel = () => {
    return theme === 'light' ? 'Светлая тема' : 'Темная тема';
  };

  return (
    <button
      className={`theme-toggle theme-toggle--${currentTheme}`}
      onClick={toggleTheme}
      title={getLabel()}
      aria-label={getLabel()}
    >
      <span className="theme-toggle__icon">{getIcon()}</span>
      <span className="theme-toggle__label">{getLabel()}</span>
    </button>
  );
};

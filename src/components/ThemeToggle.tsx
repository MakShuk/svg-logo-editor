import { useTheme } from '../hooks/useTheme';
import './ThemeToggle.css';

export const ThemeToggle = () => {
  const { theme, currentTheme, toggleTheme } = useTheme();

  const getIcon = () => {
    if (theme === 'light') return '☀️';
    if (theme === 'dark') return '🌙';
    return '🔄'; // auto
  };

  const getLabel = () => {
    if (theme === 'light') return 'Светлая тема';
    if (theme === 'dark') return 'Темная тема';
    return 'Автоматическая тема';
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

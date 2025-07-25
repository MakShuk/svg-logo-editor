import { useEffect, useState } from 'react';
import './AppStats.css';

interface AppStatsProps {
  currentColors: Record<string, string>;
}

export const AppStats = ({ currentColors }: AppStatsProps) => {
  const [stats, setStats] = useState({
    colorsChanged: 0,
    sessionsCount: 0,
    lastModified: null as Date | null,
  });

  useEffect(() => {
    // Загружаем статистику из localStorage
    const savedStats = localStorage.getItem('svg-editor-stats');
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      setStats({
        ...parsed,
        lastModified: parsed.lastModified ? new Date(parsed.lastModified) : null,
      });
    } else {
      // Первый запуск - инициализируем статистику
      const initialStats = {
        colorsChanged: 0,
        sessionsCount: 1,
        lastModified: new Date(),
      };
      setStats(initialStats);
      localStorage.setItem('svg-editor-stats', JSON.stringify(initialStats));
    }
  }, []);

  useEffect(() => {
    // Обновляем статистику при изменении цветов
    const colorCount = Object.keys(currentColors).length;
    if (colorCount > 0) {
      setStats(prev => {
        const newStats = {
          ...prev,
          colorsChanged: prev.colorsChanged + 1,
          lastModified: new Date(),
        };
        localStorage.setItem('svg-editor-stats', JSON.stringify(newStats));
        return newStats;
      });
    }
  }, [currentColors]);

  const formatDate = (date: Date | null) => {
    if (!date) return 'Никогда';
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="app-stats">
      <h3>Статистика</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon">🎨</div>
          <div className="stat-content">
            <div className="stat-value">{stats.colorsChanged}</div>
            <div className="stat-label">Изменений цветов</div>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.sessionsCount}</div>
            <div className="stat-label">Сессий</div>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">🕒</div>
          <div className="stat-content">
            <div className="stat-value">{formatDate(stats.lastModified)}</div>
            <div className="stat-label">Последнее изменение</div>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{Object.keys(currentColors).length}</div>
            <div className="stat-label">Активных цветов</div>
          </div>
        </div>
      </div>
    </div>
  );
};

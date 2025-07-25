import { useState } from 'react';
import './MobileMenu.css';

interface MobileMenuProps {
  children: React.ReactNode;
}

export const MobileMenu = ({ children }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className="mobile-menu-toggle"
        onClick={toggleMenu}
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
      >
        <span className={`hamburger ${isOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      <div
        className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
      />

      <nav className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <h3>Меню</h3>
          <button
            className="mobile-menu-close"
            onClick={toggleMenu}
            aria-label="Закрыть меню"
          >
            ✕
          </button>
        </div>
        <div className="mobile-menu-content">{children}</div>
      </nav>
    </>
  );
};

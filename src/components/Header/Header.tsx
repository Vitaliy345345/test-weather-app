import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.scss';

const Header: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          Weather App
        </Link>

        {!isHomePage && (
          <Link to="/" className="header__back-button">
            &larr; Back to Cities
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;

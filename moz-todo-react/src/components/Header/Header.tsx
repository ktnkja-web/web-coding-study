import React, { useState } from 'react'
import logo from '../../assets/logo.svg'
import './Header.css'

const Header: React.FC = () => {
  const [isopen, setIsopen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsopen(!isopen);
  };

  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__logo">
          <a href="/">
            <img src={logo} alt="sneakers" />
          </a>
        </h1>

        <button className={`header__menu-toggle ${isopen ? 'is-open' : ''}`} aria-label="メニューを開く" aria-expanded={isopen} aria-controls="header-menu" onClick={toggleMenu}>
          <span className="header__menu-bar"></span>
          <span className="header__menu-bar"></span>
          <span className="header__menu-bar"></span>
        </button>
      </div>

      <div className={`header__mask ${isopen ? 'is-open' : ''}`} onClick={toggleMenu}></div>

      <div className={`header__menu ${isopen ? 'is-open' : ''}`} id='header-menu'>
        <div className="header__menu-inner">
          <nav className="header__nav">
            <ul className="header__nav-list">
              <li className="header__nav-item"><a href="#pickup" onClick={toggleMenu}>PICK UP</a></li>
              <li className="header__nav-item"><a href="#feature" onClick={toggleMenu}>FEATURE</a></li>
              <li className="header__nav-item"><a href="#contact" onClick={toggleMenu}>CONTACT</a></li>
            </ul>
          </nav>

          <ul className="header__social">
            <li className="header__social-item"><a href="">Twitter</a></li>
            <li className="header__social-item"><a href="">facebook</a></li>
            <li className="header__social-item"><a href="">instagram</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;

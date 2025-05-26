import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from './Theme.jsx'

function Logo() {
  return (
    <>
      <a id="logo" href="/">
        <h1>F1 Tipping</h1>
      </a>
    </>
  )
}

function HamburgerMenu() {
  return (
    <>
      <button className="icon">
        <svg className="hamburger" viewBox="0 0 15 16">
          <rect x="0" y="2" width="15" height="3" fill="white" />
          <rect x="0" y="7.5" width="15" height="3" fill="white" />
          <rect x="0" y="13" width="15" height="3" fill="white" />
        </svg>
      </button>
    </>
  )
}

function Breadcrumbs() {
  return (
    <>
      <div style={{ margin: 0 }}>
        <ol className="breadcrumb">
          <li>
            <a href="/">Hjem</a>
          </li>
          <li>
            <div>Test</div>
          </li>
        </ol>
      </div>
    </>
  )
}

function DropdownSection(props) {
  const { category, children } = props;
  const [isActive, setActive] = useState(false);

  function toggleSubMenu() {
    setActive(!isActive);
  }
  return (
    <>
      <div className="dropdown-section">
        <button className="dropdown-button" onClick={toggleSubMenu}>{category} &#x25BC;</button>
        <div
          className={`dropdown-content ${isActive ? 'active' : ''}`}
          style={{
            maxHeight: isActive ? '1000px' : '0',
          }}
        >
          {children}
        </div>
      </div>
    </>
  )
}


function DropdownMenu() {
  const {theme, toggleTheme } = useContext(ThemeContext);
  const themeNames = {
    "light": "Lys",
    "dark": "Mørk",
    "oled": "Mørkere"
  }
  return (
    <>
      <div id="links-container">
        <div id="links" style={{ maxHeight: '1000px' }}>
          <DropdownSection category="Tipping">
            <a href="/guess">Tipp</a>
            <a href="/race-guess">Tippet på løp</a>
          </DropdownSection>
          <DropdownSection category="Resultater">
            <a href="/user/compare">Sammenlign brukere</a>
            <a href="/stats">Statistikk</a>
            <a href="/score">Poengberegning</a>
            <a href="https://app.voiestad.no/f1-old">Resultater før 2025</a>
          </DropdownSection>
          <DropdownSection category="Andre">
            <a href="/bingo">Bingo</a>
          </DropdownSection>
          <DropdownSection category="Profil">
            <a href="/user/myprofile">Min Profil</a>
            <a href="/settings">Innstillinger</a>
            <a href="#">Logg ut</a>
          </DropdownSection>
          <button className="dropdown-button" onClick={toggleTheme}>Tema: {themeNames[theme]}</button>
          <a href="/admin">Admin Portal</a>
          <a href="/oauth2/authorization/google">Logg inn</a>
        </div>
      </div>
    </>
  )
}

function Header() {
  return (
    <>
      <header>
        <nav className="topnav">
          <Logo />
          <HamburgerMenu />
          <Breadcrumbs />
          <DropdownMenu />
        </nav>
      </header>
    </>
  )
}

export default Header

import { useState, useEffect, useContext, useRef } from 'react'
import { ThemeContext } from './Theme.jsx'
import axios from 'axios'

function Logo() {
  return (
    <>
      <a id="logo" href="/">
        <h1>F1 Tipping</h1>
      </a>
    </>
  )
}

function HamburgerMenu(props) {
  const { isActive, setActive } = props;
  function toggleActive() {
    setActive(!isActive);
  }
  return (
    <>
      <button className="icon" onClick={toggleActive}>
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
  const { category, linksRef, children } = props;
  const [isActive, setActive] = useState(false);
  const subMenuRef = useRef(null);
  function toggleSubMenu() {
    setActive(!isActive);
  }
  useEffect(() => {
    const links = linksRef.current;
    if (links.style.maxHeight == "0px") {
      return;
    }
    const subMenu = subMenuRef.current;
    links.style.transition = "";
    links.style.maxHeight = "5000px";
    if (isActive) {
      subMenu.style.maxHeight = subMenu.scrollHeight + "px";
    } else {
      subMenu.style.maxHeight = "";
    }
  }, [isActive]);
  return (
    <>
      <div className="dropdown-section">
        <button className="dropdown-button" onClick={toggleSubMenu}>{category} &#x25BC;</button>
        <div
          className={isActive ? 'active' : ''}
          ref={subMenuRef}
        >
          {children}
        </div>
      </div>
    </>
  )
}


function DropdownMenu(props) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const themeNames = {
    "light": "Lys",
    "dark": "Mørk",
    "oled": "Mørkere"
  }
  const { isMenuActive } = props;
  const linksRef = useRef(null);
  useEffect(() => {
    const links = linksRef.current;
    if (!isMenuActive && links.style.maxHeight == "0px") {
      return;
    }
    links.style = "transition: opacity 0.5s ease;";
    if (isMenuActive) {
      links.style = "transition: max-height 0.5s ease, opacity 0.5s ease;";
      links.style.maxHeight = links.scrollHeight + "px";
    } else {
      links.style.maxHeight = links.scrollHeight + "px";
      setTimeout(event => {
        links.style = "transition: max-height 0.5s ease, opacity 0.5s ease;";
        links.style.maxHeight = 0;
      }, 10);
    }
  }, [isMenuActive]);
  const [headerState, setHeaderState] = useState(null);
  function reloadHeaderState() {
    axios.get('/api/public/header')
      .then(res => setHeaderState(res.data))
      .catch(err => console.error(err));
  }
  useEffect(() => {
    reloadHeaderState();
  }, []);
  return (
    <>
      <div id="links-container">
        <div id="links"
          className={isMenuActive ? 'active' : ''}
          ref={linksRef}
          style={{maxHeight: '0px'}}
        >
          <DropdownSection category="Tipping" linksRef={linksRef}>
            {headerState && headerState.isAbleToGuess ? <a href="/guess">Tipp</a> : ''}
            {headerState && headerState.isRaceGuess ? <a href="/race-guess">Tippet på løp</a> : ''}
          </DropdownSection>
          <DropdownSection category="Resultater" linksRef={linksRef}>
            <a href="/user/compare">Sammenlign brukere</a>
            <a href="/stats">Statistikk</a>
            <a href="/score">Poengberegning</a>
            <a href="https://app.voiestad.no/f1-old">Resultater før 2025</a>
          </DropdownSection>
          <DropdownSection category="Andre" linksRef={linksRef}>
            <a href="/bingo">Bingo</a>
          </DropdownSection>
          {headerState && headerState.isLoggedIn ?
            <DropdownSection category="Profil" linksRef={linksRef}>
              <a href="/user/myprofile">Min Profil</a>
              <a href="/settings">Innstillinger</a>
              <a href="#">Logg ut</a>
            </DropdownSection>
            : ''
          }
          <button className="dropdown-button" onClick={toggleTheme}>Tema: {themeNames[theme]}</button>
          {headerState && headerState.isAdmin ? <a href="/admin">Admin Portal</a> : ''}
          {headerState && !headerState.isLoggedIn ? <a href="/oauth2/authorization/google">Logg inn</a> : ''}
        </div>
      </div>
    </>
  )
}

function Header() {
  const [isActive, setActive] = useState(false);
  return (
    <>
      <header>
        <nav className="topnav">
          <Logo />
          <HamburgerMenu isActive={isActive} setActive={setActive} />
          <Breadcrumbs />
          <DropdownMenu isMenuActive={isActive} />
        </nav>
      </header>
    </>
  )
}

export default Header

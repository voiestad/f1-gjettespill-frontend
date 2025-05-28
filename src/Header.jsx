import { useState, useEffect, useContext, useRef } from 'react'
import { ThemeContext } from './Theme.jsx'
import axios from 'axios'
import { useLocation, Link } from 'react-router'

function Logo() {
  return (
    <>
      <Link id="logo" to="/">
        <h1>F1 Tipping</h1>
      </Link>
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
  const [breadcrumbs, setBreadcrumbs] = useState(null);
  const location = useLocation();
  useEffect(() => {
    const pathName = location.pathname;
    axios.get(`/api/public/breadcrumbs?path=${pathName}`)
      .then(res => setBreadcrumbs(res.data))
      .catch(err => console.error(err));
  }, []);
  return (
    <>
      <div style={{ margin: 0 }}>
        <ol className="breadcrumb">
          {breadcrumbs ?
            breadcrumbs.map((crumb) => (
              <li key={crumb.text}>
                {crumb.path ? <Link to={crumb.path}>{crumb.text}</Link> : <div>{crumb.text}</div>}
              </li>
            )) : <li><div>Hjem</div></li>
          }
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
          style={{ maxHeight: '0px' }}
        >
          <DropdownSection category="Tipping" linksRef={linksRef}>
            {headerState && headerState.isAbleToGuess ? <Link to="/guess">Tipp</Link> : ''}
            {headerState && headerState.isRaceGuess ? <Link to="/race-guess">Tippet på løp</Link> : ''}
          </DropdownSection>
          <DropdownSection category="Resultater" linksRef={linksRef}>
            <Link to="/user/compare">Sammenlign brukere</Link>
            <Link to="/stats">Statistikk</Link>
            <Link to="/score">Poengberegning</Link>
            <Link to="https://app.voiestad.no/f1-old">Resultater før 2025</Link>
          </DropdownSection>
          <DropdownSection category="Andre" linksRef={linksRef}>
            <Link to="/bingo">Bingo</Link>
          </DropdownSection>
          {headerState && headerState.isLoggedIn ?
            <DropdownSection category="Profil" linksRef={linksRef}>
              <Link to="/user/myprofile">Min Profil</Link>
              <Link to="/settings">Innstillinger</Link>
              <Link to="#">Logg ut</Link>
            </DropdownSection>
            : ''
          }
          <button className="dropdown-button" onClick={toggleTheme}>Tema: {themeNames[theme]}</button>
          {headerState && headerState.isAdmin ? <Link to="/admin">Admin Portal</Link> : ''}
          {headerState && !headerState.isLoggedIn ? <Link to="/oauth2/authorization/google">Logg inn</Link> : ''}
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

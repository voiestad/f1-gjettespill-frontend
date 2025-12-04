import { useState, useEffect, useContext, useRef } from 'react'
import { CsrfTokenContext, ThemeContext } from '../components'
import axios from 'axios'
import { useLocation, Link, useNavigate } from 'react-router'
import Breadcrumbs from './Breadcrumbs'
import logo from '../assets/logo.svg';

function Logo() {
  return (
    <>
      <Link id="logo" to="/">
        <img src={logo} alt="" width="45" height="45" />
        <h1>F1 Gjettespill</h1>
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
  const { token, headerName } = useContext(CsrfTokenContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const themeNames = {
    "light": "Lys",
    "dark": "Mørk",
    "oled": "Mørkere"
  }
  const { isMenuActive, setActive } = props;
  const linksRef = useRef(null);
  const navigate = useNavigate();

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
      setTimeout(() => {
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
  const { pathname } = useLocation();
  useEffect(() => {
    setActive(false);
  }, [pathname]);

  useEffect(() => {
    reloadHeaderState();
  }, []);

  function logout() {
    axios.post('/api/logout', {}, {
      headers: {
        [headerName]: token
      }
    })
      .then(res => {
        navigate('/');
        reloadHeaderState();
      })
      .catch(err => console.error(err));
  }

  return (
    <>
      <div id="links-container">
        <div id="links"
          className={isMenuActive ? 'active' : ''}
          ref={linksRef}
          style={{ maxHeight: '0px' }}
        >
          <Link to="/guess">Gjett</Link>
          <Link to="/race-guess">Gjettet på løp</Link>
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
              <Link onClick={logout}>Logg ut</Link>
            </DropdownSection>
            : ''
          }
          <button className="dropdown-button" onClick={toggleTheme}>Tema: {themeNames[theme]}</button>
          {headerState && headerState.isAdmin ? <Link to="/admin">Admin Portal</Link> : ''}
          {headerState && headerState.isAdmin && headerState.ongoingRace ?
            <Link to={`/admin/flag/${headerState.ongoingRace.year}/${headerState.ongoingRace.id}`}>
              Registrer flagg
            </Link> : ''}
          {headerState && !headerState.isLoggedIn ? <Link onClick={() => localStorage.setItem("redirectAfterLogin", pathname)} to="/login">Logg inn</Link> : ''}
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
          <DropdownMenu isMenuActive={isActive} setActive={setActive} />
        </nav>
      </header>
    </>
  )
}

export default Header

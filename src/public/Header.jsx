import {
  useState, useEffect, useContext, useRef, Children, isValidElement, cloneElement,
} from 'react'
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
  const { category, linksRef, children, updateSelectable } = props;
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
    updateSelectable();
  }, [isActive]);
  return (
    <>
      <div className="dropdown-section">
        <button className="dropdown-button selectable" onClick={toggleSubMenu}>{category} &#x25BC;</button>
        <div
          className={isActive ? 'active' : ''}
          ref={subMenuRef}
        >
          {Children.map(children, child =>
            isValidElement(child)
              ? cloneElement(child, {
                className: `${child.props.className ?? ''} ${isActive ? 'selectable' : ''
                  }`.trim()
              })
              : child
          )}
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
  const [headerState, setHeaderState] = useState(null);

  function updateSelectable() {
    const links = linksRef.current;

    links.querySelectorAll('a, button').forEach(el => {
      const classList = el.classList;
      if (isMenuActive && classList.contains("selectable")) {
        el.removeAttribute('tabindex');
      } else {
        el.setAttribute('tabindex', '-1');
      }
    });
  }

  useEffect(() => {
    const links = linksRef.current;
    updateSelectable();
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
  }, [isMenuActive, headerState]);

  function reloadHeaderState() {
    axios.get('/api/public/header')
      .then(res => setHeaderState(res.data))
      .catch(err => console.error(err));
  }
  const { pathname } = useLocation();
  useEffect(() => {
    setActive(false);
    if (pathname === '/') {
      reloadHeaderState();
    }
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
          <Link to="/guess" className="selectable">Gjett</Link>
          <Link to="/race-guess" className="selectable">Gjettet på løp</Link>
          <DropdownSection category="Resultater" linksRef={linksRef} updateSelectable={updateSelectable}>
            <Link to="/user/compare">Sammenlign brukere</Link>
            <Link to="/stats">Statistikk</Link>
            <Link to="/score">Poengberegning</Link>
            <Link to="https://app.voiestad.no/f1-old">Resultater før 2025</Link>
          </DropdownSection>
          <DropdownSection category="Andre" linksRef={linksRef} updateSelectable={updateSelectable}>
            <Link to="/bingo">Bingo</Link>
          </DropdownSection>
          <Link to="/league" className="selectable">Liga</Link>
          {headerState && headerState.isLoggedIn ?
            <DropdownSection category="Profil" linksRef={linksRef} updateSelectable={updateSelectable}>
              <Link to="/user/myprofile">Min Profil</Link>
              <Link to="/settings">Innstillinger</Link>
              <Link onClick={logout}>Logg ut</Link>
            </DropdownSection>
            : ''
          }
          <button className="dropdown-button selectable" onClick={toggleTheme}>Tema: {themeNames[theme]}</button>
          {headerState && headerState.isAdmin ? <Link to="/admin" className="selectable">Admin Portal</Link> : ''}
          {headerState && headerState.isAdmin && headerState.ongoingRace ?
            <Link to={`/admin/flag/${headerState.ongoingRace.year}/${headerState.ongoingRace.id}`} className="selectable">
              Registrer flagg
            </Link> : ''}
          {headerState && !headerState.isLoggedIn ? <Link onClick={() => localStorage.setItem("redirectAfterLogin", pathname)} to="/login" className="selectable">Logg inn</Link> : ''}
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

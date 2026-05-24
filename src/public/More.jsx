import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { CsrfTokenContext, ThemeContext } from "../components";

export default function More() {
  const [headerState, setHeaderState] = useState(null);
  const navigate = useNavigate();
  const { token, headerName } = useContext(CsrfTokenContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const themeNames = {
    "light": "Lys",
    "dark": "Mørk",
    "oled": "Mørkere"
  }

  function reloadHeaderState() {
    axios.get('/api/public/header')
      .then(res => setHeaderState(res.data))
      .catch(err => console.error(err));
  }
  useEffect(() => {
    reloadHeaderState();
  }, []);

  function logout() {
    axios.post('/api/logout', {}, {
      headers: {
        [headerName]: token
      }
    })
      .then(() => {
        navigate('/');
        reloadHeaderState();
      })
      .catch(err => console.error(err));
  }

  return (
    <>
      <title>Mer</title>
      <h2>Mer</h2>
      <div className="linkList">
        {headerState && headerState.isAdmin ? <Link to="/admin">Admin Portal</Link> : null}
        {headerState && headerState.isAdmin && headerState.ongoingRace ?
          <Link to={`/admin/flag/${headerState.ongoingRace.year}/${headerState.ongoingRace.id}`}>
            Registrer flagg
          </Link> : null}
        <Link to="/bingo">Bingo</Link>
        <Link to="/stats">Statistikk</Link>
        <Link to="/user/compare">Sammenlign brukere</Link>
        <Link to="/score">Poengberegning</Link>
        <Link to="https://app.voiestad.no/f1-old">Resultater før 2025</Link>
        <button onClick={toggleTheme}>Tema: {themeNames[theme]}</button>
        {headerState && headerState.isLoggedIn ?
          <>
            <Link to="/settings">Innstillinger</Link>
            <Link onClick={logout}>Logg ut</Link>
          </>
          : null
        }
        {headerState && !headerState.isLoggedIn ? <Link onClick={() => localStorage.setItem("redirectAfterLogin", "/more")} to="/login">Logg inn</Link> : null}
      </div>
      <br />
      <div className="linkList">
        <Link to="/about">Om siden</Link>
        <Link to="/github">GitHub</Link>
        <Link to="/contact">Kontakt</Link>
        <Link to="/privacy">Personvernerklæring</Link>
      </div>
    </>
  );
}

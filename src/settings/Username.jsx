import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ErrorNotLoggedIn } from '../error';
import { Link, useNavigate } from 'react-router';
import { CsrfTokenContext } from '../components';

function Username() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isNewUser, setIsNewUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState(null);
  const [hasChanged, setHasChanged] = useState(false);
  const { token, headerName } = useContext(CsrfTokenContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/public/user/status')
      .then(res => {
        setIsNewUser(res.data === "NO_USERNAME");
        setIsLoggedIn(res.data !== "LOGGED_OUT");
      })
      .catch(err => console.error(err));
  }, []);

  function logout(event) {
    event.preventDefault();
    axios.post('/api/logout', {}, {
      headers: {
        [headerName]: token
      }
    })
      .then(res => {
        navigate('/');
      })
      .catch(err => console.error(err));
  }
  function changeUsername(event) {
    event.preventDefault();
    axios.post('/api/settings/username/change', {},
      {
        params: {
          username: username,
        },
        headers: {
          [headerName]: token
        }
      })
      .then(() => {
        setMessage(<p>Brukernavnet ble satt.</p>);
        setHasChanged(true);
      })
      .catch(err => {
        setMessage(<p>{err.response.data}</p>);
        console.error(err);
      })
  }
  return (
    <>
      {isLoggedIn ?
        <>
          <title>Velg brukernavn</title>
          <h2>Velg brukernavn</h2>
          {message ? message : ''}
          {!hasChanged ?
            <>
              <form onSubmit={changeUsername}>
                <input type="text" required placeholder="Brukernavn" autoComplete="off" onChange={e => setUsername(e.target.value)} /><br /><br />
                <input type="submit" value="Bekreft brukernavn" />
              </form>
              {isNewUser ?
                <form onSubmit={logout}>
                  <input type="submit" value="Logg ut" />
                </form>
                : ''}
            </> : <Link to="/">Tilbake til hjem</Link>}
        </>
        : (isLoggedIn !== null ? <ErrorNotLoggedIn /> : '')}
    </>
  )
}

export default Username

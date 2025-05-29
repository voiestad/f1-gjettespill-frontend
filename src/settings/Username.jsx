import { useState, useEffect } from 'react';
import axios from 'axios';
import { ErrorNotLoggedIn } from '../error';
import { Link } from 'react-router';

function Username() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isNewUser, setIsNewUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    axios.get('/api/public/user/status')
      .then(res => {
        setIsNewUser(res.data === "NO_USERNAME");
        setIsLoggedIn(res.data !== "LOGGED_OUT");
      })
      .catch(err => console.error(err));
  }, []);
  function validateContent(event) {
    const validNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let value = event.target.value;
    let newVal = "";
    let counter = 0;
    for (let c of value) {
      if (counter == 19) {
        break;
      }
      if (c in validNumbers) {
        newVal += c;
        counter++;
      }
    }
    event.target.value = newVal;
    setReferralCode(newVal);
  }
  function logout(event) {
    event.preventDefault();
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/logout', {}, {
          headers: {
            [headerName]: token
          }
        })
          .then(reloadHeaderState())
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }
  function changeUsername(event) {
    event.preventDefault();
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/settings/username/change', {},
          {
            params: {
              username: username,
              referralCode: referralCode
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
      })
      .catch(err => console.error(err));
  }
  return (
    <>
      {isLoggedIn ?
        <>
          <h2>Velg brukernavn</h2>
          {message ? message : ''}
          {!hasChanged ?
            <>
              <form onSubmit={changeUsername}>
                <input type="text" required placeholder="Brukernavn" autoComplete="off" onChange={e => setUsername(e.target.value)} /><br /><br />
                {isNewUser ?
                  <label>Invitasjonskode<br />
                    <div className="pin-container">
                      <input type="text" className="pin-input" inputMode="numeric"
                        autoComplete="off" onChange={validateContent} />
                    </div>
                  </label>
                  : ''}
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

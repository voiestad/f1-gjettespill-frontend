import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { CsrfTokenContext } from '../components';
import Table from '../util/Table';

function Account() {
  const [username, setUsername] = useState(null);
  const [inputUsername, setInputUsername] = useState("");
  const [info, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token, headerName } = useContext(CsrfTokenContext);

  function load() {
    axios.get('/api/settings/username')
      .then(res => setUsername(res.data))
      .catch(err => console.error(err));
    axios.get('/api/settings/info')
      .then(res => setUserInfo(res.data))
      .catch(err => console.error(err));
  }

  useEffect(() => {
    load();
  }, []);

  function deleteAccount(event) {
    event.preventDefault();
    axios.post('/api/settings/delete', {},
      {
        params: {
          username: inputUsername
        },
        headers: {
          [headerName]: token
        }
      })
      .then(res => {
        alert('Brukeren din ble slettet');
        navigate('/');
      })
      .catch(err => {
        alert('Brukernavnet var feil');
        console.error(err);
      })
  }

  async function linkAccount(provider) {
    setLoading(true);
    axios.post('/api/settings/link', {},
      {
        headers: {
          [headerName]: token
        }
      })
      .then(res => {
        window.location.href = `/api/oauth2/authorization/${provider}?remember_me`;
      })
      .catch(err => {
        alert('Noe gikk galt');
        console.error(err);
      })
  }

  async function unlinkAccount(provider) {
    if (!confirm(`Er du sikker på at du vil fjerne ${provider[0].toUpperCase() + provider.substring(1)}-kontoen?`)) {
      return;
    }
    setLoading(true);
    axios.post(`/api/settings/unlink/${provider}`, {},
      {
        headers: {
          [headerName]: token
        }
      })
      .then(res => {
        axios.post('/api/logout', {}, {
          headers: {
            [headerName]: token
          }
        })
          .then(res => {
            navigate('/');
          })
          .catch(err => console.error(err));
      })
      .catch(err => {
        alert('Noe gikk galt');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return (
    <>
      <title>Konto</title>
      {info &&
        <div className="tables">
          <Table title="Tilkoblede kontoer" header={["Innlogging", "ID"]}
            body={[
              {
                key: "google", values: [
                  "Google",
                  info.user.providers.google
                    ? <button onClick={() => unlinkAccount("google")} disabled={!info.user.providers.apple || loading}>Fjern Google-konto</button>
                    : <button onClick={() => linkAccount("google")} disabled={loading}>Legg til Google-konto</button>
                ]
              },
              {
                key: "apple", values: [
                  "Apple",
                  info.user.providers.apple
                    ? <button onClick={() => unlinkAccount("apple")} disabled={!info.user.providers.google || loading}>Fjern Apple-konto</button>
                    : <button onClick={() => linkAccount("apple")} disabled={loading}>Legg til Apple-konto</button>
                ]
              }
            ]} />
        </div>
      }
      <h3>Slett bruker</h3>
      <p>Skriv inn brukernavnet ditt for å bekrefte: {username ? username : ''}</p>
      <form>
        <div>
          <input type="text" name="username" placeholder="Brukernavn" required
            onChange={e => setInputUsername(e.target.value)} />
        </div>
        <input type="submit" value="Bekreft sletting" onClick={deleteAccount} />
      </form>
    </>
  )
}

export default Account

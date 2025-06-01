import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

function DeleteAccount() {
  const [username, setUsername] = useState(null);
  const [inputUsername, setInputUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/settings/username')
      .then(res => setUsername(res.data))
      .catch(err => console.error(err));
  }, []);

  function deleteAccount(event) {
    event.preventDefault();
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
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
            console.log(res.data);
            alert('Brukeren din ble slettet');
            navigate('/');
          })
          .catch(err => {
            alert('Brukernavnet var feil');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  return (
    <>
      <h2>Slett bruker</h2>
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

export default DeleteAccount

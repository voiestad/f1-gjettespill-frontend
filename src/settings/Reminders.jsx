import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import Table from '../util/Table';
import { CsrfTokenContext } from '../components';

function Reminders() {
  const [preferences, setPreferences] = useState({ topic: false });
  const { token, headerName } = useContext(CsrfTokenContext);

  function loadPreferences() {
    axios.get('/api/settings/ntfy')
      .then(res => setPreferences(res.data))
      .catch(err => console.error(err));
  }

  function addTopic(event) {
    event.preventDefault();
    axios.post('/api/settings/ntfy/add', {}, {
      headers: {
        [headerName]: token
      }
    })
      .then(res => {
        loadPreferences();
      })
      .catch(err => {
        alert('Kunne ikke lage ntfy-kanal. Vennligst prøv igjen');
      });
  }

  function changePreference(shouldAdd, option) {
    const path = shouldAdd ? '/api/settings/ntfy/option/add' : '/api/settings/ntfy/option/remove';
    axios.post(path, {}, {
      params: {
        option: option
      },
      headers: {
        [headerName]: token
      }
    })
      .then(res => {
        const preferencesCopy = Object.create(preferences);
        preferencesCopy.options[option] = !preferencesCopy.options[option];
        setPreferences(preferencesCopy);
      })
      .catch(err => {
        alert('Preferansene dine kunne ikke endres. Vennligst prøv igjen');
        console.error(err);
      });
  }

  function removeTopic(event) {
    event.preventDefault();
    if (!confirm("Er du sikker på at du vil fjerne ntfy-kanalen?")) {
      return;
    }
    axios.post('/api/settings/ntfy/remove', {}, {
      headers: {
        [headerName]: token
      }
    })
      .then(res => {
        loadPreferences();
      })
      .catch(err => alert('Kunne ikke fjerne ntfy-kanal. Vennligst prøv igjen'));
  }

  function testNotification(event) {
    event.preventDefault();
    axios.post('/api/settings/ntfy/test', {}, {
      headers: {
        [headerName]: token
      }
    }).catch(err => alert('Fikk ikke sendt varsling. Vennligst prøv igjen'));
  }

  async function copyTopic(event) {
    event.preventDefault();
    try {
      await window.navigator.clipboard.writeText(preferences.topic);
      alert("Kanal kopiert!");
    } catch (err) {
      alert("Greide ikke å kopiere kanalen.");
    }
  }

  async function copyUrl(event) {
    event.preventDefault();
    try {
      await window.navigator.clipboard.writeText("https://ntfy.f1gjettespill.no");
      alert("Lenke kopiert!");
    } catch (err) {
      alert("Greide ikke å kopiere lenken.");
    }
  }

  useEffect(() => {
    loadPreferences();
  }, []);

  return (
    <>
      <title>Påminnelser</title>
      <h2>Påminnelser</h2>
      {
        preferences.topic ?
          <>
            <h4>Instruksjoner for oppsett:</h4>
            <p>

              1. Last ned app eller bruk nettleser: <br />
              <Link to="https://apps.apple.com/us/app/ntfy/id1625396347">IOS</Link> <br />
              <Link to="https://play.google.com/store/apps/details?id=io.heckel.ntfy">Android</Link> <br />
              <Link to="https://ntfy.f1gjettespill.no">Nettleser</Link> <br /><br />
              2. Trykk på "+" for å legge til kanalen <br /><br />
              3. Legg inn ID-en til kanalen: <br />
              {preferences.topic} <br /><br />
              <button onClick={copyTopic}>Kopier kanal</button> <br /><br />
              4. Trykk på "Choose another server" og legg inn lenken: <br />
              https://ntfy.f1gjettespill.no <br /><br />
              <button onClick={copyUrl}>Kopier server-lenke</button> <br /><br />
              5. Trykk på "Subscribe" <br /><br />
              6. Sjekk om du får varsling med en testvarsling
            </p>
            <form>
              <input type="submit" value="Send testvarsling" onClick={testNotification} /> <br />
            </form>
            <p>
              7. Sett preferansene dine
            </p>
            <div className="tables">
              <table>
                <thead>
                  <tr>
                    <th>Antall timer før løp</th>
                    <th>Av/på</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(preferences.options).map(option => ({
                    key: option,
                    values: [option, <input type="checkbox"
                      onChange={e => changePreference(!preferences.options[option], option)}
                      checked={preferences.options[option]} />]
                  })
                  ).map(row =>
                    <tr key={row.key}>
                      {row.values.map((cell, i) =>
                        <td key={i}>{cell != null ? cell : 'N/A'}</td>
                      )}
                    </tr>
                  )}
                </tbody>
              </table>
            </div > < br />< br />
            <form>
              <input type="submit" value="Fjern ntfy-kanal" onClick={removeTopic} /> <br /><br />
            </form>
          </>
          :
          <>
            <form>
              <div className="paragraph">
                <p>
                  Ved å melde deg på for å få påminnelser vil du få påminnelser via <Link to="https://ntfy.sh/">ntfy</Link>, hvis
                  du fremdeles ikke har gjettet 1, 2, 3, 6, 12 og/eller 24 timer før hvert løp basert på preferansene du velger.
                  Du kan når som helst endre tidspunktene du får påminnelse på, eller melde deg helt av.
                </p>
              </div>
            </form>
            <input type="submit" value="Lag ntfy-kanal" onClick={addTopic} />
          </>
      }
    </>
  )
}

export default Reminders

import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Table from '../util/Table';
import { CsrfTokenContext } from '../components';

function Mail() {
  const [preferences, setPreferences] = useState({ hasMail: false });
  const [mail, setMail] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const { token, headerName } = useContext(CsrfTokenContext);

  function loadPreferences() {
    axios.get('/api/settings/mail')
      .then(res => setPreferences(res.data))
      .catch(err => console.error(err));
  }

  function registerMail(event) {
    event.preventDefault();
    setLoader(true);
    axios.post('/api/settings/mail/add', {}, {
      params: {
        email: mail
      },
      headers: {
        [headerName]: token
      }
    })
      .then(res => {
        navigate('/settings/mail/verification');
      })
      .catch(err => {
        alert('Ugyldig e-post. Vennligst prøv igjen');
        setLoader(false);
      });
  }

  function changePreference(shouldAdd, option) {
    const path = shouldAdd ? '/api/settings/mail/option/add' : '/api/settings/mail/option/remove';
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
        preferencesCopy.mailOptions[option] = !preferencesCopy.mailOptions[option];
        setPreferences(preferencesCopy);
      })
      .catch(err => {
        alert('Preferansene dine kunne ikke endres. Vennligst prøv igjen');
        console.error(err);
      });
  }

  function unsubscribe(event) {
    event.preventDefault();
    axios.post('/api/settings/mail/remove', {}, {
      headers: {
        [headerName]: token
      }
    })
      .then(res => {
        alert('Du ble avmeldt');
        loadPreferences();
      })
      .catch(err => alert('Kunne ikke melde deg av. Vennligst prøv igjen'));
  }

  useEffect(() => {
    loadPreferences();
  }, []);

  return (
    <>
      <title>Påminnelser</title>
      <h2>Påminnelser</h2>
      {!loader ?
        <>
          {preferences.hasMail ?
            <div className="tables">
              <Table title="" header={["Antall timer før løp", "Av/på"]}
                body={Object.keys(preferences.mailOptions).map(option => ({
                  key: option,
                  values: [option, <input type="checkbox"
                    onChange={e => changePreference(!preferences.mailOptions[option], option)}
                    checked={preferences.mailOptions[option]} />]
                })
                )} />
            </div >
            : ''
          }
          <form>
            <div className="paragraph">
              <p>
                Ved å melde deg på for å få påminnelser vil du få en e-post hvis du fremdeles ikke har gjettet 1,
                2, 3, 6, 12 og/eller 24 timer før hvert løp etter hva du selv velger. Du kan når som helst endre
                tidspunktene du får påminnelse på, eller melde deg helt av.
              </p>
              <input type="email" onChange={e => setMail(e.target.value)}
                pattern="^([\w\-\.])+(\+?[\w\-\.]+)?@([\w\-]+\.)+[\w\-]{2,4}$" required placeholder="E-post"
                title="eksempel@epost.no" autoComplete="on" />
            </div>
            <input type="submit" value="Meld på" onClick={registerMail} />
          </form>
          {
            preferences.hasMail ?
              <form>
                <input type="submit" value="Meld av" onClick={unsubscribe} />
              </form>
              : ''
          }
        </>
        :
        <>
          {
            loader ?
              <div className="loading-container">
                < div className="loading"></div >
                <p>Laster...</p>
              </div >
              : ''
          }
        </>
      }

    </>
  )
}

export default Mail

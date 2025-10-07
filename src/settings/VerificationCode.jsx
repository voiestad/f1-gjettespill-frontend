import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';
import { CsrfTokenContext } from '../components';

function VerificationCode() {
  const [verificationCode, setVerificationCode] = useState("");
  const [hasCode, setHasCode] = useState(null);
  const navigate = useNavigate();
  const { token, headerName } = useContext(CsrfTokenContext);

  useEffect(() => {
    axios.get('/api/settings/mail/verification')
      .then(res => setHasCode(res.data))
      .catch(err => console.error(err));
  }, []);

  function verify(event) {
    event.preventDefault();
    if (verificationCode.length < 9) {
      alert('Verifikasjonskoden må inneholde 9 tall');
      return;
    }
    axios.post('/api/settings/mail/verification', {},
      {
        params: {
          code: verificationCode
        },
        headers: {
          [headerName]: token
        }
      })
      .then(() => {
        alert('E-posten ble verifisert');
        navigate('/settings/mail');
      })
      .catch(err => {
        alert('Verifikasjonskoden var feil, vennligst prøv igjen');
        console.error(err);
      })
  }

  function validateContent(event) {
    const validNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let value = event.target.value;
    let newVal = "";
    let counter = 0;
    for (let c of value) {
      if (counter == 9) {
        break;
      }
      if (c in validNumbers) {
        newVal += c;
        counter++;
      }
    }
    event.target.value = newVal;
    setVerificationCode(newVal);
  }

  return (
    <>
      {
        hasCode ?
          <>
            <title>Verifiser e-post</title>
            <h2>Verifiser e-post</h2>
            <form>
              <div className="pin-container">
                <input id="pin-input9" type="text" className="pin-input" pattern="\d{9}" inputMode="numeric"
                  autoComplete="off" onChange={validateContent} />
              </div>
              <input type="submit" value="Verifiser" onClick={verify} />
            </form>
          </>
          : ''
      }
      {
        hasCode != null && !hasCode ?
          <>
            <h2>Ingen verifikasjonskode funnet...</h2>
            <p>
              Det ble ikke funnet en verifikasjonskode på brukeren din.
              Vennligst legg inn en e-post <Link to="/settings/mail">her</Link>.
            </p>
          </>
          : ''
      }
      {

      }
    </>
  )
}

export default VerificationCode

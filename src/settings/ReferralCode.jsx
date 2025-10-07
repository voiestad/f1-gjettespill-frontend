import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CsrfTokenContext } from '../components';

function ReferralCode() {
  const [referralCode, setReferralCode] = useState(null);
  const { token, headerName } = useContext(CsrfTokenContext);

  useEffect(() => {
    axios.get('/api/settings/referral')
      .then(res => {
        setReferralCode(BigInt(res.data.code));
      })
      .catch(err => console.error(err));
  }, []);

  function createReferralCode(event) {
    event.preventDefault();
    axios.post('/api/settings/referral/add', {},
      {
        headers: {
          [headerName]: token
        }
      })
      .then(res => {
        setReferralCode(BigInt(res.data.code));
      })
      .catch(err => {
        setMessage(<p>{err.response.data}</p>);
        console.error(err);
      })
  }

  function deleteReferralCode(event) {
    event.preventDefault();
    axios.post('/api/settings/referral/delete', {},
      {
        headers: {
          [headerName]: token
        }
      })
      .then(res => setReferralCode(null))
      .catch(err => {
        alert('Det oppstod en feil ved slettingen');
        console.error(err);
      })
  }

  return (
    <>
      <title>Inviter brukere</title>
      <h2>Inviter brukere</h2>
      <form>
        <input type="submit" value="Lag invitasjonskode" onClick={createReferralCode} />
      </form>
      {referralCode ?
        <>
          <p>Din invitasjonskode er:</p>
          <h3>{referralCode}</h3>
          <p>Den varer i en time fra den ble laget.</p>
          <form>
            <input type="submit" value="Slett invitasjonskode" onClick={deleteReferralCode} />
          </form>
        </>
        : ''}
    </>
  )
}

export default ReferralCode

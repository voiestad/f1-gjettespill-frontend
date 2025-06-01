import { useEffect, useState } from 'react';
import axios from 'axios';

function ReferralCode() {
  const [referralCode, setReferralCode] = useState(null);

  useEffect(() => {
    axios.get('/api/settings/referral')
      .then(res => {
        setReferralCode(BigInt(res.data.code));
      })
      .catch(err => console.error(err));
  }, []);

  function createReferralCode(event) {
    event.preventDefault();
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
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
      })
      .catch(err => console.error(err));
  }

  function deleteReferralCode(event) {
    event.preventDefault();
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/settings/referral/delete', {},
          {
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            setReferralCode(null);
            alert('Invitasjonkoden ble slettet');
          })
          .catch(err => {
            alert('Det oppstod en feil ved slettingen');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  return (
    <>
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

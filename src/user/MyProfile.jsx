import { useEffect, useState } from 'react';
import axios from 'axios';
import ProfilePage from './ProfilePage';

function MyProfile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [raceId, setRaceId] = useState(null);
  useEffect(() => {
    axios.get('/api/user/myprofile', {
      params: {
        raceId: raceId
      }
    })
      .then(res => setUserData(res.data))
      .catch(err => {
        console.error(err);
        setError("Du må være innlogget for å se profilen din.");
      })
  }, [raceId]);
  return (
    <>
      <title>Min profil</title>
      {userData ?
        <ProfilePage userData={userData} setRaceId={setRaceId} />
        : ''}
      {error ? <p>{error}</p> : ''}
    </>
  );
}

export default MyProfile

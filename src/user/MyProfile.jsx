import { useEffect, useState } from 'react';
import axios from 'axios';
import ProfilePage from './ProfilePage';

function MyProfile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [raceId, setRaceId] = useState(null);
  const [placements, setPlacements] = useState(null);
  useEffect(() => {
    axios.get('/api/user/my-profile', {
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
  useEffect(() => {
    axios.get('/api/user/my-placements')
      .then(res => setPlacements(res.data))
      .catch(err => {
        console.error(err);
        setError("Du må være innlogget for å se profilen din.");
      })
  }, []);
  return (
    <>
      <title>Min profil</title>
      {userData && placements ?
        <ProfilePage userData={userData} setRaceId={setRaceId} placements={placements} />
        : ''}
      {error ? <p>{error}</p> : ''}
    </>
  );
}

export default MyProfile

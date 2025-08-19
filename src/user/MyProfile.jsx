import { useEffect, useState } from 'react';
import axios from 'axios';
import UserStats from './UserStats';
import Placements from './Placements';

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
      {placements ? <Placements placements={placements} /> : ''}
      {userData ?
        <UserStats userData={userData} setRaceId={setRaceId} />
        : ''}
      {error ? <p>{error}</p> : ''}
    </>
  );
}

export default MyProfile

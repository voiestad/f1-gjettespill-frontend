import { useEffect, useState } from 'react';
import axios from 'axios';
import UserStats from './UserStats';
import Placements from './Placements';
import RacePicker from './RacePicker';

function MyProfile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [raceId, setRaceId] = useState(null);
  const [placements, setPlacements] = useState(null);
  useEffect(() => {
    if (raceId == null) {
      setUserData(null);
      return;
    }
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
      <RacePicker setRaceId={setRaceId} raceId={raceId} />
      {userData ? <UserStats userData={userData} /> : ''}
      {error ? <p>{error}</p> : ''}
    </>
  );
}

export default MyProfile

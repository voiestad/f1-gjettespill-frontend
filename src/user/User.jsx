import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ErrorGuessingNotAvailableYet, ErrorNotFound } from '../error';
import axios from 'axios';
import UserStats from './UserStats';
import Placements from './Placements';
import RacePicker from './RacePicker';

function User() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [raceId, setRaceId] = useState(null);
  const [placements, setPlacements] = useState(null);
  useEffect(() => {
    if (raceId == null) {
      setUserData(null);
      return;
    }
    axios.get(`/api/public/user/${id}`, {
      params: {
        raceId: raceId
      }
    })
      .then(res => setUserData(res.data))
      .catch(err => {
        if (err.status === 403) {
          setError(<ErrorGuessingNotAvailableYet />);
        } else if (err.status === 404 || err.status === 400) {
          setError(<ErrorNotFound />);
        } else {
          console.error(err);
        }
      })
  }, [raceId]);
   useEffect(() => {
    axios.get(`/api/public/user/placements/${id}`)
      .then(res => setPlacements(res.data))
      .catch(err => {
        console.error(err);
      })
  }, []);
  return (
    <>
      <title>{placements ? placements.username : 'Laster bruker...'}</title>
      {placements ? <Placements placements={placements} /> : ''}
      <RacePicker setRaceId={setRaceId} raceId={raceId} />
      {userData ? <UserStats userData={userData} /> : ''}
      {error ? error : ''}
    </>
  );
}

export default User

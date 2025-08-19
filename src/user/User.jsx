import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ErrorGuessingNotAvailableYet, ErrorNotFound } from '../error';
import axios from 'axios';
import ProfilePage from './ProfilePage';

function User() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [raceId, setRaceId] = useState(null);
  const [placements, setPlacements] = useState(null);
  useEffect(() => {
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
        setError("Du må være innlogget for å se profilen din.");
      })
  }, []);
  return (
    <>

      {userData && placements ?
        <>
          <title>{userData.userScores.user.username}</title>
          <ProfilePage userData={userData} setRaceId={setRaceId} placements={placements} />
        </>
        : <title>Laster bruker...</title>}
      {error ? error : ''}
    </>
  );
}

export default User

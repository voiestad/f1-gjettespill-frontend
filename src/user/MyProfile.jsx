import { useEffect, useState } from 'react';
import axios from 'axios';
import ProfilePage from './ProfilePage';

function MyProfile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    axios.get('/api/user/myprofile')
    .then(res => setUserData(res.data))
    .catch(err => {
      console.error(err);
      setError("Du må være innlogget for å se profilen din.");
    })
  }, []);
  return (
    <>
      {userData ?
        <ProfilePage userData={userData} />
        : ''}
      {error ? <p>{error}</p> : ''}
    </>
  );
}

export default MyProfile

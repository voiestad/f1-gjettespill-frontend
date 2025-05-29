import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ErrorGuessingNotAvailableYet, ErrorNotFound } from '../error';
import axios from 'axios';
import ProfilePage from './ProfilePage';

function User() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    axios.get(`/api/public/user/${id}`)
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
  }, []);
  return (
    <>
      {userData ?
        <ProfilePage userData={userData} />
        : ''}
      {error ? error : ''}
    </>
  );
}

export default User

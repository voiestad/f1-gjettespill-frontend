import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

function LoggedIn() {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/public/user/status')
      .then(res => {
        if (res.data !== "NO_USERNAME") {
          const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        } else {
          navigate('/settings/username');
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <title>Logger inn...</title>
      <p>Logger inn...</p>
    </>
  )
};

export default LoggedIn

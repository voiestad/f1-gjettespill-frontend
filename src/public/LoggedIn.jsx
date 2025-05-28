import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoggedIn() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
    navigate(redirectPath);
  }, []);

  return <p>Logger inn...</p>;
};

export default LoggedIn

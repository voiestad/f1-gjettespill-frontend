import axios from 'axios';
import { Outlet, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { ErrorNotLoggedIn, ErrorNoUsername, ErrorUnknown } from '../error';

function ProtectedRoute() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    axios.get('/api/public/user/status')
      .then(res => {
        if (res.data === "NO_USERNAME") {
          setContent(<ErrorNoUsername />);
        } else if (res.data === "LOGGED_OUT") {
          setContent(<ErrorNotLoggedIn />);
        } else {
          setContent(<Outlet />);
        }
      })
      .catch(err => {
        console.error(err);
        setContent(<ErrorUnknown />);
      });
  }, [])
  return (
    <>
      {content ? content : ''}
    </>
  )
}


export default ProtectedRoute

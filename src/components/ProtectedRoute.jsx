import axios from 'axios';
import { Outlet } from 'react-router';
import { useState, useEffect } from 'react';
import { ErrorNotLoggedIn, ErrorNoUsername, ErrorUnknown } from '../error';

function ProtectedRoute() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    axios.get('/api/public/user/status')
      .then(res => {
        if (res.data === "NO_USERNAME") {
          setContent(
            <>
              <title>F1 Tipping</title>
              <ErrorNoUsername />
            </>
          );
        } else if (res.data === "LOGGED_OUT") {
          setContent(
            <>
              <title>F1 Tipping</title>
              <ErrorNotLoggedIn />
            </>
          );
        } else {
          setContent(<Outlet />);
        }
      })
      .catch(err => {
        console.error(err);
        setContent(
          <>
            <title>F1 Tipping</title>
            <ErrorUnknown />
          </>
        );
      });
  }, [])
  return (
    <>
      {content ? content : ''}
    </>
  )
}


export default ProtectedRoute

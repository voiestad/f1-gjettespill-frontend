import axios from 'axios';
import { Outlet } from 'react-router';
import { useState, useEffect } from 'react';
import { ErrorNotAdmin, ErrorUnknown } from '../error';

function AdminRoute() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    axios.get('/api/public/header')
      .then(res => {
        if (!res.data.isAdmin) {
          setContent(
            <>
              <title>F1 Tipping</title>
              <ErrorNotAdmin />
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


export default AdminRoute

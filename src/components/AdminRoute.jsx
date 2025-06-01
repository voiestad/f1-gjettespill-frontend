import axios from 'axios';
import { Outlet, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { ErrorNotAdmin, ErrorUnknown } from '../error';

function AdminRoute() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    axios.get('/api/public/header')
      .then(res => {
        if (!res.data.isAdmin) {
          setContent(<ErrorNotAdmin />);
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


export default AdminRoute

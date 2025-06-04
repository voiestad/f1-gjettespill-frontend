import axios from 'axios';
import { Outlet } from 'react-router';
import { useState, useEffect } from 'react';
import { ErrorNotAdmin, ErrorUnknown } from '../error';

function BingomasterRoute() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    axios.get('/api/bingomaster')
      .then(res => {
        if (!res.data) {
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


export default BingomasterRoute

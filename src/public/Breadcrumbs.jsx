import { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation, Link } from 'react-router'

function Breadcrumbs() {
  const [breadcrumbs, setBreadcrumbs] = useState(null);
  const { pathname } = useLocation();
  useEffect(() => {
    axios.get(`/api/public/breadcrumbs?path=${pathname}`)
      .then(res => setBreadcrumbs(res.data))
      .catch(err => console.error(err));
  }, [pathname]);

  return (
    <>
      <div style={{ margin: 0 }}>
        <ol className="breadcrumb">
          {breadcrumbs ?
            breadcrumbs.map((crumb) => (
              <li key={crumb.text}>
                {crumb.path ? <Link to={crumb.path}>{crumb.text}</Link> : <div>{crumb.text}</div>}
              </li>
            )) : <li><div>Hjem</div></li>
          }
        </ol>
      </div>
    </>
  )
}

export default Breadcrumbs

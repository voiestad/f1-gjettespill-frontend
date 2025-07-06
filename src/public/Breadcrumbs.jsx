import { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation, Link } from 'react-router'

function Breadcrumbs() {
  const [breadcrumbs, setBreadcrumbs] = useState(null);
  const { pathname } = useLocation();
  useEffect(() => {
    getBreadcrumbs(pathname)
      .then(res => setBreadcrumbs(res))
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

async function getBreadcrumbs(path) {
  const breadcrumbs = [];
  if (path === "/") {
    breadcrumbs.push({path: null, text: "Hjem"})
    return breadcrumbs;
  }
  const subPaths = getSubPaths(path);
  subPaths.pop();
  breadcrumbs.push({path: "/", text: "Hjem"})
  for (const subPath of subPaths) {
    breadcrumbs.push({path: subPath, text: getNameForPath(subPath)});
  }
  breadcrumbs.push({path: null, text: getNameForPath(path)});
  return breadcrumbs;
}

function getSubPaths(path) {
  const result = [];
  let currentPath = "";
  const segments = path.split("/");
  for (const segment of segments) {
    if (!segment) {
      continue;
    }
    currentPath += `/${segment}`;
    result.push(currentPath);
  }

  return result;
}

function getNameForPath(path) {
  return path;
}

export default Breadcrumbs

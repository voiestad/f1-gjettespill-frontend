import { useState, useEffect } from 'react'
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
    breadcrumbs.push({ path: null, text: "Hjem" })
    return breadcrumbs;
  }
  const subPaths = getSubPaths(path);
  subPaths.pop();
  breadcrumbs.push({ path: "/", text: "Hjem" })
  for (const subPath of subPaths) {
    breadcrumbs.push({ path: subPath, text: getNameForPath(subPath) });
  }
  breadcrumbs.push({ path: null, text: getNameForPath(path) });
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
  const segments = path.split("/").values();
  segments.next(); // First is always blank
  const segment = segments.next();
  switch (segment.value) {
    case "admin": return getAdminPath(segments);
    case "user": return getUserPath(segments);
    case "race-guess": return "Gjettet på løp";
    case "score": return "Poengberegning";
    case "contact": return "Kontakt";
    case "about": return "Om siden";
    case "guess": return getGuessPath(segments);
    case "error": return "Feil";
    case "settings": return getSettingsPath(segments);
    case "username": return "Velg brukernavn";
    case "privacy": return "Personvernerklæring";
    case "stats": return getStatsPath(segments);
    case "bingo": return getBingoPath(segments);
    case "login": return "Innlogging";
    case "github": return "GitHub";
    default: return null;
  };
}

function getAdminPath(segments) {
  const segment = segments.next();
  if (segment.done) {
    return "Admin portal";
  }
  switch (segment.value) {
    case "flag": return getFlagPath(segments);
    case "season": return getSeasonPath(segments);
    case "bingo": return "Bingo";
    case "log": return getLogPath(segments);
    case "backup": return "Sikkerhetskopi";
    default: return null;
  };
}

function getFlagPath(segments) {
  const segment = segments.next();
  if (segment.done) {
    return "Flagg";
  }
  const nextSegment = segments.next();
  if (nextSegment.done) {
    return segment.value;
  }
  return getRaceName(nextSegment.value);
}

function getLogPath(segments) {
  const segment = segments.next();
  if (segment.done) {
    return "Logg";
  }
  const nextSegment = segments.next();
  if (nextSegment.done) {
    const type = segment.value;
    if (type.length > 1) {
      return type.substring(0, 1).toUpperCase() + type.substring(1);
    }
    return type;
  }
  return nextSegment.value;
}

function getSeasonPath(segments) {
  const segment = segments.next();
  if (segment.done) {
    return "Sesong";
  }
	const nextSegment = segments.next();
  if (nextSegment.done) {
    const year = segment.value;
    if (year === "add") {
      return "Legg til";
    }
    return year;
  }
  switch (nextSegment.value) {
    case "competitors": return getCompetitorsPath(segments);
    case "points": return "Poengsystem";
    case "results": return "Resultater";
    case "cutoff": return "Frister";
    case "manage": return getManagePath(segments);
    default: return null;
  };
}

function getCompetitorsPath(segments) {
  const segment = segments.next();
  if (segment.done) {
    return "Deltakere";
  }
  switch (segment.value) {
    case "constructors": return "Konstruktører";
    case "drivers": return "Sjåfører";
    default: return null;
  };
}

function getManagePath(segments) {
  const segment = segments.next();
  if (segment.done) {
    return "Administrer";
  }
  return getRaceName(segments.next().value);
}

function getUserPath(segments) {
  const segment = segments.next();
  if (segment.done) {
    return "Brukere";
  }

	const userProfile = segment.value;
  if (userProfile === "myprofile") {
    return "Min profil";
  }
  if (userProfile === "compare") {
    return "Sammenlign";
  }
  return "Brukerprofil"; // TODO: Name of person
}

function getGuessPath(segments) {
  const segment = segments.next();
  if (segment.done) {
    return "Gjett";
  }
  switch (segment.value) {
    case "driver": return "Sjåførmesterskap";
    case "constructor": return "Konstruktørmesterskap";
    case "tenth": return "10.plass";
    case "first": return "1.plass";
    case "flag": return "Antall";
    default: return null;
  };
}

function getSettingsPath(segments) {
  const segment = segments.next();
  if (segment.done) {
    return "Innstillinger";
  }
  switch (segment.value) {
    case "info": return "Brukerinformasjon";
    case "username": return "Endre brukernavn";
    case "delete": return "Slett bruker";
    case "reminders": return "Påminnelser";
    case "referral": return "Inviter brukere";
    default: return null;
  };
}

function getStatsPath(segments) {
  const segment = segments.next();
  if (segment.done) {
    return "Statistikk";
  }
  const nextSegment = segments.next();
  if (nextSegment.done) {
    return segment.value;
  }
  return getRaceName(nextSegment.value);
}

function getRaceName(id) {
  return "Løp"; // TODO: Race name
}

function getBingoPath(segments) {
  const segment = segments.next();
  if (segment.done) {
    return "Bingo";
  }
  const nextSegment = segments.next();
  if (nextSegment.done) {
    return "Administrer bingo";
  }
	return nextSegment.value;
}

export default Breadcrumbs

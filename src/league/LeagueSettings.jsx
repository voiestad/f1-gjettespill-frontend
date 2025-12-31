import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { CsrfTokenContext } from '../components';
import { ErrorNotMember, ErrorUnknown } from '../error';

function LeagueSettings() {
  const [membership, setMembership] = useState(null);
  const [error, setError] = useState(null);
  const { leagueId } = useParams();
  const [leagueName, setLeagueName] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { token, headerName } = useContext(CsrfTokenContext);

  function validateLeagueName(e) {
    let value = e.target.value;
    let result = "";
    for (const c of value) {
      if (result.length == 50) {
        break;
      }
      if (c.match("^[a-zA-ZÆØÅæøå0-9 ]$")) {
        result += c;
      }
    }
    setLeagueName(result);
  }

  function createLeague(e) {
    e.preventDefault();
    if (!leagueName) {
      return;
    }
    axios.post("/api/league/rename", {}, {
      params: {
        leagueName: leagueName,
        leagueId: leagueId,
      },
      headers: {
        [headerName]: token
      }
    }).then(res => {
      setLeagueName("");
      setMessage("Nytt navn ble satt!");
    }).catch(err => {
      console.error(err)
      setMessage(err.response.data);
    })
  }

  useEffect(() => {
    axios.get(`/api/public/league/membership/${leagueId}`)
      .then(res => setMembership(res.data))
      .catch(err => {
        console.error(err);
        if (err.status === 404 || err.status === 400) {
          setError(<ErrorNotFound />);
        } else {
          setError(<ErrorUnknown />);
        }
      })
  }, []);

  function leaveLeague() {
    if (!confirm('Er du sikker på at du vil forlate ligaen?')) {
      return;
    }
    axios.post('/api/league/leave', {}, {
      params: {
        leagueId: leagueId,
      },
      headers: {
        [headerName]: token
      }
    })
      .then(res => navigate("/"))
      .catch(err => {
        console.error(err);
        alert("Noe gikk galt");
      });
  }

  function deleteLeague() {
    if (!confirm('Er du sikker på at du vil slette ligaen?')) {
      return;
    }
    axios.delete('/api/league/delete', {
      params: {
        leagueId: leagueId,
      },
      headers: {
        [headerName]: token
      }
    })
      .then(res => navigate("/"))
      .catch(err => {
        console.error(err);
        alert("Noe gikk galt");
      });
  }

  return (
    <>
      <title>Ligainstillinger</title>
      {membership ?
        (membership !== "NOT_MEMBER" ?
          <>
            <h2>Ligainstillinger</h2>
            <input type="submit" onClick={leaveLeague} value="Forlat liga" />
            {membership === "OWNER" ?
              <>
                <input type="submit" onClick={deleteLeague} value="Slett liga" />

                <form>
                  <input type="text" placeholder="Liganavn" onChange={validateLeagueName} value={leagueName} /><br />
                  <input type="submit" value="Endre liganavn" onClick={createLeague} />
                </form>
                {message ? <p>{message}</p> : ''}
              </> : ''}
          </> :
          <>
            <ErrorNotMember />
          </>) : ''}

      {error ? error : ''}
    </>
  )
}

export default LeagueSettings

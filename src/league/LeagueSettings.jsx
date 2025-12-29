import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { CsrfTokenContext } from '../components';
import { ErrorNotMember, ErrorUnknown } from '../error';
import Table from '../util/Table';

function LeagueSettings() {
  const [membership, setMembership] = useState(null);
  const [error, setError] = useState(null);
  const { leagueId } = useParams();
  const navigate = useNavigate();
  const { token, headerName } = useContext(CsrfTokenContext);

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

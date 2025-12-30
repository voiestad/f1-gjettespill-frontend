import axios from 'axios';
import { useState, useEffect, lazy } from 'react';
import { useParams, Link } from 'react-router';
import { ErrorNotFound, ErrorUnknown } from '../error';
import Leaderboard from '../public/Leaderboard';
const HomePageGraph = lazy(() => import('../public/HomePageGraph'));

function LeaguePage() {
  const { leagueId } = useParams();
  const [league, setLeague] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContent();
    const interval = setInterval(() => {
      loadContent();
    }, 20 * 1000);
    return () => clearInterval(interval);
  }, []);

  function loadContent() {
    axios.get(`/api/public/league/${leagueId}`)
      .then(res => setLeague(res.data))
      .catch(err => {
        console.error(err);
        if (err.status === 404 || err.status === 400) {
          setError(<ErrorNotFound />);
        } else {
          setError(<ErrorUnknown />);
        }
      });
  }

  return (
    <>
      {league ?
        <>
          <title>{league.league.leagueName}</title>
          <h2>{league.league.leagueName}</h2>
          {!league.leaderboard ?
            <>
              <h3>Medlemmer:</h3>
              <div className="userListWrapper">
                <ul className="userList">
                  {league.members.map(member => <li key={member.id}>{member.username}</li>)}
                </ul>
              </div>
            </>
            : ''}
          {league.leaderboard ?
            <div className="tables">
              <Leaderboard leaderboard={league.leaderboard} />
            </div>
            : ''}
          {league.graph ? <HomePageGraph graph={league.graph} /> : ''}
          {league.membershipStatus !== "NOT_MEMBER" ? <Link to={`/league/${leagueId}/settings`}>Innstillinger</Link> : ''}
        </> : <title>Ligaside</title>}

      {error ? error : ''}
    </>
  )
}

export default LeaguePage

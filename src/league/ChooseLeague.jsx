import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';

function ChooseLeague() {
  const [year, setYear] = useState(null);
  const [years, setYears] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [onlyMemberships, setOnlyMemberships] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    axios.get('/api/public/user/status')
      .then(res => {
        setIsLoggedIn(res.data === "LOGGED_IN");
      })
      .catch(err => {
        console.error(err);
      });
    axios.get('/api/public/year/list')
      .then(res => {
        setYears(res.data);
        if (res.data.length) {
          setYear(res.data[0]);
        }
      })
      .catch(err => {
        console.error(err);
      });
    axios.get(`/api/public/leagues`)
      .then(res => setLeagues(res.data))
      .catch(err => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (!year) {
      return;
    }
    if (onlyMemberships) {
      axios.get(`/api/public/league/memberships?year=${year}`)
        .then(res => setLeagues(res.data))
        .catch(err => {
          console.error(err);
        });
    } else {
      axios.get(`/api/public/leagues?year=${year}`)
        .then(res => setLeagues(res.data))
        .catch(err => {
          console.error(err);
        });
    }
  }, [year, onlyMemberships])

  return (
    <>
      <title>Velg liga</title>
      <h2>Velg liga</h2>
      {isLoggedIn ?
        <>
          <Link to="/league/add">Lag en liga</Link><br /><br />
          <Link to="/league/invitations">Invitasjoner</Link><br /><br />
        </> : ''}
      <label>
        Velg år<br />
        <select onChange={e => setYear(e.target.value)}>
          {years.map((year) =>
            <option key={year} value={year}>{year}</option>
          )}
        </select>
      </label>
      {isLoggedIn ?
        <>
          <br /><br />
          <label>
            Kun egne ligaer<br />
            <input type="checkbox" onChange={() => setOnlyMemberships((onlyMemberships) => !onlyMemberships)} />
          </label>
        </> : ''}
      <div className="linkList">
        {leagues.map((league) =>
          <Link key={league.leagueId} to={`/league/${league.leagueId}`}>{league.leagueName}</Link>
        )}
      </div>
    </>
  )
}

export default ChooseLeague

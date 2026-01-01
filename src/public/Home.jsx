import axios from 'axios';
import { useState, useEffect, lazy } from 'react';
import { Link } from 'react-router';
import Leaderboard from './Leaderboard';
const HomePageGraph = lazy(() => import('./HomePageGraph'));

function Home() {
  const [message, setMessage] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [graph, setGraph] = useState(null);
  const [guessers, setGuessers] = useState(null);
  const [year, setYear] = useState(null);
  const [years, setYears] = useState([]);

  useEffect(() => {
    axios.get('/api/public/year/list')
      .then(res => setYears(res.data))
      .catch(err => console.error(err))
  }, []);

  useEffect(() => {
    loadContent();
    const interval = setInterval(() => {
      loadContent();
    }, 20 * 1000);
    return () => clearInterval(interval);
  }, [year])

  function loadContent() {
    axios.get(`/api/public/home${year ? `?year=${year}` : ''}`)
      .then(res => {
        if (!year) {
          setYear(res.data.year);
        }
        if (res.data.leaderboard === null) {
          setGuessers(res.data.guessers);
          let cutoff = null;
          if (res.data.cutoff) {
            const date = new Date(res.data.cutoff);

            cutoff = new Intl.DateTimeFormat("nb-NO", {
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            }).format(date);
          }
          setMessage(<>Sesongen starter snart.{cutoff ? <><br />Det er mulig å gjette frem til {cutoff}.</> : ''}</>);
          setLeaderboard(null);
          setGraph(null);
          return;
        }
        setMessage(null);
        setGuessers(null);
        setLeaderboard(res.data.leaderboard);
        setGraph(res.data.graph.length ? res.data.graph : null);
      })
      .catch(err => console.error(err));
  }

  return (
    <>
      <title>F1 Gjettespill</title>
      <h2>Velkommen til F1 Gjettespill!</h2>
      {message ?
        <p>{message}</p>
        : ''}
      {guessers ?
        <>
          <h3>Årets deltakere:</h3>
          <div className="userListWrapper">
            <ul className="userList">
              {guessers.map(guesser => <li key={guesser.id}><Link to={`/user/${guesser.id}`}>{guesser.username}</Link></li>)}
            </ul>
          </div>
        </>
        : ''}
      {leaderboard ?
        <div className="tables">
          <Leaderboard leaderboard={leaderboard} />
        </div>
        : ''}
      {graph ? <HomePageGraph graph={graph} /> : ''}
      {year ? <label>
        Velg år: <select onChange={(e) => setYear(e.target.value)} defaultValue={year}>
          {years.map((year) => <option key={year} value={year}>{year}</option>)}
        </select>
      </label> : ''}
    </>
  )
}

export default Home

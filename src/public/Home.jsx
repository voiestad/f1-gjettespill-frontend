import axios from 'axios';
import { useState, useEffect, lazy } from 'react';
import Leaderboard from './Leaderboard';
const HomePageGraph = lazy(() => import('./HomePageGraph'));

function Home() {
  const [message, setMessage] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [graph, setGraph] = useState(null);
  const [guessers, setGuessers] = useState(null);

  useEffect(() => {
    loadContent();
    const interval = setInterval(() => {
      loadContent();
    }, 20 * 1000);
    return () => clearInterval(interval);
  }, []);

  function loadContent() {
    axios.get('/api/public/home')
      .then(res => {
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
          return;
        }
        setMessage(null);
        setLeaderboard(res.data.leaderboard);
        setGraph(res.data.graph);
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
              {guessers.map(guesser => <li key={guesser.id}>{guesser.username}</li>)}
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
    </>
  )
}

export default Home

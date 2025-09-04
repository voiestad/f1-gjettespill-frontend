import axios from 'axios';
import { useState, useEffect, lazy } from 'react';
import { Link } from 'react-router';
import Table from '../util/Table';
const HomePageGraph = lazy(() => import('./HomePageGraph'));

function Leaderboard(props) {
  const header = ["Plass", "Navn", "Poeng"];
  const body = props.leaderboard.map((row) => ({
    key: row.guesser.id,
    values: [row.rank,
    <Link to={`/user/${row.guesser.id}`}>{row.guesser.username}</Link>,
    row.guesser.points]
  }));
  return <Table title="Rangering" header={header} body={body} />;
}

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
          setMessage("Sesongen starter snart");
          return;
        }
        setLeaderboard(res.data.leaderboard);
        setGuessers(res.data.guessers);
        const graphData = res.data.graph;
        const xValues = graphData[0].scores.map((_, i) => i);
        const userScores = [];
        const colors = ["#f7d000", "purple", "red", "green", "blue", "orange"];
        for (let i = 0; i < graphData.length; i++) {
          userScores.push({
            data: graphData[i].scores,
            borderColor: colors[i % colors.length],
            backgroundColor: colors[i % colors.length],
            fill: false,
            label: graphData[i].name
          });
        }
        const data = {
          labels: xValues,
          datasets: userScores
        };
        setGraph(data);
      })
      .catch(err => console.error(err));
  }

  return (
    <>
      <title>F1 Gjettespill</title>
      <h2>Velkommen til F1 Gjettespill!</h2>
      {message ?
        <h3>{message}</h3>
        : ''}
      {guessers ?
        <>
          <h3>Årets deltakere:</h3>
          <ul>
            {guessers.map(guesser => <li>{guesser}</li>)}
          </ul>
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

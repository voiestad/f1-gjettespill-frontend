import axios from 'axios';
import { useState, useEffect } from 'react';

function Leaderboard(props) {
  const leaderboard = props.leaderboard;
  return (
    <>
      <h3>Rangering</h3>
      <table>
        <thead>
          <tr>
            <th>Plass</th>
            <th>Navn</th>
            <th>Poeng</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((row) => (
            <tr key={row.guesser.id}>
              <td>{row.rank}</td>
              <td><a href={`/user/${row.guesser.id}`}>{row.guesser.username}</a></td>
              <td>{row.guesser.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function Home() {
  const [leaderboard, setLeaderboard] = useState(null);
  const [graph, setGraph] = useState(null);
  useEffect(() => {
    axios.get('/api/public/home')
      .then(res => {
        console.log(JSON.stringify(res.data));
        setLeaderboard(res.data.leaderboard);
      })
      .catch(err => console.error(err));
  }, []);
  return (
    <>
      <h2>F1 Tipping hjemskjerm!</h2>
      {leaderboard ?
        <div className="tables">
          <Leaderboard leaderboard={leaderboard} />
        </div>
        : ''}
    </>
  )
}

export default Home

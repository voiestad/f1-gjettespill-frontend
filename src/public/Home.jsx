import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Table from '../util/Table';

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
  const [leaderboard, setLeaderboard] = useState(null);
  const [graph, setGraph] = useState(null);
  useEffect(() => {
    axios.get('/api/public/home')
      .then(res => {
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

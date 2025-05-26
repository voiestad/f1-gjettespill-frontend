import axios from 'axios';
import { useState, useEffect } from 'react';
import Table from './Table';

function Home() {
  const [leaderboard, setLeaderboard] = useState(null);
  const [graph, setGraph] = useState(null);
  useEffect(() => {
    axios.get('/api/public/home')
      .then(res => {
        setLeaderboard(res.data.leaderboard)
      }
    )
      .catch(err => console.error(err));
  }, []);
  return (
    <>
      <h2>F1 Tipping hjemskjerm!</h2>
      {leaderboard ? 
      <div className="tables">
        <Table table={leaderboard}/>
      </div>
       : ''}
    </>
  )
}

export default Home

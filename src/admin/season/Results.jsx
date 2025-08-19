import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';


function Results() {
  const { year } = useParams();
  const [finished, setFinished] = useState(null);

  function checkSeasonStatus() {
    axios.get(`/api/admin/season/results/is-finished/${year}`)
      .then(res => setFinished(res.data))
      .catch(err => console.error(err));
  }

  function endSeason() {
    if (!confirm('Er du sikker på at du vil avslutte sesongen?')) {
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/results/finalize', {}, {
          params: { year: year },
          headers: {
            [headerName]: token
          }
        })
          .then(res => checkSeasonStatus())
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));

  }

  useEffect(() => {
    checkSeasonStatus();
  }, []);
  return (
    <>
      <title>{`Resultater ${year}`}</title>
      <h2>{`Resultater ${year}`}</h2>
      {finished != null ?
        !finished ?
          <button onClick={endSeason}>Avslutt sesong</button>
          : <p>Sesongen er avsluttet</p>
        : ''
      }

    </>
  )
}

export default Results

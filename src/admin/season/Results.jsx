import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { CsrfTokenContext } from '../../components';

function Results() {
  const { year } = useParams();
  const [finished, setFinished] = useState(null);
  const { token, headerName } = useContext(CsrfTokenContext);

  function checkSeasonStatus() {
    axios.get(`/api/admin/season/results/is-finished/${year}`)
      .then(res => setFinished(res.data))
      .catch(err => console.error(err));
  }

  function endSeason() {
    if (!confirm('Er du sikker på at du vil avslutte sesongen?')) {
      return;
    }
    axios.post('/api/admin/season/results/finalize', {}, {
      params: { year: year },
      headers: {
        [headerName]: token
      }
    })
      .then(res => checkSeasonStatus())
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

import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { ErrorUnknown } from '../error';


function StatsChooseYear() {
  const [years, setYears] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/public/year/list')
      .then(res => setYears(res.data))
      .catch(err => {
        console.error(err);
        setError(<ErrorUnknown />);
      });
  }, []);
  return (
    <>
      <title>Statistikk - Velg år</title>
      {years ?
        <>
          <h2>Velg år</h2>
          <div className="linkList">
            {years.map((year) =>
              <Link key={year} to={`/stats/${year}`}>{year}</Link>
            )}
          </div>
        </>
        : ''}
      {error ? error : ''}
    </>
  )
}

export default StatsChooseYear

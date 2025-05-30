import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import axios from 'axios';
import { ErrorUnknown } from '../error';

function StatsChooseRace() {
  const { year } = useParams();
  const [races, setYears] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/public/race/list/${year}`)
      .then(res => setYears(res.data))
      .catch(err => {
        console.error(err);
        setError(<ErrorUnknown />);
      });
  }, []);
  return (
    <>
      {races ?
        <>
          <h2>Velg løp</h2>
          <div className="linkList">
            {races.map((race) =>
              <Link key={race.id} to={`/stats/${race.year}/${race.id}`}>
                {race.position}. {race.name}
                </Link>
            )}
          </div>
        </>
        : ''}
      {error ? error : ''}
    </>
  )
}

export default StatsChooseRace

import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { ErrorUnknown } from '../error';
import { translateFlag, translateSession } from '../util/translator';

function StartingGridTable(props) {
  const { grid } = props
  return (
    <>
      <h3>Startoppstilling</h3>
      <table>
        <thead>
          <tr>
            <th>Plass</th>
            <th>Sjåfør</th>
          </tr>
        </thead>
        <tbody>
          {grid.map((row) =>
            <tr key={row.name}>
              <td>{row.position}</td>
              <td>{row.name}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

function ResultsTable(props) {
  const { title, competitorName, results } = props;
  return (
    <>
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Plass</th>
            <th>{competitorName}</th>
            <th>Poeng</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row) =>
            <tr key={row.name}>
              <td>{row.position}</td>
              <td>{row.name}</td>
              <td>{row.points}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

function FlagTable(props) {
  const { flags } = props;
  return (
    <>
      <h3>Flagg</h3>
      <table>
        <thead>
          <tr>
            <th>Økt</th>
            <th>Runde</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {flags
            .sort((a, b) => {
              if (a.round === b.round) {
                return translateFlag(a.type).localeCompare(translateFlag(b.type))
              }
              return a.round - b.round;

            })
            .map((row) =>
              <tr key={row.id}>
                <td>{translateSession(row.sessionType)}</td>
                <td>{row.round}</td>
                <td>{translateFlag(row.type)}</td>
              </tr>
            )}
        </tbody>
      </table>
    </>
  )
}

function StatsRace() {
  const [stats, setStats] = useState(null);
  const { raceId } = useParams();
  const [error, setError] = useState(null);
  useEffect(() => {
    axios.get(`/api/public/stats/race/${raceId}`)
      .then(res => setStats(res.data))
      .catch(err => {
        console.error(err);
        setError(<ErrorUnknown />);
      });
  }, []);
  return (
    <>
      {stats ?
        <>
          <h2>{stats.name}</h2>
          <div className="tables">
            <StartingGridTable grid={stats.startingGrid} />
            <ResultsTable title="Result av løp" competitorName="Sjåfør" results={stats.raceResult} />
            <ResultsTable title="Sjåførmesterskap" competitorName="Sjåfør" results={stats.driverStandings} />
            <ResultsTable title="Konstruktørmesterskap" competitorName="Konstruktør" results={stats.constructorStandings} />
            <FlagTable flags={stats.flags} />
          </div>
        </>
        : ''}
      {error ? error : ''}
    </>
  )
}

export default StatsRace

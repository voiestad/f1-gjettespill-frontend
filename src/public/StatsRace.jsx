import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { ErrorUnknown } from '../error';
import { translateFlag, translateSession } from '../util/translator';
import Table from '../util/Table';

function StartingGridTable(props) {
  const { grid } = props;
  const header = ["Plass", "Sjåfør"];
  const body = grid.map((row) => ({
    key: row.name,
    values: [row.position, row.name]
  }));
  return <Table title="Startoppstilling" header={header} body={body} />;
}

function ResultsTable(props) {
  const { title, competitorName, results } = props;
  const header = ["Plass", competitorName, "Poeng"];
  const body = results.map((row) => ({
    key: row.name,
    values: [row.position, row.name, row.points]
  }));
  return <Table title={title} header={header} body={body} />;
}

function FlagTable(props) {
  const { flags } = props;
  const header = ["Økt", "Runde", "Type"];
  const body = flags.sort((a, b) => {
    if (a.round === b.round) {
      return translateFlag(a.type).localeCompare(translateFlag(b.type))
    }
    return a.round - b.round;
  }).map((row) => ({
    key: row.id,
    values: [translateSession(row.sessionType), row.round, translateFlag(row.type)]
  }));
  return <Table title="Flagg" header={header} body={body} />;
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

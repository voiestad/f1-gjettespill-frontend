import { translateFlag } from '../util/translator';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Table from '../util/Table';

function SummaryTable(props) {
  const summary = props.summary
  const header = ["Kategori", "Poeng"];
  const body = [
    {
      key: "drivers",
      values: ["Sjåfører", summary.drivers]
    },
    {
      key: "constructors",
      values: ["Konstruktører", summary.constructors]
    },
    {
      key: "flag",
      values: ["Antall", summary.flag]
    },
    {
      key: "winner",
      values: ["1.plass", summary.winner]
    },
    {
      key: "tenth",
      values: ["10.plass", summary.tenth]
    },
    {
      key: "total",
      values: ["Totalt", summary.total]
    },
  ];
  return <Table title="Oppsummering" header={header} body={body} />;
}

function ChampionshipTable(props) {
  const { title, guesses, compName } = props;
  const header = ["Plass", compName, "Gjettet", "Diff", "Poeng"];
  const body = guesses.map(row => ({
    key: row.competitor,
    values: [row.pos,
    row.competitor,
    row.guessed !== null ? row.guessed : 'N/A',
    row.diff !== null ? row.diff : 'N/A',
    row.points]
  }));
  return <Table title={title} header={header} body={body} />;
}

function FlagTable(props) {
  const header = ["Type", "Gjettet", "Faktisk", "Diff", "Poeng"];
  const body = props.flagGuesses
    .sort((a, b) => translateFlag(a.flag).localeCompare(translateFlag(b.flag)))
    .map(row => ({
      key: row.flag,
      values: [translateFlag(row.flag),
      row.guessed,
      row.actual,
      row.diff,
      row.points]
    }));
  return <Table title="Antall" header={header} body={body} />;
}

function DriverPlaceTable(props) {
  const { title, placeGuesses } = props;
const header = ["Løp", "Gjettet", "Startet", "Plass", "Poeng"];
  const body = placeGuesses.map(row => ({
      key: row.raceName,
      values: [row.raceName,
      row.driver,
      row.startPos,
      row.finishPos,
      row.points]
    }));
  return <Table title={title} header={header} body={body} />;
}

function ProfilePage(props) {
  const { user, year: y, raceId, racePos, driversGuesses, constructorsGuesses, flagGuesses, winnerGuesses, tenthGuesses, summary } = props.userData
  const { setRaceId } = props
  const [races, setRaces] = useState(null);
  const [years, setYears] = useState(null);
  function changeYear(year) {
    axios.get(`/api/public/race/list/${year}`, {
      params: {
        completedOnly: true
      }
    })
      .then(res => setRaces(res.data))
      .catch(err => console.error(err));
  }
  useEffect(() => {
    changeYear(y);
    axios.get('/api/public/year/list')
      .then(res => setYears(res.data))
      .catch(err => console.error(err));
  }, []);
  return (
    <>
      <h2>{user.username} {y}</h2>
      <form>
        <label>Velg år:
          <br />
          {years ?
            <select defaultValue={y} onChange={(e) => changeYear(e.target.value)}>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
            : ''}
        </label>
        <br /><br />
        <label>Velg løp:
          <br />
          {races ?
            <select defaultValue={raceId} onChange={(e) => setRaceId(e.target.value)}>
              {races.map((race) =>
                <option key={race.id} value={race.id}>{race.position}. {race.name}</option>
              )}
            </select>
            : ''}
        </label>
      </form>
      <div className="tables">
        <SummaryTable summary={summary} />
        <ChampionshipTable title="Sjåfører" compName="Sjåfør" guesses={driversGuesses} />
        <ChampionshipTable title="Konstruktører" compName="Konstruktør" guesses={constructorsGuesses} />
        <FlagTable flagGuesses={flagGuesses} />
        <DriverPlaceTable title="1.plass" placeGuesses={winnerGuesses} />
        <DriverPlaceTable title="10.plass" placeGuesses={tenthGuesses} />
      </div>
    </>
  )
}

export default ProfilePage

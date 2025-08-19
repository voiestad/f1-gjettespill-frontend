import { translateFlag } from '../util/translator';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Table from '../util/Table';

function SummaryTable(props) {
  const summary = props.summary
  const header = ["Kategori", "Plassering", "Poeng"];
  const body = [
    {
      key: "drivers",
      values: [<a href="#drivers">Sjåfører</a>, summary?.drivers.pos, summary?.drivers.value]
    },
    {
      key: "constructors",
      values: [<a href="#constructors">Konstruktører</a>, summary?.constructors.pos, summary?.constructors.value]
    },
    {
      key: "flag",
      values: [<a href="#flag">Antall</a>, summary?.flag.pos, summary?.flag.value]
    },
    {
      key: "winner",
      values: [<a href="#winner">1.plass</a>, summary?.winner.pos, summary?.winner.value]
    },
    {
      key: "tenth",
      values: [<a href="#tenth">10.plass</a>, summary?.tenth.pos, summary?.tenth.value]
    },
    {
      key: "total",
      values: ["Totalt", summary?.total.pos, summary?.total.value]
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
    row.guessed,
    row.diff,
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
    values: [`${row.racePos}. ${row.raceName}`,
    row.driver,
    row.startPos,
    row.finishPos,
    row.points]
  }));
  return <Table title={title} header={header} body={body} />;
}

function UserStats(props) {
  const { userScores, summary } = props.userData;
  const { user, year: y, raceId, racePos, driversGuesses, constructorsGuesses, flagGuesses, winnerGuesses, tenthGuesses } = userScores;
  const { setRaceId } = props;
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
        <div id="drivers">
          <ChampionshipTable title="Sjåfører" compName="Sjåfør" guesses={driversGuesses} />
        </div>
        <div id="constructors">
          <ChampionshipTable title="Konstruktører" compName="Konstruktør" guesses={constructorsGuesses} />
        </div>
        <div id="flag">
          <FlagTable flagGuesses={flagGuesses} />
        </div>
        <div id="winner">
          <DriverPlaceTable title="1.plass" placeGuesses={winnerGuesses} />
        </div>
        <div id="tenth">
          <DriverPlaceTable title="10.plass" placeGuesses={tenthGuesses} />
        </div>
      </div>
    </>
  )
}

export default UserStats

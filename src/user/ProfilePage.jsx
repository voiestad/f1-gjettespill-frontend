import { translateFlag } from '../util/translator';

function SummaryTable(props) {
  const summary = props.summary
  return (
    <>
      <h3>Oppsummering</h3>
      <table>
        <thead>
          <tr>
            <th>Kategori</th>
            <th>Poeng</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sjåfører</td>
            <td>{summary.drivers}</td>
          </tr>
          <tr>
            <td>Konstruktører</td>
            <td>{summary.constructors}</td>
          </tr>
          <tr>
            <td>Antall</td>
            <td>{summary.flag}</td>
          </tr>
          <tr>
            <td>1.plass</td>
            <td>{summary.winner}</td>
          </tr>
          <tr>
            <td>10.plass</td>
            <td>{summary.tenth}</td>
          </tr>
          <tr>
            <td>Totalt</td>
            <td>{summary.total}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function ChampionshipTable(props) {
  const { title, guesses } = props
  return (
    <>
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Plass</th>
            <th>Sjåfør</th>
            <th>Gjettet</th>
            <th>Diff</th>
            <th>Poeng</th>
          </tr>
        </thead>
        <tbody>
          {guesses.map((row) =>
            <tr key={row.competitor}>
              <td>{row.pos}</td>
              <td>{row.competitor}</td>
              <td>{row.guessed  !== null ? row.guessed : 'N/A'}</td>
              <td>{row.diff !== null ? row.diff : 'N/A'}</td>
              <td>{row.points}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

function FlagTable(props) {
  const flagGuesses = props.flagGuesses;
  return (
    <>
      <h3>Antall</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Gjettet</th>
            <th>Faktisk</th>
            <th>Diff</th>
            <th>Poeng</th>
          </tr>
        </thead>
        <tbody>
          {flagGuesses
            .sort((a, b) => translateFlag(a.flag).localeCompare(translateFlag(b.flag)))
            .map((row) =>
              <tr key={row.flag}>
                <td>{translateFlag(row.flag)}</td>
                <td>{row.guessed}</td>
                <td>{row.actual}</td>
                <td>{row.diff}</td>
                <td>{row.points}</td>
              </tr>
            )}
        </tbody>
      </table>
    </>
  );
}

function DriverPlaceTable(props) {
  const { title, placeGuesses } = props;
  
  return (
    <>
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Løp</th>
            <th>Gjettet</th>
            <th>Startet</th>
            <th>Plass</th>
            <th>Poeng</th>
          </tr>
        </thead>
        <tbody>
          {placeGuesses.map((row) =>
            <tr key={row.raceName}>
              <td>{row.raceName}</td>
              <td>{row.driver}</td>
              <td>{row.startPos}</td>
              <td>{row.finishPos}</td>
              <td>{row.points}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

function ProfilePage(props) {
  const { user, year, raceId, racePos, driversGuesses, constructorsGuesses, flagGuesses, winnerGuesses, tenthGuesses, summary } = props.userData
  return (
    <>
      <h2>{user.username} {year}</h2>
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

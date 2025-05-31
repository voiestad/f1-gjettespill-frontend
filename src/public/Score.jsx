import { useEffect, useState } from 'react';
import axios from 'axios';
import { ErrorUnknown } from '../error'
import Table from '../util/Table';

function DiffTable(props) {
  const { title, table } = props
  const header = ["Differanse", "Poeng"];
  const body = Object.keys(table).sort().map((diff) => ({
    key: diff,
    values: [diff, table[diff]]
  }));
  return <Table title={title} header={header} body={body} />;
}

function Score() {
  const [scoringTables, setScoringTables] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    axios.get('/api/public/score')
      .then(res => setScoringTables(res.data))
      .catch(err => {
        if (err.status === 403) {
          setError(<p>Poengberegningen for dette året er ikke tilgjenglig enda.</p>);
        } else {
          setError(<ErrorUnknown />);
          console.error(err);
        }
      })
  }, []);

  return (
    <>
      <h2>Poengberegning</h2>
      {scoringTables ?
        <div className="tables">
          <DiffTable title="Sjåfører" table={scoringTables.DRIVER} />
          <DiffTable title="Konstruktører" table={scoringTables.CONSTRUCTOR} />
          <DiffTable title="Antall" table={scoringTables.FLAG} />
          <DiffTable title="1.plass" table={scoringTables.FIRST} />
          <DiffTable title="10.plass" table={scoringTables.TENTH} />
        </div>
        :
        ''}
        {error ? error : ''}
    </>
  )
}

export default Score

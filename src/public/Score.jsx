import { useEffect, useState } from 'react';
import axios from 'axios';
import { ErrorUnknown } from '../error'
import Table from '../util/Table';
import { translateCategory } from '../util/translator';

export function DiffTable(props) {
  const { title, table } = props
  const header = ["Differanse", "Poeng"];
  const body = Object.keys(table).sort((a, b) => a - b).map((diff) => ({
    key: diff,
    values: [diff, table[diff]]
  }));
  return <Table title={title} header={header} body={body} />;
}

function Score() {
  const [scoringTables, setScoringTables] = useState(null);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(null);
  useEffect(() => {
    axios.get('/api/public/category/list')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
    axios.get('/api/public/score')
      .then(res => {
        setScoringTables(res.data)
      })
      .catch(err => {
        if (err.status === 404) {
          setError(<p>Poengberegningen for dette året er ikke tilgjenglig enda.</p>);
        } else {
          setError(<ErrorUnknown />);
          console.error(err);
        }
      })
  }, []);

  return (
    <>
      <title>Poengberegning</title>
      <h2>Poengberegning</h2>
      {scoringTables && categories ?
        <div className="tables">
          {categories.map(category =>
            <DiffTable key={category} title={translateCategory(category)} table={scoringTables[category]} />
          )}
        </div>
        :
        ''}
      {error ? error : ''}
    </>
  )
}

export default Score

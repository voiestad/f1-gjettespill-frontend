import { useEffect, useState } from 'react';
import axios from 'axios';
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
  const [categories, setCategories] = useState(null);
  const [years, setYears] = useState([]);

  function changeYear(year) {
    axios.get(`/api/public/score/${year}`)
      .then(res => {
        setScoringTables(res.data)
      })
      .catch(err => {
        setScoringTables(null)
      })
  }

  useEffect(() => {
    axios.get('/api/public/category/list')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
    axios.get('/api/public/year/list')
      .then(res => {
        setYears(res.data);
        if (res.data.length) {
          changeYear(res.data[0]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <title>Poengberegning</title>
      <h2>Poengberegning</h2>
      <label>Velg år:
        <br />
        <select onChange={(e) => changeYear(e.target.value)}>
          {years.map((year) => <option key={year} value={year}>{year}</option>)}
        </select>
      </label>
      <br />
      {scoringTables && categories ?
        <div className="tables">
          {categories.map(category =>
            <DiffTable key={category} title={translateCategory(category)} table={scoringTables[category]} />
          )}
        </div>
        :
        ''}
    </>
  )
}

export default Score

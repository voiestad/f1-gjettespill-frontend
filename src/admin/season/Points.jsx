import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { DiffTable } from '../../public/Score';
import { translateCategory } from '../../util/translator';

function SetDiffForm(props) {
  const { year } = useParams();
  const { categories, scoringTables, reload } = props;
  const [category, setCategory] = useState(null);
  const [diff, setDiff] = useState(0);
  const [maxDiff, setMaxDiff] = useState(0);
  const [points, setPoints] = useState(0);

  function updateCategory(event) {
    const category = event.target.value;
    setCategory(category);
    setDiff(0);
    if (!category) {
      setMaxDiff(0);
      return;
    }
    const maxDiffInCategory = Math.max(...Object.keys(scoringTables[category]).map(a => parseInt(a)));
    setMaxDiff(maxDiffInCategory);
  }

  function confirmDiff(event) {
    event.preventDefault();
    if (!category) {
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/points/set', {},
          {
            params: {
              year: year,
              category: category,
              diff: diff,
              points: points
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            reload();
          })
          .catch(err => {
            alert('Noe gikk galt');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }
  
  return (
    <form>
      <label>
        <select onChange={updateCategory}>
          <option value="">Velg kategori</option>
          {categories.map(category =>
            <option key={category} value={category}>{translateCategory(category)}</option>
          )}
        </select>
        <br /><br />
      </label>
      <label>Differanse<br />
        <input type="range" value={diff} onChange={e => setDiff(e.target.value)} min="0" max={maxDiff} />
        <br />{diff}<br /><br />
      </label>
      <label>Poeng<br />
        <input type="range" value={points} onChange={e => setPoints(e.target.value)} min="0" max="50" />
        <br />{points}<br /><br />
      </label>
      <input type="submit" value="Sett ny verdi" onClick={confirmDiff} />
    </form>
  )
}

function AddDiffForm(props) {
  const { year } = useParams();
  const { categories, reload } = props;
  const [category, setCategory] = useState(null);

  function addDiff(event) {
    event.preventDefault();
    if (!category) {
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/points/add', {},
          {
            params: {
              year: year,
              category: category,
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            reload();
          })
          .catch(err => {
            alert('Noe gikk galt');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }
  
  return (
    <form>
      <label>
        <select onChange={e => setCategory(e.target.value)}>
          <option value="">Velg kategori</option>
          {categories.map(category =>
            <option key={category} value={category}>{translateCategory(category)}</option>
          )}
        </select>
      </label>
      <input type="submit" value="Legg til" onClick={addDiff} />
    </form>
  )
}

function DeleteDiffForm(props) {
  const { year } = useParams();
  const { categories, reload } = props;
  const [category, setCategory] = useState(null);

  function deleteDiff(event) {
    event.preventDefault();
    if (!category) {
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/points/delete', {},
          {
            params: {
              year: year,
              category: category,
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            reload();
          })
          .catch(err => {
            alert('Noe gikk galt');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }
  
  return (
    <form>
      <label>
        <select onChange={e => setCategory(e.target.value)}>
          <option value="">Velg kategori</option>
          {categories.map(category =>
            <option key={category} value={category}>{translateCategory(category)}</option>
          )}
        </select>
      </label>
      <input type="submit" value="&#128465;" onClick={deleteDiff} />
    </form>
  )
}

function SeasonPoints() {
  const { year } = useParams();
  const [scoringTables, setScoringTables] = useState(null);
  const [categories, setCategories] = useState(null);

  function loadScoringTables() {
    axios.get(`/api/public/score/${year}`)
      .then(res => setScoringTables(res.data))
      .catch(err => console.error(err));
  }

  useEffect(() => {
    axios.get('/api/public/category/list')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
    loadScoringTables();
  }, []);

  return (
    <>
      <h2>Poengsystem {year}</h2>
      {scoringTables && categories ?
        <>
          <SetDiffForm scoringTables={scoringTables} categories={categories} reload={loadScoringTables} />
          <br />
          <AddDiffForm categories={categories} reload={loadScoringTables} />
          <br />
          <DeleteDiffForm categories={categories} reload={loadScoringTables} />
          <div className="tables">
            {categories.map(category =>
              <DiffTable key={category} title={translateCategory(category)} table={scoringTables[category]} />
            )}
          </div>
        </>
        :
        ''}
    </>
  )
}

export default SeasonPoints

import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { CsrfTokenContext } from '../../components';

function SeasonCutoff() {
  const { year } = useParams();
  const [yearCutoff, setYearCutoff] = useState(null);
  const [raceCutoffs, setRaceCutoffs] = useState(null);
  const { token, headerName } = useContext(CsrfTokenContext);

  function loadCutoffs() {
    axios.get(`/api/admin/season/cutoff/list/${year}`)
      .then(res => {
        setYearCutoff(res.data.cutoffYear);
        setRaceCutoffs(res.data.cutoffRaces);
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    loadCutoffs();
  }, []);

  function updateCutoffYear(event) {
    event.preventDefault();
    axios.post('/api/admin/season/cutoff/set/year', {},
      {
        params: {
          year: year,
          cutoff: new FormData(event.target).get('cutoff')
        },
        headers: {
          [headerName]: token
        }
      })
      .then(res => {
        const submitButton = event.target.getElementsByTagName('input')[1];
        submitButton.value = "Lagret!";
        setTimeout(() => submitButton.value = "Sett frist", 1000);
      })
      .catch(err => {
        alert('Kunne ikke lagre den nye fristen');
        console.error(err);
      })
  }

  function updateRaceCutoff(event, id) {
    event.preventDefault();
    axios.post('/api/admin/season/cutoff/set/race', {},
      {
        params: {
          id: id,
          cutoff: new FormData(event.target).get('cutoff')
        },
        headers: {
          [headerName]: token
        }
      })
      .then(res => {
        const submitButton = event.target.getElementsByTagName('input')[1];
        submitButton.value = "Lagret!";
        setTimeout(() => submitButton.value = "Sett frist", 1000);
      })
      .catch(err => {
        alert('Kunne ikke lagre den nye fristen');
        console.error(err);
      })
  }

  return (
    <>
      <title>{`Frister ${year}`}</title>
      <h2>{`Frister ${year}`}</h2>
      {yearCutoff ?
        <form onSubmit={updateCutoffYear}>
          <label>{year} sesongen<br />
            <input type="datetime-local" defaultValue={yearCutoff} name="cutoff" />
            <input type="submit" value="Sett frist" />
          </label>
          <br /><br />
        </form>
        : ''}
      {raceCutoffs ?
        raceCutoffs.map(cutoff =>
          <form key={cutoff.id} onSubmit={e => updateRaceCutoff(e, cutoff.id)}>
            <label>{cutoff.position} {cutoff.name} {cutoff.id}<br />
              <input type="datetime-local" defaultValue={cutoff.cutoff} name="cutoff" />
              <input type="submit" value="Sett frist" />
            </label>
            <br /><br />
          </form>
        )
        : ''}
    </>
  )
}

export default SeasonCutoff

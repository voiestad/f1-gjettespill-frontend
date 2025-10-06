import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import axios from 'axios';

function SeasonManageRaces() {
  const { year } = useParams();
  const [races, setRaces] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [newPos, setNewPos] = useState(null);
  const [newRaceId, setNewRaceId] = useState(null);
  const navigate = useNavigate();

  function loadRaces() {
    axios.get(`/api/public/race/list/${year}`)
      .then(res => setRaces(res.data))
      .catch(err => console.error(err));
  }

  function addRace(event) {
    event.preventDefault();
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/manage/add', {},
          {
            params: {
              year: year,
              id: newRaceId
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadRaces();
          })
          .catch(err => {
            alert('Kunne ikke legge til løp');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  function changePos(event) {
    event.preventDefault();
    if (!newPos) {
      alert('Du må velge en ny posisjon');
      return;
    }
    if (!selectedRace) {
      alert('Du må velge et løp');
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/manage/move', {},
          {
            params: {
              id: selectedRace,
              newPosition: newPos
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadRaces();
          })
          .catch(err => {
            alert('Kunne ikke flytte løp');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  function reloadRace(event) {
    event.preventDefault();
    if (!selectedRace) {
      alert('Du må velge et løp');
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/manage/reload', {},
          {
            params: {
              id: selectedRace
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            navigate(`/admin/season/${year}/manage/${selectedRace}`);
          })
          .catch(err => {
            alert('Kunne ikke laste inn løpet på nytt');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  function deleteRace(event) {
    event.preventDefault();
    if (!selectedRace) {
      alert('Du må velge et løp');
      return;
    }
    if (!confirm('Er du helt sikker på at du vil slette løpet?')) {
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/manage/delete', {},
          {
            params: {
              id: selectedRace
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadRaces();
          })
          .catch(err => {
            alert('Kunne ikke slette løp');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    loadRaces();
  }, []);
  return (
    <>
      <title>{`Løp ${year}`}</title>
      <h2>{`Løp ${year}`}</h2>
      <form>
        <input type="number" min="1" max="100" pattern="[0-9]*" inputMode="numeric"
          onChange={e => setNewPos(e.target.value)} placeholder="Ny plass" style={{ width: "75px" }} />
        <input type="submit" onClick={changePos} value="Endre plass" />
        <input type="submit" onClick={reloadRace} value="&#10227;" />
        <input type="submit" onClick={deleteRace} value="&#128465;" />
        <div className="tables">
          <table>
            <thead>
              <tr>
                <th style={{position: 'static'}}>#</th>
                <th style={{position: 'static'}}>Navn</th>
                <th style={{position: 'static'}}>ID</th>
                <th style={{position: 'static'}}>Velg</th>
              </tr>
            </thead>
            <tbody>
              {races ?
                races.map(race =>
                  <tr key={race.id}>
                    <td>{race.position}</td>
                    <td><Link to={`/admin/season/${year}/manage/${race.id}`}>{race.name}</Link></td>
                    <td>{race.id}</td>
                    <td><input type="radio" name="select" onClick={e => setSelectedRace(race.id)} /></td>
                  </tr>
                )
                : <></>}
            </tbody>
          </table>
        </div>
      </form>
      <form>
        <input type="number" min="1" max="10000" pattern="[0-9]*" inputMode="numeric"
          onChange={e => setNewRaceId(e.target.value)} placeholder="Race ID" />
        <input type="submit" value="Legg til løp" onClick={addRace} />
      </form>
    </>
  )
}

export default SeasonManageRaces

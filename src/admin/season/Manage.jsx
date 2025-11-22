import { useEffect, useState, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { CsrfTokenContext } from '../../components';
import Table from '../../util/Table';

export function SeasonManageRaces() {
  const { year } = useParams();
  const [races, setRaces] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [newPos, setNewPos] = useState(null);
  const [newRaceId, setNewRaceId] = useState(null);
  const navigate = useNavigate();
  const { token, headerName } = useContext(CsrfTokenContext);

  function loadRaces() {
    axios.get(`/api/public/race/list/${year}`)
      .then(res => setRaces(res.data))
      .catch(err => console.error(err));
  }

  function addRace(event) {
    event.preventDefault();
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
  }

  function reloadRace(event) {
    event.preventDefault();
    if (!selectedRace) {
      alert('Du må velge et løp');
      return;
    }
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
                <th style={{ position: 'static' }}>#</th>
                <th style={{ position: 'static' }}>Navn</th>
                <th style={{ position: 'static' }}>ID</th>
                <th style={{ position: 'static' }}>Velg</th>
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

export function ManageRace() {
  const { token, headerName } = useContext(CsrfTokenContext);
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [startingGrid, setStartingGrid] = useState([]);
  const [raceResult, setRaceResult] = useState([]);
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [name, setName] = useState("")
  const { raceId, year } = useParams();
  const [error, setError] = useState(null);
  useEffect(() => {
    axios.get(`/api/admin/season/competitors/drivers/list/${year}`)
      .then(res => setDrivers(res.data))
      .catch(err => {
        console.error(err);
        setError(<ErrorNotFound />);
      });
    axios.get(`/api/admin/season/competitors/constructors/list/${year}`)
      .then(res => setConstructors(res.data))
      .catch(err => {
        console.error(err);
        setError(<ErrorNotFound />);
      });

    axios.get(`/api/public/stats/race/${raceId}`)
      .then(res => {
        const data = res.data;
        console.log(data);
        setStartingGrid(res.data.startingGrid);
        setRaceResult(res.data.raceResult);
        setDriverStandings(res.data.driverStandings);
        setConstructorStandings(res.data.constructorStandings);
        setName(data.name);
      })
      .catch(err => {
        console.error(err);
        setError(<ErrorNotFound />);
      });
  }, []);

  function changeResults(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const raceResultPosition = formData.getAll('raceResultPosition')
    const raceResultId = formData.getAll('raceResultId')
    const raceResultPoints = formData.getAll('raceResultPoints')
    const driverStandingsId = formData.getAll('driverStandingsId')
    const driverStandingsPoints = formData.getAll('driverStandingsPoints')
    const constructorStandingsId = formData.getAll('constructorStandingsId')
    const constructorStandingsPoints = formData.getAll('constructorStandingsPoints')
    const raceResultReq = raceResultId.map((id, i) => {
      return { position: raceResultPosition[i], driver: id, points: raceResultPoints[i], finishingPosition: i + 1 }
    });
    const driverStandingsReq = driverStandingsId.map((id, i) => {
      return { position: i + 1, driver: id, points: driverStandingsPoints[i] }
    });
    const constructorStandingsReq = constructorStandingsId.map((id, i) => {
      return { position: i + 1, constructor: id, points: constructorStandingsPoints[i] }
    });
    const req = {
      raceId: raceId,
      raceResult: raceResultReq,
      driverStandings: driverStandingsReq,
      constructorStandings: constructorStandingsReq
    };
    axios.put("/api/admin/season/manage/addRaceResult", req,
      {
        headers: {
          [headerName]: token
        }
      })
      .then(res => {
        const submitButton = document.getElementById('submit-button');
        submitButton.value = "Lagret!";
        setTimeout(() => submitButton.value = "Endre resultater", 1000);
      })
      .catch(err => {
        alert('Kunne ikke legge til resultater');
        console.error(err);
      })
  }

  function StartingGridTable(props) {
    const { grid } = props;
    const header = ["Plass", "Sjåfør"];
    const body = grid.map((row) => ({
      key: row.name,
      values: [row.position, row.name]
    }));
    return <Table title="Startoppstilling" header={header} body={body} />;
  }

  function RaceResultsTable() {
    const header = ["Plass", "Sjåfør", "Poeng"];
    const body = raceResult.map((row) => ({
      key: row.id,
      values: [
        <input type="text" defaultValue={row.position} name="raceResultPosition" />,
        <select defaultValue={row.id} name="raceResultId">
          <option>Velg sjåfør</option>
          {drivers.map(driver =>
            <option value={driver.id}>{driver.name}</option>
          )}
        </select>,
        <input type="number" defaultValue={row.points} min="0" max="1000" name="raceResultPoints" />]
    }));
    return <Table title="Result av løp" header={header} body={body} />;
  }

  function DriverStandingsTable() {
    const header = ["Plass", "Sjåfør", "Poeng"];
    const body = driverStandings.map((row) => ({
      key: row.id,
      values: [
        row.position,
        <select defaultValue={row.id} name="driverStandingsId">
          <option>Velg sjåfør</option>
          {drivers.map(driver =>
            <option value={driver.id}>{driver.name}</option>
          )}
        </select>,
        <input type="number" defaultValue={row.points} min="0" max="1000" name="driverStandingsPoints" />]
    }));
    return <Table title="Sjåførmesterskap" header={header} body={body} />;
  }

  function ConstructorsStandingsTable() {
    const header = ["Plass", "Konstruktør", "Poeng"];
    const body = constructorStandings.map((row) => ({
      key: row.id,
      values: [
        row.position,
        <select defaultValue={row.id} name="constructorStandingsId">
          <option>Velg konstruktør</option>
          {constructors.map(constructor =>
            <option value={constructor.id}>{constructor.name}</option>
          )}
        </select>,
        <input type="number" defaultValue={row.points} min="0" max="1000" name="constructorStandingsPoints" />]
    }));
    return <Table title="Konstruktørmesterskap" header={header} body={body} />;
  }

  return (
    <>
      {error ? error : ''}
      <title>{`Statistikk - ${name}`}</title>
      <h2>{name}</h2>

      <form onSubmit={changeResults}>
        <div className="tables">
          <StartingGridTable grid={startingGrid} />
          <RaceResultsTable />
          <button type="button" onClick={() => setRaceResult([...raceResult, { position: raceResult.length + 1, id: null, points: 0 }])}>Legg til rad</button>
          <DriverStandingsTable />
          <button type="button" onClick={() => setDriverStandings([...driverStandings, { position: driverStandings.length + 1, id: null, points: 0 }])}>Legg til rad</button>
          <ConstructorsStandingsTable />
          <button type="button" onClick={() => setConstructorStandings([...constructorStandings, { position: constructorStandings.length + 1, id: null, points: 0 }])}>Legg til rad</button>
        </div>
        <input type="submit" value="Endre resultater" id="submit-button"/>
      </form>
    </>
  )
}

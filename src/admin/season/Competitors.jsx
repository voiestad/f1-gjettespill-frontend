import { Link, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function SeasonCompetitors() {
  const { year } = useParams();
  return (
    <>
      <title>{`Deltakere ${year}`}</title>
      <h2>{`Deltakere ${year}`}</h2>
      <div className="linkList">
        <Link to={`/admin/season/${year}/competitors/constructors`}>Konstruktører</Link>
        <Link to={`/admin/season/${year}/competitors/drivers`}>Sjåfører</Link>
      </div>
    </>
  )
}

export function SeasonConstructors() {
  const { year } = useParams();
  const [constructors, setConstructors] = useState(null);
  const [positions, setPositions] = useState(null);
  const [newConstructor, setNewConstructor] = useState("");

  function loadConstructors() {
    axios.get(`/api/admin/season/competitors/constructors/list/${year}`)
      .then(res => {
        setConstructors(res.data);
        setPositions(res.data.map(_ => 1));
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    loadConstructors();
  }, []);

  function changePos(event, constructor, newPosition) {
    event.preventDefault();
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/competitors/constructors/move', {},
          {
            params: {
              year: year,
              constructor: constructor,
              newPosition: newPosition
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadConstructors();
          })
          .catch(err => {
            alert('Kunne ikke endre plass');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  function changeColor(event, constructor) {
    event.preventDefault();
    const color = new FormData(event.target).get('color');
    if (!color) {
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/competitors/constructors/add-color', {},
          {
            params: {
              year: year,
              constructor: constructor,
              color: color
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadConstructors();
          })
          .catch(err => {
            alert('Kunne ikke endre farge');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  function deleteConstructor(event, constructor) {
    event.preventDefault();
    if (!confirm("Er du sikker på at du ville slette konstruktøren?")) {
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/competitors/constructors/delete', {},
          {
            params: {
              year: year,
              constructor: constructor
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadConstructors();
          })
          .catch(err => {
            alert('Kunne ikke slette konstruktør');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  function updatePos(index, value) {
    setPositions(positions.map((pos, i) =>
      i === index ? value : pos
    ))
  }

  function addConstructor(event) {
    event.preventDefault();
    if (!newConstructor) {
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/competitors/constructors/add', {},
          {
            params: {
              year: year,
              constructor: newConstructor
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadConstructors();
            setNewConstructor("");
          })
          .catch(err => {
            alert('Kunne ikke legge til konstruktør');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  function renameConstructor(event, constructor) {
    event.preventDefault();
    const name = new FormData(event.target).get('name');
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/competitors/constructors/rename', {},
          {
            params: {
              constructor: constructor,
              name: name
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadConstructors();
          })
          .catch(err => {
            alert('Kunne ikke endre navn på konstruktør');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  return (
    <>
      <title>{`Konstruktører ${year}`}</title>
      <h2>{`Konstruktører ${year}`}</h2>
      <form>
        <input type="text" placeholder="Konstruktørnavn" value={newConstructor}
          onChange={e => setNewConstructor(e.target.value)} />
        <input type="submit" value="Legg til konstruktør" onClick={addConstructor} />
      </form>
      {constructors ?
        constructors.map((constructor, index) =>
          <div key={constructor.id}>
            <p>{index + 1}. {constructor.name} - {constructor.id}</p>
            <form>
              {positions[index]}<br />
              <input type="range" min="1" max={constructors.length} value={positions[index]}
                onChange={e => updatePos(index, e.target.value)} />
              <br />
              <input type="submit" value="Endre plass"
                onClick={e => changePos(e, constructor.id, positions[index])} />
            </form>
            <br />
            <form onSubmit={e => changeColor(e, constructor.id)}>
              {constructor.color ?
              <span className="circle" style={{backgroundColor: constructor.color}} />
              : ''}
              <input type="text" pattern="^#[0-9A-Fa-f]{6}$" placeholder="#ffffff" name="color" defaultValue={constructor.color ? constructor.color : ''} />
              <input type="submit" value="Velg farge" />
            </form>
            <form onSubmit={e => renameConstructor(e, constructor.id)}>
              <input type="text" placeholder="Nytt navn" name="name" />
              <input type="submit" value="Endre navn" />
            </form>
            <form>
              <input type="submit" value="&#128465;"
                onClick={e => deleteConstructor(e, constructor.id)} />
            </form>
          </div>
        )
        : ''}
    </>
  )
}

export function SeasonDrivers() {
  const { year } = useParams();
  const [positions, setPositions] = useState(null);
  const [newDriver, setNewDriver] = useState("");
  const [drivers, setDrivers] = useState(null);
  const [constructors, setConstructors] = useState(null);
  
  function loadConstructors() {
    axios.get(`/api/admin/season/competitors/constructors/list/${year}`)
      .then(res => setConstructors(res.data))
      .catch(err => console.error(err));
  }

  function loadDrivers() {
    axios.get(`/api/admin/season/competitors/drivers/list/${year}`)
      .then(res => {
        setDrivers(res.data);
        setPositions(res.data.map(_ => 1));
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    loadDrivers();
    loadConstructors();
  }, []);

  function changePos(event, driver, newPosition) {
    event.preventDefault();
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/competitors/drivers/move', {},
          {
            params: {
              year: year,
              driver: driver,
              newPosition: newPosition
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadDrivers();
          })
          .catch(err => {
            alert('Kunne ikke endre plass');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  function changeTeam(event, driver) {
    event.preventDefault();
    const team = new FormData(event.target).get('team');
    if (!team) {
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/competitors/drivers/set-team', {},
          {
            params: {
              year: year,
              driver: driver,
              team: team
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadDrivers();
          })
          .catch(err => {
            alert('Kunne ikke endre lag');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  function deleteDriver(event, driver) {
    event.preventDefault();
    if (!confirm("Er du sikker på at du ville slette sjåføren?")) {
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/competitors/drivers/delete', {},
          {
            params: {
              year: year,
              driver: driver
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadDrivers();
          })
          .catch(err => {
            alert('Kunne ikke slette sjåføren');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  function updatePos(index, value) {
    setPositions(positions.map((pos, i) =>
      i === index ? value : pos
    ))
  }

  function addDriver(event) {
    event.preventDefault();
    if (!newDriver) {
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/competitors/drivers/add', {},
          {
            params: {
              year: year,
              driver: newDriver
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadDrivers();
            setNewDriver("");
          })
          .catch(err => {
            alert('Kunne ikke legge til sjåfør');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  function renameDriver(event, driver) {
    event.preventDefault();
    const name = new FormData(event.target).get('name');
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/competitors/drivers/rename', {},
          {
            params: {
              driver: driver,
              name: name
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadDrivers();
          })
          .catch(err => {
            alert('Kunne ikke endre navn på sjåfør');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  return (
    <>
      <title>{`Sjåfører ${year}`}</title>
      <h2>{`Sjåfører ${year}`}</h2>
      <form>
        <input type="text" placeholder="Sjåførnavn" value={newDriver}
          onChange={e => setNewDriver(e.target.value)} />
        <input type="submit" value="Legg til sjåfør" onClick={addDriver} />
      </form>
      {constructors && drivers ?
        drivers.map((driver, index) =>
          <div key={driver.id}>
            <p>{index + 1}. {driver.name} - {driver.id}</p>
            <form>
              {positions[index]}<br />
              <input type="range" min="1" max={drivers.length} value={positions[index]}
                onChange={e => updatePos(index, e.target.value)} />
              <br />
              <input type="submit" value="Endre plass"
                onClick={e => changePos(e, driver.id, positions[index])} />
            </form>
            <br />
            <form onSubmit={e => changeTeam(e, driver.id)}>
              <select name="team" defaultValue={driver.team ? driver.team.id : ''}>
                <option value="">Velg lag</option>
                {constructors.map(constructor => 
                  <option key={constructor.id} value={constructor.id}>{constructor.name}</option>
                )}
              </select>
              <input type="submit" value="Sett lag" />
            </form>
            <form onSubmit={e => renameDriver(e, driver.id)}>
              <input type="text" placeholder="Nytt navn" name="name" />
              <input type="submit" value="Endre navn" />
            </form>
            <form>
              <input type="submit" value="&#128465;"
                onClick={e => deleteDriver(e, driver.id)} />
            </form>
          </div>
        )
        : ''}
    </>
  )
}

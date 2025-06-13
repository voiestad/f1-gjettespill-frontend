import { Link, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function SeasonCompetitors() {
  const { year } = useParams();
  return (
    <>
      <title>Deltakere {year}</title>
      <h2>Deltakere {year}</h2>
      <div className="linkList">
        <Link to={`/admin/season/${year}/competitors/constructors`}>Konstruktører</Link>
        <Link to={`/admin/season/${year}/competitors/drivers`}>Sjåfører</Link>
        <Link to={`/admin/season/${year}/competitors/alias`}>Alternative navn</Link>
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

  return (
    <>
      <title>Konstruktører {year}</title>
      <h2>Konstruktører {year}</h2>
      <form>
        <input type="text" placeholder="Konstruktørnavn" value={newConstructor}
          onChange={e => setNewConstructor(e.target.value)} />
        <input type="submit" value="Legg til konstruktør" onClick={addConstructor} />
      </form>
      {constructors ?
        constructors.map((constructor, index) =>
          <div key={constructor.competitor}>
            <p>{index + 1}. {constructor.competitor}</p>
            <form>
              {positions[index]}<br />
              <input type="range" min="1" max={constructors.length} value={positions[index]}
                onChange={e => updatePos(index, e.target.value)} />
              <br />
              <input type="submit" value="Endre plass"
                onClick={e => changePos(e, constructor.competitor, positions[index])} />
            </form>
            <br />
            <form onSubmit={e => changeColor(e, constructor.competitor)}>
              {constructor.color ?
              <span className="circle" style={{backgroundColor: constructor.color}} />
              : ''}
              <input type="text" pattern="^#[0-9A-Fa-f]{6}$" placeholder="#ffffff" name="color" defaultValue={constructor.color ? constructor.color : ''} />
              <input type="submit" value="Velg farge" />
            </form>
            <form>
              <input type="submit" value="&#128465;"
                onClick={e => deleteConstructor(e, constructor.competitor)} />
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

  return (
    <>
      <title>Sjåfører {year}</title>
      <h2>Sjåfører {year}</h2>
      <form>
        <input type="text" placeholder="Sjåførnavn" value={newDriver}
          onChange={e => setNewDriver(e.target.value)} />
        <input type="submit" value="Legg til sjåfør" onClick={addDriver} />
      </form>
      {constructors && drivers ?
        drivers.map((driver, index) =>
          <div key={driver.competitor}>
            <p>{index + 1}. {driver.competitor}</p>
            <form>
              {positions[index]}<br />
              <input type="range" min="1" max={drivers.length} value={positions[index]}
                onChange={e => updatePos(index, e.target.value)} />
              <br />
              <input type="submit" value="Endre plass"
                onClick={e => changePos(e, driver.competitor, positions[index])} />
            </form>
            <br />
            <form onSubmit={e => changeTeam(e, driver.competitor)}>
              <select name="team" defaultValue={driver.value ? driver.value : ''}>
                <option value="">Velg lag</option>
                {constructors.map(constructor => 
                  <option key={constructor.competitor}>{constructor.competitor}</option>
                )}
              </select>
              <input type="submit" value="Sett lag" />
            </form>
            <form>
              <input type="submit" value="&#128465;"
                onClick={e => deleteDriver(e, driver.competitor)} />
            </form>
          </div>
        )
        : ''}
    </>
  )
}

export function SeasonAlias() {
  const { year } = useParams();
  const [drivers, setDrivers] = useState(null);
  const [aliases, setAliases] = useState(null);
  const [alias, setAlias] = useState("");
  const [driver, setDriver] = useState("");

  function loadDrivers() {
    axios.get(`/api/admin/season/competitors/drivers/list/${year}`)
      .then(res => setDrivers(res.data))
      .catch(err => console.error(err));
  }

  function loadAliases() {
    axios.get(`/api/admin/season/competitors/alias/list/${year}`)
      .then(res => setAliases(res.data))
      .catch(err => console.error(err));
  }

  useEffect(() => {
    loadDrivers();
    loadAliases();
  }, []);

  function addAlias(event) {
    event.preventDefault();
    if (!alias || !driver) {
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/competitors/alias/add', {},
          {
            params: {
              year: year,
              driver: driver,
              alternativeName: alias
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadAliases();
          })
          .catch(err => {
            alert('Kunne ikke legge til alternativt navn');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  function deleteAlias(event, driver, driverAlias) {
    event.preventDefault();
    if (!driver || !driverAlias) {
      return;
    }
    if (!confirm("Er du sikker på at du vil slette det alternative navnet?")) {
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/season/competitors/alias/delete', {},
          {
            params: {
              year: year,
              driver: driver,
              alternativeName: driverAlias
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadAliases();
          })
          .catch(err => {
            alert('Kunne ikke legge til alternativt navn');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  return (
    <>
      <title>Alternative navn {year}</title>
      <h2>Alternative navn {year}</h2>
      {drivers && aliases ?
        <>
          <form>
            <select onChange={e => setDriver(e.target.value)}>
              <option value="">Velg sjåfør</option>
              {drivers.map(driver =>
                <option key={driver.competitor} value={driver.competitor}>{driver.competitor}</option>
              )}
            </select>
            <input type="text" placeholder="Alternativt navn" required onChange={e => setAlias(e.target.value)} />
            <input type="submit" value="Legg til alternativt navn" onClick={addAlias} />
          </form>
          <div className="tables">
            <table>
              <thead>
                <tr>
                  <th>Alias</th>
                  <th>Sjåfør</th>
                  <th>Slett</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(aliases).map(driverAlias =>
                  <tr key={driverAlias}>
                    <td>{driverAlias}</td>
                    <td>{aliases[driverAlias]}</td>
                    <td>
                      <form>
                        <input type="submit" value="&#128465;"
                          onClick={e => deleteAlias(e, aliases[driverAlias], driverAlias)} />
                      </form>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
        : ''}
    </>
  )
}

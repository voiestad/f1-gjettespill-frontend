import { Link, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function SeasonCompetitors() {
  const { year } = useParams();
  return (
    <>
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

}

export function SeasonDrivers() {

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

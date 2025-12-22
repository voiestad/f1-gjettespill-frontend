import axios from 'axios';
import { useState, useContext } from 'react';
import { CsrfTokenContext } from '../components';

export function CreateLeague() {
  const [leagueName, setLeagueName] = useState("");
  const [error, setError] = useState(null);
  const { token, headerName } = useContext(CsrfTokenContext);

  function validateLeagueName(e) {
    let value = e.target.value;
    let result = "";
    for (const c of value) {
      if (result.length == 50) {
        break;
      }
      if (c.match("^[a-zA-ZÆØÅæøå0-9 ]$")) {
        result += c;
      }
    }
    setLeagueName(result);
  }

  function createLeague(e) {
    e.preventDefault();
    if (!leagueName) {
      return;
    }
    axios.put("/api/league", {}, {
      params: {
        leagueName: leagueName
      },
      headers: {
        [headerName]: token
      }
    }).then(res => {
      setLeagueName("");
      setError("Ligaen din ble laget!");
    }).catch(err => {
      console.error(err)
      setError(err.response.data);
    })
  }

  return (
    <>
      <title>Lag din egen liga</title>
      <h2>Lag din egen liga</h2>

      <form>
        <input type="text" placeholder="Liganavn" onChange={validateLeagueName} value={leagueName} /><br />
        <input type="submit" value="Lag liga" onClick={createLeague} />
      </form>

      {error ? <p>{error}</p> : ''}
    </>
  )
}

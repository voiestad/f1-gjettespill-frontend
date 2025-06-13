import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import axios from 'axios';

export function FlagChooseYear() {
  const [years, setYears] = useState(null);
  useEffect(() => {
    axios.get('/api/public/year/list')
      .then(res => setYears(res.data))
      .catch(err => console.error(err));
  }, []);
  return (
    <>
      <title>Registrer flagg - Velg år</title>
      <h2>Registrer flagg - Velg år</h2>
      <div className="linkList">
        {years ?
          years.map(year =>
            <Link key={year} to={`/admin/flag/${year}`}>{year}</Link>
          ) : ''}
      </div>
    </>
  )
}

export function FlagChooseRace() {
  const [races, setRaces] = useState(null);
  const { year } = useParams();
  useEffect(() => {
    axios.get(`/api/public/race/list/${year}`)
      .then(res => setRaces(res.data))
      .catch(err => console.error(err));
  }, []);
  return (
    <>
      <title>Registrer flagg - Velg løp</title>
      <h2>Registrer flagg - Velg løp</h2>
      <div className="linkList">
        {races ?
          races.map(race =>
            <Link key={race.position} to={`/admin/flag/${year}/${race.id}`}>
              {race.position}. {race.name}
            </Link>
          ) : ''}
      </div>
    </>
  )
}

export function FlagRegister() {
  const [flags, setFlags] = useState(null);
  const [flagTypes, setFlagTypes] = useState(null);
  const [sessionTypes, setSessionTypes] = useState(null);
  const { raceId } = useParams();
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [selectedRound, setSelectedRound] = useState(1);

  function deleteFlag(event, id) {
    event.preventDefault();
    if (!confirm('Er du sikker på at du vil slette denne?')) {
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/flag/delete', {},
          {
            params: {
              id: id
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadFlags();
          })
          .catch(err => {
            alert('Flagg kunne ikke bli slettet');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  function registerFlag(event) {
    event.preventDefault();
    if (!selectedFlag) {
      alert('Du må velge flagg');
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/flag/add', {},
          {
            params: {
              flag: selectedFlag,
              round: selectedRound,
              sessionType: selectedSession,
              raceId: raceId,
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadFlags();
          })
          .catch(err => {
            alert('Flagg kunne ikke bli lagt til');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  function loadFlags() {
    axios.get(`/api/admin/flag/list/${raceId}`)
      .then(res => setFlags(res.data))
      .catch(err => console.error(err));
  }

  useEffect(() => {
    axios.get('/api/admin/flag/session-types')
      .then(res => {
        setSessionTypes(res.data);
        setSelectedSession(res.data[0]);
      })
      .catch(err => console.error(err));
    axios.get('/api/admin/flag/types')
      .then(res => setFlagTypes(res.data))
      .catch(err => console.error(err));
    loadFlags();
  }, []);
  return (
    <>
      <title>{`Registrer flagg - ${raceId}`}</title>
      <h2>{`Registrer flagg - ${raceId}`}</h2>
      {sessionTypes && flagTypes ?
        <form>
          <select onChange={e => setSelectedSession(e.target.value)}>
            {sessionTypes.map(session =>
              <option key={session} value={session}>{session}</option>
            )}
          </select>
          <br /><br />
          <div className="radio-buttons">
            {flagTypes ?
              flagTypes.map(type =>
                <label key={type}>
                  <input type="radio" checked={type === selectedFlag}
                    onChange={e => setSelectedFlag(type)} required />
                  {type}
                  <br />
                </label>
              ) : ''}
          </div>
          <br />
          <label>Runde<br />
            <input type="range" onChange={e => setSelectedRound(e.target.value)}
              value={selectedRound} min="1" max="100" />
            <br />
            {selectedRound}
            <br />
          </label>
          <input type="submit" value="Legg til" onClick={registerFlag} />
          <br /><br />
        </form>
        : ''}

      {flags ?
        flags.map(flag =>
          <form key={flag.id}>
            <span>{flag.type}</span> <span>{flag.round}</span> <span>{flag.sessionType}</span>
            <input type="submit" value="&#128465;" onClick={e => deleteFlag(e, flag.id)} />
          </form>
        ) : ''}
    </>
  )
}

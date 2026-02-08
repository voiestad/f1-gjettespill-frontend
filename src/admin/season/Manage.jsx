import { useEffect, useState, useContext, useRef } from 'react';
import { Link, useParams } from 'react-router';
import axios from 'axios';
import { CsrfTokenContext } from '../../components';
import Table from '../../util/Table';
import RankCompetitors from '../../guess/RankCompetitors';

export function SeasonManageRaces() {
  const { year } = useParams();
  const [races, setRaces] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [newPos, setNewPos] = useState(null);
  const [newRaceName, setNewRaceName] = useState(null);
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
          name: newRaceName
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
        <input type="text" onChange={e => setNewRaceName(e.target.value)} placeholder="Navn" />
        <input type="submit" value="Legg til løp" onClick={addRace} />
      </form>
    </>
  )
}

function Ranking(props) {
  const { selected, setSelected, initialUnselected } = props;
  const [unselected, setUnselected] = useState(initialUnselected);
  const [transitions, setTransitions] = useState(false);

  const itemRefs = useRef([]);
  const itemBoundsRef = useRef([]);
  const draggedIndexRef = useRef(null);
  const currPosRef = useRef(null);
  const maxRef = useRef(0);

  useEffect(() => {
    setUnselected(initialUnselected);
  }, [initialUnselected]);

  function unselect(competitor) {
    setSelected(prev => prev.filter(c => c.id !== competitor.id));
    setUnselected(prev => [...prev, competitor]);
  }

  function select(competitor) {
    setUnselected(prev => prev.filter(c => c.id !== competitor.id));
    setSelected(prev => [...prev, competitor]);
  }

  useEffect(() => {
    if (!itemRefs.current.length) return;

    const heights = itemRefs.current
      .filter(Boolean)
      .map(el => el.getBoundingClientRect().height);

    const max = Math.max(...heights);
    maxRef.current = max;

    itemRefs.current.forEach(ref => {
      if (!ref) return;
      ref.style.height = `${max}px`;
      ref.style.zIndex = 1000;
    });
  }, [selected]);

  function setItemBounds() {
    itemBoundsRef.current = itemRefs.current.map(el =>
      el?.getBoundingClientRect()
    );
  }

  function findIndexOfCursor(y) {
    const bounds = itemBoundsRef.current;
    for (let i = 0; i < bounds.length; i++) {
      const b = bounds[i];
      if (b && y > b.top && y < b.bottom) return i;
    }
    return null;
  }

  function resetPositions() {
    itemRefs.current.forEach(el => {
      if (el) el.style.transform = "";
    });
  }

  function updatePositions() {
    const boxHeight = maxRef.current;

    selected.forEach((_, index) => {
      const el = itemRefs.current[index];
      if (!el || index === draggedIndexRef.current) return;

      let offset = 0;

      if (
        index < draggedIndexRef.current &&
        index >= currPosRef.current
      ) {
        offset = boxHeight;
      } else if (
        index > draggedIndexRef.current &&
        index <= currPosRef.current
      ) {
        offset = -boxHeight;
      }

      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  }

  function dragStart(index, event) {
    setTransitions(true);
    event.currentTarget.style.zIndex = 1;

    draggedIndexRef.current = index;
    currPosRef.current = index;

    setItemBounds();
  }

  function dragOver(event) {
    event.preventDefault();

    const index = findIndexOfCursor(event.clientY);
    if (index == null) return;

    currPosRef.current = index;
    updatePositions();
  }

  function dragEnd(event) {
    setTransitions(false);
    event.currentTarget.style.zIndex = 1000;

    resetPositions();

    const from = draggedIndexRef.current;
    const to = currPosRef.current;

    if (from == null || to == null || from === to) return;

    setSelected(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });

    draggedIndexRef.current = null;
    currPosRef.current = null;
  }

  return (
    <>
      <ul className="container">
        {selected.map((competitor, i) => (
          <li
            key={competitor.id}
            ref={el => (itemRefs.current[i] = el)}
            className={
              "item-wrapper" +
              (transitions ? "" : " disable-transitions")
            }
            draggable
            onDragStart={e => dragStart(i, e)}
            onDragOver={dragOver}
            onDragEnd={dragEnd}
          >
            <div className="number">{i + 1}</div>
            <div className="item">{competitor.name}</div>
            <button type="button" onClick={() => unselect(competitor)}
              style={{ paddingTop: 2, paddingBottom: 2, paddingLeft: 16, paddingRight: 16, marginTop: 0, marginBottom: 0 }}>
              -
            </button>
          </li>
        ))}
      </ul>

      <ul className="container">
        {unselected.map((competitor, i) => (
          <li key={competitor.id} className="item-wrapper">
            <div className="number">{i + 1}</div>
            <div className="item">{competitor.name}</div>
            <button type="button" onClick={() => select(competitor)}
              style={{ paddingTop: 2, paddingBottom: 2, paddingLeft: 16, paddingRight: 16, marginTop: 0, marginBottom: 0 }}>
              +
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}


export function ManageRace() {
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [startingGrid, setStartingGrid] = useState([]);
  const [raceResult, setRaceResult] = useState([]);
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [name, setName] = useState("")
  const [error, setError] = useState(null);
  const { raceId, year } = useParams();
  const { token, headerName } = useContext(CsrfTokenContext);

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
  }, []);

  useEffect(() => {
    axios.get(`/api/public/stats/race/${raceId}`)
      .then(res => {
        const data = res.data;
        setStartingGrid(res.data.startingGrid.length > 0 ? res.data.startingGrid : drivers);
        setRaceResult(res.data.raceResult.length > 0 ? res.data.raceResult : drivers);
        setDriverStandings(res.data.driverStandings.length > 0 ? res.data.driverStandings : drivers);
        setConstructorStandings(res.data.constructorStandings.length > 0 ? res.data.constructorStandings : constructors);
        setName(data.name);
      })
      .catch(err => {
        console.error(err);
        setError(<ErrorNotFound />);
      });
  }, [drivers, constructors]);

  function changeResults(e) {
    e.preventDefault();

    const raceResultReq = raceResult.map(driver => driver.id);

    const driverStandingsReq = driverStandings.map(driver => driver.id);

    const constructorStandingsReq = constructorStandings.map(constructor => constructor.id);
  
    const req = {
      raceId: raceId,
      raceResult: raceResultReq,
      driverStandings: driverStandingsReq,
      constructorStandings: constructorStandingsReq
    };

    axios.put("/api/admin/season/manage/race-result", req,
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

  function changeStartingGrid(e) {
    e.preventDefault();

    const startingGridReq = startingGrid.map(driver => driver.id);

    const req = {
      raceId: raceId,
      startingGrid: startingGridReq,
    };

    axios.put("/api/admin/season/manage/starting-grid", req,
      {
        headers: {
          [headerName]: token
        }
      })
      .then(res => {
        const submitButton = document.getElementById('submit-button-starting-grid');
        submitButton.value = "Lagret!";
        setTimeout(() => submitButton.value = "Endre resultater", 1000);
      })
      .catch(err => {
        alert('Kunne ikke legge til resultater');
        console.error(err);
      })
  }

  return (
    <>
      {error ? error : ''}
      <title>{`Statistikk - ${name}`}</title>
      <h2>{name}</h2>
      <form onSubmit={changeStartingGrid}>
        <h3>Startoppstilling</h3>
        <Ranking
          selected={startingGrid}
          setSelected={setStartingGrid}
          initialUnselected={drivers.filter(driver => !startingGrid.map(driver => driver.id).includes(driver.id))}
        />
        <input type="submit" value="Endre startoppstilling" id="submit-button-starting-grid" />
      </form>
      <form onSubmit={changeResults}>
        <h3>Løp</h3>
        <Ranking
          selected={raceResult}
          setSelected={setRaceResult}
          initialUnselected={drivers.filter(driver => !raceResult.map(driver => driver.id).includes(driver.id))}
        />
        <h3>Sjåførmesterskap</h3>
        <Ranking
          selected={driverStandings}
          setSelected={setDriverStandings}
          initialUnselected={drivers.filter(driver => !driverStandings.map(driver => driver.id).includes(driver.id))}
        />
        <h3>Konstruktørmesterskap</h3>
        <Ranking
          selected={constructorStandings}
          setSelected={setConstructorStandings}
          initialUnselected={constructors.filter(constructor => !constructorStandings.map(constructor => constructor.id).includes(constructor.id))}
        />
        <input type="submit" value="Endre resultater" id="submit-button" />
      </form>
    </>
  )
}

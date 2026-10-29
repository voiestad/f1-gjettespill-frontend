import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { Link, useParams } from "react-router";
import axios from "axios";
import { CsrfTokenContext } from "../../components";
import type { Driver, Competitor, Constructor, Race } from "../../types";
import { ErrorNotFound } from "../../error";
import { TrashIcon } from "lucide-react";

export function SeasonManageRaces() {
  const { year } = useParams();
  const [races, setRaces] = useState<Race[] | null>(null);
  const [selectedRace, setSelectedRace] = useState<number | null>(null);
  const [newPos, setNewPos] = useState<number | null>(null);
  const [newRaceName, setNewRaceName] = useState<string>("");
  const { token, headerName } = useContext(CsrfTokenContext);

  const loadRaces = useCallback(() => {
    axios
      .get(`/api/public/race/list/${year}`)
      .then((res) => setRaces(res.data))
      .catch((err) => console.error(err));
  }, [year]);

  function addRace(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    event.preventDefault();
    if (!newRaceName) {
      alert("Sett et navn");
      return;
    }
    axios
      .post(
        "/api/admin/season/manage/add",
        {},
        {
          params: {
            year: year,
            name: newRaceName,
          },
          headers: {
            [headerName]: token,
          },
        },
      )
      .then(() => {
        setNewRaceName("");
        loadRaces();
      })
      .catch((err) => {
        alert("Kunne ikke legge til løp");
        console.error(err);
      });
  }

  function changePos(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    event.preventDefault();
    if (!newPos) {
      alert("Du må velge en ny posisjon");
      return;
    }
    if (!selectedRace) {
      alert("Du må velge et løp");
      return;
    }
    axios
      .post(
        "/api/admin/season/manage/move",
        {},
        {
          params: {
            id: selectedRace,
            newPosition: newPos,
          },
          headers: {
            [headerName]: token,
          },
        },
      )
      .then(() => {
        loadRaces();
      })
      .catch((err) => {
        alert("Kunne ikke flytte løp");
        console.error(err);
      });
  }

  function deleteRace(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    if (!selectedRace) {
      alert("Du må velge et løp");
      return;
    }
    if (!confirm("Er du helt sikker på at du vil slette løpet?")) {
      return;
    }
    axios
      .post(
        "/api/admin/season/manage/delete",
        {},
        {
          params: {
            id: selectedRace,
          },
          headers: {
            [headerName]: token,
          },
        },
      )
      .then(() => {
        loadRaces();
      })
      .catch((err) => {
        alert("Kunne ikke slette løp");
        console.error(err);
      });
  }

  useEffect(() => {
    loadRaces();
  }, [loadRaces]);

  return (
    <>
      <title>{`Løp ${year}`}</title>
      <h2>{`Løp ${year}`}</h2>
      <form>
        <input
          type="number"
          min="1"
          max="100"
          pattern="[0-9]*"
          inputMode="numeric"
          onChange={(e) => setNewPos(Number(e.target.value))}
          placeholder="Ny plass"
          style={{ width: "75px" }}
        />
        <input type="submit" onClick={changePos} value="Endre plass" />
        <button type="button" onClick={deleteRace}>
          <TrashIcon size={16} />
        </button>
        <div className="tables">
          <table>
            <thead>
              <tr>
                <th style={{ position: "static" }}>#</th>
                <th style={{ position: "static" }}>Navn</th>
                <th style={{ position: "static" }}>ID</th>
                <th style={{ position: "static" }}>Velg</th>
              </tr>
            </thead>
            <tbody>
              {races ? (
                races.map((race) => (
                  <tr key={race.id}>
                    <td>{race.position}</td>
                    <td>
                      <Link to={`/admin/season/${year}/manage/${race.id}`}>
                        {race.name}
                      </Link>
                    </td>
                    <td>{race.id}</td>
                    <td>
                      <input
                        type="radio"
                        name="select"
                        onClick={() => setSelectedRace(race.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
      </form>
      <form>
        <input
          type="text"
          value={newRaceName}
          onChange={(e) => setNewRaceName(e.target.value)}
          placeholder="Navn"
        />
        <input type="submit" value="Legg til løp" onClick={addRace} />
      </form>
    </>
  );
}

function Ranking({
  selected,
  setSelected,
  initialUnselected,
}: {
  selected: Competitor[];
  setSelected: React.Dispatch<React.SetStateAction<Competitor[]>>;
  initialUnselected: Competitor[];
}) {
  const [unselected, setUnselected] = useState<Competitor[]>(initialUnselected);
  const [transitions, setTransitions] = useState<boolean>(false);

  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const itemBoundsRef = useRef<(DOMRect | undefined)[]>([]);
  const draggedIndexRef = useRef<number | null>(null);
  const currPosRef = useRef<number | null>(null);
  const maxRef = useRef(0);

  useEffect(() => {
    setUnselected(initialUnselected);
  }, [initialUnselected]);

  function unselect(competitor: Competitor) {
    setSelected((prev) => prev.filter((c) => c.id !== competitor.id));
    setUnselected((prev) => [...prev, competitor]);
  }

  function select(competitor: Competitor) {
    setUnselected((prev) => prev.filter((c) => c.id !== competitor.id));
    setSelected((prev) => [...prev, competitor]);
  }

  useEffect(() => {
    const heights = itemRefs.current
      .filter((el): el is HTMLLIElement => el !== null)
      .map((el) => el.getBoundingClientRect().height);

    if (heights.length === 0) return;

    const max = Math.max(...heights);
    maxRef.current = max;

    itemRefs.current.forEach((ref) => {
      if (!ref) return;
      ref.style.height = `${max}px`;
      ref.style.zIndex = "1000";
    });
  }, [selected]);

  function setItemBounds() {
    itemBoundsRef.current = itemRefs.current.map((el) =>
      el?.getBoundingClientRect(),
    );
  }

  function findIndexOfCursor(y: number) {
    const bounds = itemBoundsRef.current;
    for (let i = 0; i < bounds.length; i++) {
      const b = bounds[i];
      if (b && y > b.top && y < b.bottom) return i;
    }
    return null;
  }

  function resetPositions() {
    itemRefs.current.forEach((el) => {
      if (el) el.style.transform = "";
    });
  }

  function updatePositions() {
    const boxHeight = maxRef.current;
    const dragged = draggedIndexRef.current;
    const curr = currPosRef.current;

    if (dragged == null || curr == null) return;

    selected.forEach((_, index) => {
      const el = itemRefs.current[index];
      if (!el || index === dragged) return;

      let offset = 0;

      if (index < dragged && index >= curr) {
        offset = boxHeight;
      } else if (index > dragged && index <= curr) {
        offset = -boxHeight;
      }

      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  }

  function dragStart(event: React.DragEvent<HTMLLIElement>, index: number) {
    setTransitions(true);
    event.currentTarget.style.zIndex = "1";

    draggedIndexRef.current = index;
    currPosRef.current = index;

    setItemBounds();
  }

  function dragOver(event: React.DragEvent<HTMLLIElement>) {
    event.preventDefault();

    const index = findIndexOfCursor(event.clientY);
    if (index == null) return;

    currPosRef.current = index;
    updatePositions();
  }

  function dragEnd(event: React.DragEvent<HTMLLIElement>) {
    setTransitions(false);
    event.currentTarget.style.zIndex = "1000";

    resetPositions();

    const from = draggedIndexRef.current;
    const to = currPosRef.current;

    draggedIndexRef.current = null;
    currPosRef.current = null;

    if (from == null || to == null || from === to) return;

    setSelected((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  }

  return (
    <>
      <ul className="container">
        {selected.map((competitor, i) => (
          <li
            key={competitor.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={
              "item-wrapper" + (transitions ? "" : " disable-transitions")
            }
            draggable
            onDragStart={(e) => dragStart(e, i)}
            onDragOver={dragOver}
            onDragEnd={dragEnd}
          >
            <div className="number">{i + 1}</div>
            <div className="item">{competitor.name}</div>
            <button
              type="button"
              onClick={() => unselect(competitor)}
              style={{
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 16,
                paddingRight: 16,
                marginTop: 0,
                marginBottom: 0,
              }}
            >
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
            <button
              type="button"
              onClick={() => select(competitor)}
              style={{
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 16,
                paddingRight: 16,
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              +
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export function ManageRace() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [startingGrid, setStartingGrid] = useState<Competitor[]>([]);
  const [startingGridSet, setStartingGridSet] = useState<boolean | null>(null);
  const [resultsSet, setResultsSet] = useState<boolean | null>(null);
  const [raceResult, setRaceResult] = useState<Competitor[]>([]);
  const [driverStandings, setDriverStandings] = useState<Competitor[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<
    Competitor[]
  >([]);
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<React.ReactNode>(null);
  const { raceId, year } = useParams();
  const { token, headerName } = useContext(CsrfTokenContext);

  useEffect(() => {
    axios
      .get(`/api/admin/season/competitors/drivers/list/${year}?order=standings`)
      .then((res) => setDrivers(res.data))
      .catch((err) => {
        console.error(err);
        setError(<ErrorNotFound />);
      });
    axios
      .get(
        `/api/admin/season/competitors/constructors/list/${year}?order=standings`,
      )
      .then((res) => setConstructors(res.data))
      .catch((err) => {
        console.error(err);
        setError(<ErrorNotFound />);
      });
  }, [year]);

  useEffect(() => {
    axios
      .get(`/api/public/stats/race/${raceId}`)
      .then((res) => {
        const data = res.data;
        setStartingGridSet(res.data.startingGrid.length > 0);
        setStartingGrid(
          res.data.startingGrid.length > 0 ? res.data.startingGrid : drivers,
        );
        setResultsSet(
          res.data.raceResult.length > 0 ||
            res.data.driverStandings.length > 0 ||
            res.data.constructorStandings.length > 0,
        );
        setRaceResult(
          res.data.raceResult.length > 0
            ? res.data.raceResult
            : res.data.startingGrid.length > 0
              ? res.data.startingGrid
              : drivers,
        );
        setDriverStandings(
          res.data.driverStandings.length > 0
            ? res.data.driverStandings
            : drivers,
        );
        setConstructorStandings(
          res.data.constructorStandings.length > 0
            ? res.data.constructorStandings
            : constructors,
        );
        setName(data.name);
      })
      .catch((err) => {
        console.error(err);
        setError(<ErrorNotFound />);
      });
  }, [drivers, constructors, raceId]);

  function changeResults(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const raceResultReq = raceResult.map((driver) => driver.id);

    const driverStandingsReq = driverStandings.map((driver) => driver.id);

    const constructorStandingsReq = constructorStandings.map(
      (constructor) => constructor.id,
    );

    const req = {
      raceId: raceId,
      raceResult: raceResultReq,
      driverStandings: driverStandingsReq,
      constructorStandings: constructorStandingsReq,
    };

    axios
      .put("/api/admin/season/manage/race-result", req, {
        headers: {
          [headerName]: token,
        },
      })
      .then(() => {
        const submitButton = document.getElementById(
          "submit-button",
        ) as HTMLInputElement;
        submitButton.value = "Lagret!";
        setTimeout(() => (submitButton.value = "Endre resultater"), 1000);
        setResultsSet(true);
      })
      .catch((err) => {
        alert("Kunne ikke legge til resultater");
        console.error(err);
      });
  }

  function changeStartingGrid(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const startingGridReq = startingGrid.map((driver) => driver.id);

    const req = {
      raceId: raceId,
      startingGrid: startingGridReq,
    };

    axios
      .put("/api/admin/season/manage/starting-grid", req, {
        headers: {
          [headerName]: token,
        },
      })
      .then(() => {
        const submitButton = document.getElementById(
          "submit-button-starting-grid",
        ) as HTMLInputElement;
        submitButton.value = "Lagret!";
        setTimeout(() => (submitButton.value = "Endre resultater"), 1000);
        setStartingGridSet(true);
      })
      .catch((err) => {
        alert("Kunne ikke legge til resultater");
        console.error(err);
      });
  }

  return (
    <>
      <script async src="/DragDropTouch.js" />
      {error ? error : ""}
      <title>{`Statistikk - ${name}`}</title>
      <h2>{name}</h2>
      <form onSubmit={changeStartingGrid}>
        <h3>Startoppstilling{startingGridSet == false && " - ikke satt"}</h3>
        <Ranking
          selected={startingGrid}
          setSelected={setStartingGrid}
          initialUnselected={drivers.filter(
            (driver) =>
              !startingGrid.map((driver) => driver.id).includes(driver.id),
          )}
        />
        <input
          type="submit"
          value="Endre startoppstilling"
          id="submit-button-starting-grid"
        />
      </form>
      <form onSubmit={changeResults}>
        <h3>Løp{resultsSet == false && " - ikke satt"}</h3>
        <Ranking
          selected={raceResult}
          setSelected={setRaceResult}
          initialUnselected={drivers.filter(
            (driver) =>
              !raceResult.map((driver) => driver.id).includes(driver.id),
          )}
        />
        <h3>Sjåførmesterskap{resultsSet == false && " - ikke satt"}</h3>
        <Ranking
          selected={driverStandings}
          setSelected={setDriverStandings}
          initialUnselected={drivers.filter(
            (driver) =>
              !driverStandings.map((driver) => driver.id).includes(driver.id),
          )}
        />
        <h3>Konstruktørmesterskap{resultsSet == false && " - ikke satt"}</h3>
        <Ranking
          selected={constructorStandings}
          setSelected={setConstructorStandings}
          initialUnselected={constructors.filter(
            (constructor) =>
              !constructorStandings
                .map((constructor) => constructor.id)
                .includes(constructor.id),
          )}
        />
        <input type="submit" value="Endre resultater" id="submit-button" />
      </form>
    </>
  );
}

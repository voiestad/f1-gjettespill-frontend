import { Link, useParams } from "react-router";
import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { CsrfTokenContext } from "../../components";
import type { Constructor, Driver } from "../../types";

export function SeasonCompetitors() {
  const { year } = useParams();
  return (
    <>
      <title>{`Deltakere ${year}`}</title>
      <h2>{`Deltakere ${year}`}</h2>
      <div className="linkList">
        <Link to={`/admin/season/${year}/competitors/constructors`}>
          Konstruktører
        </Link>
        <Link to={`/admin/season/${year}/competitors/drivers`}>Sjåfører</Link>
      </div>
    </>
  );
}

export function SeasonConstructors() {
  const { year } = useParams();
  const [constructors, setConstructors] = useState<Constructor[] | null>(null);
  const [positions, setPositions] = useState<number[] | null>(null);
  const [newConstructor, setNewConstructor] = useState<string>("");
  const { token, headerName } = useContext(CsrfTokenContext);

  const loadConstructors = useCallback(() => {
    axios
      .get(`/api/admin/season/competitors/constructors/list/${year}`)
      .then((res) => {
        setConstructors(res.data);
        setPositions(res.data.map(() => 1));
      })
      .catch((err) => console.error(err));
  }, [year]);

  useEffect(() => {
    loadConstructors();
  }, [loadConstructors]);

  function changePos(
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
    constructor: number,
    newPosition: number,
  ) {
    event.preventDefault();
    axios
      .post(
        "/api/admin/season/competitors/constructors/move",
        {},
        {
          params: new URLSearchParams({
            year: year ?? "",
            constructor: String(constructor),
            newPosition: String(newPosition),
          }),
          headers: {
            [headerName]: token,
          },
        },
      )
      .then(() => {
        loadConstructors();
      })
      .catch((err) => {
        alert("Kunne ikke endre plass");
        console.error(err);
      });
  }

  function changeColor(
    event: React.FormEvent<HTMLFormElement>,
    constructor: number,
  ) {
    event.preventDefault();
    const color = new FormData(event.currentTarget).get("color");
    if (!color) {
      return;
    }
    axios
      .post(
        "/api/admin/season/competitors/constructors/add-color",
        {},
        {
          params: new URLSearchParams({
            year: year ?? "",
            constructor: String(constructor),
            color: color?.toString() ?? "",
          }),
          headers: {
            [headerName]: token,
          },
        },
      )
      .then(() => {
        loadConstructors();
      })
      .catch((err) => {
        alert("Kunne ikke endre farge");
        console.error(err);
      });
  }

  function deleteConstructor(
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
    constructor: number,
  ) {
    event.preventDefault();
    if (!confirm("Er du sikker på at du ville slette konstruktøren?")) {
      return;
    }
    axios
      .post(
        "/api/admin/season/competitors/constructors/delete",
        {},
        {
          params: new URLSearchParams({
            year: year ?? "",
            constructor: String(constructor),
          }),
          headers: {
            [headerName]: token,
          },
        },
      )
      .then(() => {
        loadConstructors();
      })
      .catch((err) => {
        alert("Kunne ikke slette konstruktør");
        console.error(err);
      });
  }

  function updatePos(index: number, value: number) {
    if (!positions) {
      return;
    }
    setPositions(positions.map((pos, i) => (i === index ? value : pos)));
  }

  function addConstructor(
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) {
    event.preventDefault();
    if (!newConstructor) {
      return;
    }
    axios
      .post(
        "/api/admin/season/competitors/constructors/add",
        {},
        {
          params: new URLSearchParams({
            year: year ?? "",
            constructor: newConstructor,
          }),
          headers: {
            [headerName]: token,
          },
        },
      )
      .then(() => {
        loadConstructors();
        setNewConstructor("");
      })
      .catch((err) => {
        alert("Kunne ikke legge til konstruktør");
        console.error(err);
      });
  }

  function renameConstructor(
    event: React.FormEvent<HTMLFormElement>,
    constructor: number,
  ) {
    event.preventDefault();
    const name = new FormData(event.currentTarget).get("name");
    axios
      .post(
        "/api/admin/season/competitors/constructors/rename",
        {},
        {
          params: new URLSearchParams({
            constructor: String(constructor),
            name: name?.toString() ?? "",
          }),
          headers: {
            [headerName]: token,
          },
        },
      )
      .then(() => {
        loadConstructors();
      })
      .catch((err) => {
        alert("Kunne ikke endre navn på konstruktør");
        console.error(err);
      });
  }

  return (
    <>
      <title>{`Konstruktører ${year}`}</title>
      <h2>{`Konstruktører ${year}`}</h2>
      <form>
        <input
          type="text"
          placeholder="Konstruktørnavn"
          value={newConstructor}
          onChange={(e) => setNewConstructor(e.target.value)}
        />
        <input
          type="submit"
          value="Legg til konstruktør"
          onClick={addConstructor}
        />
      </form>
      {constructors && positions
        ? constructors.map((constructor, index) => (
            <div key={constructor.id}>
              <p>
                {index + 1}. {constructor.name} - {constructor.id}
              </p>
              <form>
                {positions[index]}
                <br />
                <input
                  type="range"
                  min="1"
                  max={constructors.length}
                  value={positions[index]}
                  onChange={(e) => updatePos(index, Number(e.target.value))}
                />
                <br />
                <input
                  type="submit"
                  value="Endre plass"
                  onClick={(e) =>
                    changePos(e, constructor.id, positions[index])
                  }
                />
              </form>
              <br />
              <form onSubmit={(e) => changeColor(e, constructor.id)}>
                {constructor.color ? (
                  <span
                    className="circle"
                    style={{ backgroundColor: constructor.color }}
                  />
                ) : (
                  ""
                )}
                <input
                  type="text"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  placeholder="#ffffff"
                  name="color"
                  defaultValue={constructor.color ? constructor.color : ""}
                />
                <input type="submit" value="Velg farge" />
              </form>
              <form onSubmit={(e) => renameConstructor(e, constructor.id)}>
                <input type="text" placeholder="Nytt navn" name="name" />
                <input type="submit" value="Endre navn" />
              </form>
              <form>
                <input
                  type="submit"
                  value="&#128465;"
                  onClick={(e) => deleteConstructor(e, constructor.id)}
                />
              </form>
            </div>
          ))
        : ""}
    </>
  );
}

export function SeasonDrivers() {
  const { year } = useParams();
  const [positions, setPositions] = useState<number[] | null>(null);
  const [newDriver, setNewDriver] = useState<string>("");
  const [drivers, setDrivers] = useState<Driver[] | null>(null);
  const [constructors, setConstructors] = useState<Constructor[] | null>(null);
  const { token, headerName } = useContext(CsrfTokenContext);

  const loadConstructors = useCallback(() => {
    axios
      .get(`/api/admin/season/competitors/constructors/list/${year}`)
      .then((res) => setConstructors(res.data))
      .catch((err) => console.error(err));
  }, [year]);

  const loadDrivers = useCallback(() => {
    axios
      .get(`/api/admin/season/competitors/drivers/list/${year}`)
      .then((res) => {
        setDrivers(res.data);
        setPositions(res.data.map(() => 1));
      })
      .catch((err) => console.error(err));
  }, [year]);

  useEffect(() => {
    loadDrivers();
    loadConstructors();
  }, [loadDrivers, loadConstructors]);

  function changePos(
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
    driver: number,
    newPosition: number,
  ) {
    event.preventDefault();
    axios
      .post(
        "/api/admin/season/competitors/drivers/move",
        {},
        {
          params: {
            year: year,
            driver: driver,
            newPosition: newPosition,
          },
          headers: {
            [headerName]: token,
          },
        },
      )
      .then(() => {
        loadDrivers();
      })
      .catch((err) => {
        alert("Kunne ikke endre plass");
        console.error(err);
      });
  }

  function changeTeam(event: React.FormEvent<HTMLFormElement>, driver: number) {
    event.preventDefault();
    const team = new FormData(event.currentTarget).get("team");
    if (!team) {
      return;
    }
    axios
      .post(
        "/api/admin/season/competitors/drivers/set-team",
        {},
        {
          params: {
            year: year,
            driver: driver,
            team: team,
          },
          headers: {
            [headerName]: token,
          },
        },
      )
      .then(() => {
        loadDrivers();
      })
      .catch((err) => {
        alert("Kunne ikke endre lag");
        console.error(err);
      });
  }

  function deleteDriver(
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
    driver: number,
  ) {
    event.preventDefault();
    if (!confirm("Er du sikker på at du ville slette sjåføren?")) {
      return;
    }
    axios
      .post(
        "/api/admin/season/competitors/drivers/delete",
        {},
        {
          params: {
            year: year,
            driver: driver,
          },
          headers: {
            [headerName]: token,
          },
        },
      )
      .then(() => {
        loadDrivers();
      })
      .catch((err) => {
        alert("Kunne ikke slette sjåføren");
        console.error(err);
      });
  }

  function updatePos(index: number, value: number) {
    if (!positions) {
      return;
    }
    setPositions(positions.map((pos, i) => (i === index ? value : pos)));
  }

  function addDriver(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    event.preventDefault();
    if (!newDriver) {
      return;
    }
    axios
      .post(
        "/api/admin/season/competitors/drivers/add",
        {},
        {
          params: {
            year: year,
            driver: newDriver,
          },
          headers: {
            [headerName]: token,
          },
        },
      )
      .then(() => {
        loadDrivers();
        setNewDriver("");
      })
      .catch((err) => {
        alert("Kunne ikke legge til sjåfør");
        console.error(err);
      });
  }

  function renameDriver(
    event: React.FormEvent<HTMLFormElement>,
    driver: number,
  ) {
    event.preventDefault();
    const name = new FormData(event.currentTarget).get("name");
    axios
      .post(
        "/api/admin/season/competitors/drivers/rename",
        {},
        {
          params: {
            driver: driver,
            name: name,
          },
          headers: {
            [headerName]: token,
          },
        },
      )
      .then(() => {
        loadDrivers();
      })
      .catch((err) => {
        alert("Kunne ikke endre navn på sjåfør");
        console.error(err);
      });
  }

  return (
    <>
      <title>{`Sjåfører ${year}`}</title>
      <h2>{`Sjåfører ${year}`}</h2>
      <form>
        <input
          type="text"
          placeholder="Sjåførnavn"
          value={newDriver}
          onChange={(e) => setNewDriver(e.target.value)}
        />
        <input type="submit" value="Legg til sjåfør" onClick={addDriver} />
      </form>
      {constructors && drivers && positions
        ? drivers.map((driver, index) => (
            <div key={driver.id}>
              <p>
                {index + 1}. {driver.name} - {driver.id}
              </p>
              <form>
                {positions[index]}
                <br />
                <input
                  type="range"
                  min="1"
                  max={drivers.length}
                  value={positions[index]}
                  onChange={(e) => updatePos(index, Number(e.target.value))}
                />
                <br />
                <input
                  type="submit"
                  value="Endre plass"
                  onClick={(e) => changePos(e, driver.id, positions[index])}
                />
              </form>
              <br />
              <form onSubmit={(e) => changeTeam(e, driver.id)}>
                <select
                  name="team"
                  defaultValue={driver.team ? driver.team.id : ""}
                >
                  <option value="">Velg lag</option>
                  {constructors.map((constructor) => (
                    <option key={constructor.id} value={constructor.id}>
                      {constructor.name}
                    </option>
                  ))}
                </select>
                <input type="submit" value="Sett lag" />
              </form>
              <form onSubmit={(e) => renameDriver(e, driver.id)}>
                <input type="text" placeholder="Nytt navn" name="name" />
                <input type="submit" value="Endre navn" />
              </form>
              <form>
                <input
                  type="submit"
                  value="&#128465;"
                  onClick={(e) => deleteDriver(e, driver.id)}
                />
              </form>
            </div>
          ))
        : null}
    </>
  );
}

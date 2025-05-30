import { useEffect, useState } from 'react';
import axios from 'axios';
import { translateFlag } from '../util/translator';

function SummaryTable(props) {
  const { user1, user2 } = props;

  return (
    <>
      <h3>Oppsummering</h3>
      <table>
        <thead>
          <tr>
            <th>Poeng</th>
            <th>Kategori</th>
            <th>Poeng</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{user1.drivers}</td>
            <td>Sjåfører</td>
            <td>{user2.drivers}</td>
          </tr>
          <tr>
            <td>{user1.constructors}</td>
            <td>Konstruktører</td>
            <td>{user2.constructors}</td>
          </tr>
          <tr>
            <td>{user1.flag}</td>
            <td>Antall</td>
            <td>{user2.flag}</td>
          </tr>
          <tr>
            <td>{user1.winner}</td>
            <td>1.plass</td>
            <td>{user2.winner}</td>
          </tr>
          <tr>
            <td>{user1.tenth}</td>
            <td>10.plass</td>
            <td>{user2.tenth}</td>
          </tr>
          <tr>
            <td>{user1.total}</td>
            <td>Totalt</td>
            <td>{user2.total}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function ChampionshipTable(props) {
  const { title, compName, user1, user2 } = props

  return (
    <>
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Poeng</th>
            <th>Gjettet</th>
            <th>Plass</th>
            <th>{compName}</th>
            <th>Gjettet</th>
            <th>Poeng</th>
          </tr>
        </thead>
        <tbody>
          {user1.map((row, i) =>
            <tr key={row.competitor}>
              <td>{row.points}</td>
              <td>{row.guessed !== null ? row.guessed : 'N/A'}</td>
              <td>{row.pos}</td>
              <td>{row.competitor}</td>
              <td>{user2[i].guessed !== null ? user2[i].guessed : 'N/A'}</td>
              <td>{user2[i].points}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

function FlagTable(props) {
  const { user1, user2 } = props;
  user1.sort((a, b) => translateFlag(a.flag).localeCompare(translateFlag(b.flag)));
  user2.sort((a, b) => translateFlag(a.flag).localeCompare(translateFlag(b.flag)));
  if (user1.length !== user2.length) {
    if (user1.length > user2.length) {
      for (let row of user1) {
        user2.push({
          guessed: 'N/A',
          points: 0,
          actual: row.actual,
          flag: row.flag
        });
      }
    } else {
      for (let row of user2) {
        user1.push({
          guessed: 'N/A',
          points: 0,
          actual: row.actual,
          flag: row.flag
        });
      }

    }
  }
  return (
    <>
      <h3>Antall</h3>
      <table>
        <thead>
          <tr>
            <th>Poeng</th>
            <th>Gjettet</th>
            <th>Faktisk</th>
            <th>Type</th>
            <th>Gjettet</th>
            <th>Poeng</th>
          </tr>
        </thead>
        <tbody>
          {user1
            .map((row, i) =>
              <tr key={row.flag}>
                <td>{row.points}</td>
                <td>{row.guessed}</td>
                <td>{row.actual}</td>
                <td>{translateFlag(row.flag)}</td>
                <td>{user2[i].guessed}</td>
                <td>{user2[i].points}</td>
              </tr>
            )}
        </tbody>
      </table>
    </>
  );
}

function DriverPlaceTable(props) {
  const { title, user1, user2 } = props;
  const placeGuesses = [];
  let i = 0;
  let j = 0;
  while (true) {
    if (i >= user1.length && j >= user2.length) {
      break;
    }
    const row = {
      points1: 0,
      points2: 0,
      finishPos1: 'N/A',
      finishPos2: 'N/A',
      startPos1: 'N/A',
      startPos2: 'N/A',
      driver1: 'N/A',
      driver2: 'N/A',
    };
    let set1 = false;
    let set2 = false;
    if (i < user1.length && j < user2.length) {
      if (user1[i].racePos === user2[j].racePos) {
        set1 = true;
        set2 = true;
      } else if (user1[i].racePos < user2[j].racePos) {
        set1 = true;
      } else {
        set2 = true;
      }
    } else if (i < user1.length) {
      set1 = true;
    } else {
      set2 = true;
    }
    if (set1) {
      row.points1 = user1[i].points;
      row.finishPos1 = user1[i].finishPos;
      row.startPos1 = user1[i].startPos;
      row.driver1 = user1[i].driver;
      row.raceName = user1[i].raceName;
      i++;
    }
    if (set2) {
      row.points2 = user2[j].points;
      row.finishPos2 = user2[j].finishPos;
      row.startPos2 = user2[j].startPos;
      row.driver2 = user2[j].driver;
      row.raceName = user2[j].raceName;
      j++;
    }
    placeGuesses.push(row);
  }
  return (
    <>
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Poeng</th>
            <th>Plass</th>
            <th>Startet</th>
            <th>Gjettet</th>
            <th>Løp</th>
            <th>Gjettet</th>
            <th>Startet</th>
            <th>Plass</th>
            <th>Poeng</th>
          </tr>
        </thead>
        <tbody>
          {placeGuesses.map((row) =>
            <tr key={row.raceName}>
              <td>{row.points1}</td>
              <td>{row.finishPos1}</td>
              <td>{row.startPos1}</td>
              <td>{row.driver1}</td>
              <td>{row.raceName}</td>
              <td>{row.driver2}</td>
              <td>{row.startPos2}</td>
              <td>{row.finishPos2}</td>
              <td>{row.points2}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}



function Compare() {
  const [years, setYears] = useState(null);
  const [users, setUsers] = useState(null);

  const [selectedYear, setSelectedYear] = useState(null);
  const [user1, setUser1] = useState(null);
  const [user2, setUser2] = useState(null);

  const [userGuesses, setUserGuesses] = useState(null);

  useEffect(() => {
    axios.get('/api/public/year/list')
      .then(res => {
        setYears(res.data);
        if (res.data.length > 0) {
          setSelectedYear(res.data[0]);
        }
      })
      .catch(err => console.error(err));
    axios.get('/api/public/user/list')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedYear == null || user1 == null || user2 == null) {
      return;
    }
    axios.get(`/api/public/user/${user1.id}`)
      .then(res => {
        axios.get(`/api/public/user/${user2.id}`)
          .then(res2 => {
            setUserGuesses({ user1: res.data, user2: res2.data });
          })
      })
      .catch(err => console.error(err))
  }, [selectedYear, user1, user2]);

  function getUserFromId(id) {
    if (id === '') {
      setUserGuesses(null);
      return null;
    }
    for (let user of users) {
      if (user.id === id) {
        return user;
      }
    }
  }

  return (
    <>
      <h2>{userGuesses ? `${user1.username} vs ${user2.username}` : 'Sammenlign brukere'}</h2>
      <form>
        <label>Velg år:
          <br />
          {years ?
            <select onChange={e => setSelectedYear(e.target.value)}>
              {years.map((year) =>
                <option key={year} value={year}>{year}</option>
              )}
            </select>
            : ''}
        </label>
        <br /><br />
        <label>Velg brukere:
          <br />
          {users ?
            <>
              <select onChange={e => setUser1(getUserFromId(e.target.value))}>
                <option value="">Velg bruker 1</option>
                {users.map((user) =>
                  <option key={user.id} value={user.id}>{user.username}</option>
                )}
              </select>
              <br />
              <select onChange={e => setUser2(getUserFromId(e.target.value))}>
                <option value="">Velg bruker 2</option>
                {users.map((user) =>
                  <option key={user.id} value={user.id}>{user.username}</option>
                )}
              </select>
            </>
            : ''}
        </label>
        <br /><br />
      </form>
      {userGuesses ?
        <div className="tables big-tables">
          <SummaryTable user1={userGuesses.user1.summary} user2={userGuesses.user2.summary} />
          <ChampionshipTable title="Sjåfører" compName="Sjåfør" user1={userGuesses.user1.driversGuesses}
            user2={userGuesses.user2.driversGuesses} />
          <ChampionshipTable title="Konstruktører" compName="Konstruktør" user1={userGuesses.user1.constructorsGuesses}
            user2={userGuesses.user2.constructorsGuesses} />
          <FlagTable user1={userGuesses.user1.flagGuesses} user2={userGuesses.user2.flagGuesses} />
          <DriverPlaceTable title="1.plass" user1={userGuesses.user1.winnerGuesses}
            user2={userGuesses.user2.winnerGuesses} />
          <DriverPlaceTable title="10.plass" user1={userGuesses.user1.tenthGuesses}
            user2={userGuesses.user2.tenthGuesses} />
        </div>
        : ''}
    </>
  )
}

export default Compare

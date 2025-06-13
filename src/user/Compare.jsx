import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { translateFlag } from '../util/translator';
import Table from '../util/Table';

function SummaryTable(props) {
  const { user1, user2 } = props;
  const header = ["Poeng", "Kategori", "Poeng"];
  const body = [
    {
      key: "drivers",
      values: [user1.drivers, "Sjåfører", user2.drivers]
    },
    {
      key: "constructors",
      values: [user1.constructors, "Konstruktører", user2.constructors]
    },
    {
      key: "flag",
      values: [user1.flag, "Antall", user2.flag]
    },
    {
      key: "winner",
      values: [user1.winner, "1.plass", user2.winner]
    },
    {
      key: "tenth",
      values: [user1.tenth, "10.plass", user2.tenth]
    },
    {
      key: "total",
      values: [user1.total, "Totalt", user2.total]
    },
  ];
  return <Table title="Oppsummering" header={header} body={body} />;
}

function ChampionshipTable(props) {
  const { title, compName, user1, user2 } = props
  const header = ["Poeng", "Gjettet", "Plass", compName, "Gjettet", "Poeng"];
  const body = user1.map((row, i) => ({
    key: row.competitor,
    values: [row.points,
    row.guessed !== null ? row.guessed : 'N/A',
    row.pos,
    row.competitor,
    user2[i].guessed !== null ? user2[i].guessed : 'N/A',
    user2[i].points]
  }));
  return <Table title={title} header={header} body={body} />;
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
  const header = ["Poeng", "Gjettet", "Faktisk", "Type", "Gjettet", "Poeng"];
  const body = user1.map((row, i) => ({
    key: row.flag,
    values: [row.points,
    row.guessed,
    row.actual,
    translateFlag(row.flag),
    user2[i].guessed,
    user2[i].points]
  }));
  return <Table title="Antall" header={header} body={body} />;
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
  const header = ["Poeng", "Plass", "Startet", "Gjettet", "Løp", "Gjettet", "Startet", "Plass", "Poeng"];
  const body = placeGuesses.map((row) => ({
    key: row.raceName,
    values: [row.points1,
    row.finishPos1,
    row.startPos1,
    row.driver1,
    row.raceName,
    row.driver2,
    row.startPos2,
    row.finishPos2,
    row.points2]
  }));
  return <Table title={title} header={header} body={body} />;
}

function Compare() {
  const [years, setYears] = useState(null);
  const [users, setUsers] = useState(null);

  const [selectedYear, setSelectedYear] = useState(null);
  const [user1, setUser1] = useState(null);
  const [user2, setUser2] = useState(null);

  const [userGuesses, setUserGuesses] = useState(null);

  const cacheRef = useRef({});

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

  async function loadUser(id) {
    const cache = cacheRef.current;
    if (cache[id]) {
      return cache[id];
    }
    let res = await axios.get(`/api/public/user/${id}`);
    cache[id] = res.data;
    return res.data;
  }

  async function loadData() {
    try {
      let user1Data = await loadUser(user1.id);
      let user2Data = await loadUser(user2.id);
      setUserGuesses({ user1: user1Data, user2: user2Data });
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (selectedYear == null || user1 == null || user2 == null) {
      return;
    }
    loadData();
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
      <title>{userGuesses ? `${user1.username} vs ${user2.username}` : 'Sammenlign brukere'}</title>
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

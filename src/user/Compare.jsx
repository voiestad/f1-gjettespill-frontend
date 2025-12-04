import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { translateFlag } from '../util/translator';
import Table from '../util/Table';
import RacePicker from './RacePicker';

function SummaryTable(props) {
  const { user1, user2 } = props;
  const header = ["Poeng", "Plassering", "Kategori", "Plassering", "Poeng"];
  const body = [
    {
      key: "drivers",
      values: [user1?.drivers.value, user1?.drivers.pos, "Sjåfører", user2?.drivers.pos, user2?.drivers.value]
    },
    {
      key: "constructors",
      values: [user1?.constructors.value, user1?.constructors.pos, "Konstruktører", user2?.constructors.pos, user2?.constructors.value]
    },
    {
      key: "flag",
      values: [user1?.flag.value, user1?.flag.pos, "Antall", user2?.flag.pos, user2?.flag.value]
    },
    {
      key: "first",
      values: [user1?.first.value, user1?.first.pos, "1. plass", user2?.first.pos, user2?.first.value]
    },
    {
      key: "tenth",
      values: [user1?.tenth.value, user1?.tenth.pos, "10. plass", user2?.tenth.pos, user2?.tenth.value]
    },
    {
      key: "total",
      values: [user1?.total.value, user1?.total.pos, "Totalt", user2?.total.pos, user2?.total.value]
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
    row.guessed,
    row.pos,
    row.competitor,
    user2[i].guessed,
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
          guessed: null,
          points: 0,
          actual: row.actual,
          flag: row.flag
        });
      }
    } else {
      for (let row of user2) {
        user1.push({
          guessed: null,
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
      finishPos1: null,
      finishPos2: null,
      startPos1: null,
      startPos2: null,
      driver1: null,
      driver2: null,
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
      row.racePos = user1[i].racePos;
      i++;
    }
    if (set2) {
      row.points2 = user2[j].points;
      row.finishPos2 = user2[j].finishPos;
      row.startPos2 = user2[j].startPos;
      row.driver2 = user2[j].driver;
      row.raceName = user2[j].raceName;
      row.racePos = user2[j].racePos;
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
    `${row.racePos}. ${row.raceName}`,
    row.driver2,
    row.startPos2,
    row.finishPos2,
    row.points2]
  }));
  return <Table title={title} header={header} body={body} />;
}

function QualifyingTable(props) {
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
      qualifyingPos1: null,
      qualifyingPos2: null,
      driver1: null,
      driver2: null,
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
      row.qualifyingPos1 = user1[i].qualifyingPos;
      row.driver1 = user1[i].driver;
      row.raceName = user1[i].raceName;
      row.racePos = user1[i].racePos;
      i++;
    }
    if (set2) {
      row.points2 = user2[j].points;
      row.qualifyingPos2 = user2[j].qualifyingPos;
      row.driver2 = user2[j].driver;
      row.raceName = user2[j].raceName;
      row.racePos = user2[j].racePos;
      j++;
    }
    placeGuesses.push(row);
  }
  const header = ["Poeng", "Plass", "Gjettet", "Løp", "Gjettet", "Plass", "Poeng"];
  const body = placeGuesses.map((row) => ({
    key: row.raceName,
    values: [row.points1,
    row.qualifyingPos1,
    row.driver1,
    `${row.racePos}. ${row.raceName}`,
    row.driver2,
    row.qualifyingPos2,
    row.points2]
  }));
  return <Table title={title} header={header} body={body} />;
}

function Compare() {
  const [users, setUsers] = useState(null);
  const [raceId, setRaceId] = useState(null);
  const [year, setYear] = useState(null);

  const [user1, setUser1] = useState(null);
  const [user2, setUser2] = useState(null);

  const [userGuesses, setUserGuesses] = useState(null);

  useEffect(() => {
    axios.get('/api/public/user/list')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  async function loadUser(id) {
    let res = await axios.get(`/api/public/user/${id}`, {
      params: {
        raceId: raceId,
        year: year
      }
    });
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
    if (user1 == null || user2 == null) {
      return;
    }
    loadData();
  }, [raceId, year, user1, user2]);

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
      <RacePicker setRaceId={setRaceId} raceId={raceId} setYear={setYear} />
      <form>
        <br />
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
          <ChampionshipTable title="Sjåfører" compName="Sjåfør" user1={userGuesses.user1.userScores.driversGuesses}
            user2={userGuesses.user2.userScores.driversGuesses} />
          <ChampionshipTable title="Konstruktører" compName="Konstruktør" user1={userGuesses.user1.userScores.constructorsGuesses}
            user2={userGuesses.user2.userScores.constructorsGuesses} />
          <FlagTable user1={userGuesses.user1.userScores.flagGuesses} user2={userGuesses.user2.userScores.flagGuesses} />
          <DriverPlaceTable title="1. plass" user1={userGuesses.user1.userScores.firstGuesses}
            user2={userGuesses.user2.userScores.firstGuesses} />
          <DriverPlaceTable title="10. plass" user1={userGuesses.user1.userScores.tenthGuesses}
            user2={userGuesses.user2.userScores.tenthGuesses} />
          <QualifyingTable title="Pole" user1={userGuesses.user1.userScores.poleGuesses}
            user2={userGuesses.user2.userScores.poleGuesses} />
        </div>
        : ''}
    </>
  )
}

export default Compare

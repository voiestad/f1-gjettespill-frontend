import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminBingomasters() {
  const [bingomasters, setBingomasters] = useState(null);
  const [users, setUsers] = useState(null);
  const [bingomasterCandidate, setBingomasterCandidate] = useState(null);
  function loadUsers() {
    axios.get('/api/public/user/list')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }

  function loadBingomasters() {
    axios.get('/api/admin/bingo/list')
      .then(res => setBingomasters(res.data))
      .catch(err => console.error(err));
  }

  function setAsBingomaster(event) {
    event.preventDefault();
    if (!bingomasterCandidate) {
      return;
    }
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/bingo/add', {},
          {
            params: {
              bingomaster: bingomasterCandidate
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            alert('Bingomaster ble satt');
            loadBingomasters();
          })
          .catch(err => {
            alert('Brukernavnet var feil');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  function removeBingomaster(event, bingomaster) {
    event.preventDefault();
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/admin/bingo/remove', {},
          {
            params: {
              bingomaster: bingomaster
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            alert('Bingomaster ble fjernet');
            loadBingomasters();
          })
          .catch(err => {
            alert('Brukernavnet var feil');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    loadUsers();
    loadBingomasters();
  }, []);
  return (
    <>
      <h2>Administrer bingomasters</h2>
      {bingomasters ?
        <>
          <h3>Bingomasters</h3>
          {bingomasters.map(bingomaster =>
            <form key={bingomaster.id}>
              <label>
                {bingomaster.username}
                <input type="submit" value="Fjern bingomaster" onClick={e => removeBingomaster(e, bingomaster.id)} />
              </label>
            </form>
          )}
        </>
        : ''}
      {users ?
        <>
          <h3>Legg til ny bingomaster</h3>
          <form>
            <select onChange={e => setBingomasterCandidate(e.target.value)}>
              <option value="">Velg bruker</option>
              {users.map(user =>
                <option key={user.id} value={user.id}>{user.username}</option>
              )}
            </select>
            <input type="submit" value="Sett som bingomaster" onClick={setAsBingomaster}/>
          </form>
        </>
        : ''}
    </>
  )
}

export default AdminBingomasters

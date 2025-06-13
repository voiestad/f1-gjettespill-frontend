import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

function UserList() {
  const [userList, setUserList] = useState(null);
  useEffect(() => {
    axios.get('/api/public/user/list')
    .then(res => setUserList(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <>
      <title>Brukere</title>
      <h2>Brukere</h2>
      <div className="linkList">
        {userList ?
          userList.map((user) =>
            <Link key={user.id} to={`/user/${user.id}`}>{user.username}</Link>
          )
          : ''}
      </div>
    </>
  )
}

export default UserList

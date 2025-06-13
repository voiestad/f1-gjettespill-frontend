import { Link } from 'react-router';

function AdminPortal() {
  return (
    <>
    <title>Admin portal</title>
    <h2>Admin portal</h2>
    <div className="linkList">
      <Link to="/admin/flag">Registrer flagg</Link>
      <Link to="/admin/season">Administrer sesonger</Link>
      <Link to="/admin/bingo">Administrer bingomasters</Link>
      <Link to="/admin/log">Logg</Link>
      <Link to="/admin/backup">Sikkerhetskopi</Link>
    </div>
    </>
  )
}

export default AdminPortal

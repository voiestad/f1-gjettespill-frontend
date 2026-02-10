import { Link } from 'react-router';

function Settings() {
  return (
    <>
      <title>Innstillinger</title>
      <h2>Innstillinger</h2>
      <div className="linkList">
        <Link to="/settings/info">Se brukerinformasjon</Link>
        <Link to="/settings/reminders">Påminnelser</Link>
        <Link to="/settings/username">Endre brukernavn</Link>
        <Link to="/settings/account">Konto</Link>
      </div>
    </>
  )
}

export default Settings

import { Link } from 'react-router';

function Settings() {
  return (
    <>
      <h2>Innstillinger</h2>
      <div className="linkList">
        <Link to="/settings/info">Se brukerinformasjon</Link>
        <Link to="/settings/mail">Påminnelser</Link>
        <Link to="/settings/referral">Inviter brukere</Link>
        <Link to="/settings/username">Endre brukernavn</Link>
        <Link to="/settings/delete">Slett bruker</Link>
      </div>
    </>
  )
}

export default Settings

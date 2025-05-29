import { Link } from 'react-router';

function ErrorNoUsername() {
  return (
    <>
      <h2>Du må ha laget et brukernavn for å bruke denne siden...</h2>
      <Link to="/settings/username">Velg brukernavn</Link>
    </>
  )
}

export default ErrorNoUsername

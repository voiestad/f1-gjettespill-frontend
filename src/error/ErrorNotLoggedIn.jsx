import { Link } from 'react-router';

function ErrorNotLoggedIn() {
  return (
    <>
      <h2>Du må være logget inn for å bruke denne siden...</h2>
      <Link to="/">Logg inn</Link>
    </>
  )
}

export default ErrorNotLoggedIn

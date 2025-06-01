import { Link } from 'react-router';

function ErrorNotAdmin() {
  return (
    <>
      <h2>Du trenger administrator tilgang for å bruke denne siden...</h2>
      <Link to="/">Tilbake til hjem</Link>
    </>
  )
}

export default ErrorNotAdmin

import { Link, useLocation } from 'react-router';

function ErrorNotLoggedIn() {
  const { pathname } = useLocation();
  function login() {
    localStorage.setItem("redirectAfterLogin", pathname);
    window.location.href = "/oauth2/authorization/google";
  }
  return (
    <>
      <h2>Du må være logget inn for å bruke denne siden...</h2>
      <Link onClick={login}>Logg inn</Link>
    </>
  )
}

export default ErrorNotLoggedIn

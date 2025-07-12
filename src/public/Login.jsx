import { useState } from 'react';

function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  function redirectToLogin() {
    const parameter = rememberMe ? "?remember_me" : "";
    window.location.href = `/oauth2/authorization/google${parameter}`;
  }
  return (
    <>
      <title>Innlogging</title>
      <h2>Innlogging</h2>
      <br />
      <label>
        Husk meg <input type="checkbox" onChange={() => setRememberMe((rememberMe) => !rememberMe)}/>
      </label>
      <br /><br />
      <button onClick={redirectToLogin}>Logg inn med Google</button>
    </>
  )
}

export default Login

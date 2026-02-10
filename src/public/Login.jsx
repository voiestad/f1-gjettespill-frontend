import { useState } from 'react';

function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  function redirectToLogin(provider) {
    const parameter = rememberMe ? "?remember_me" : "";
    window.location.href = `/api/oauth2/authorization/${provider}${parameter}`;
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
      <button onClick={() => redirectToLogin("google")}>Logg inn med Google</button>
      <button onClick={() => redirectToLogin("apple")}>Logg inn med Apple</button>
    </>
  )
}

export default Login

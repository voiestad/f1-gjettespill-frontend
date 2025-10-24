import { useEffect, createContext, useState } from 'react';
import axios from 'axios'

const CsrfTokenContext = createContext();

const CsrfTokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [headerName, setHeaderName] = useState(null);
  useEffect(() => {
    if (!token) {
      axios.get('/api/public/csrf-token')
        .then(res => {
          setHeaderName(res.data.headerName);
          setToken(res.data.token);
        })
        .catch(err => console.error(err));
    }
  }, [])

  return (
    <CsrfTokenContext.Provider
      value={{
        token,
        headerName
      }}
    >
      {children}
    </CsrfTokenContext.Provider>
  );
};

export { CsrfTokenContext, CsrfTokenProvider };

import Countdown from "./Countdown"
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import ChooseDriver from "./ChooseDriver";
import { useNavigate } from 'react-router';
import { ErrorGuessNotAllowedYet } from "../error";
import { CsrfTokenContext } from "../components";

function GuessTenth() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { token, headerName } = useContext(CsrfTokenContext);

  useEffect(() => {
    axios.get('/api/guess/tenth')
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error(err);
        setError(<ErrorGuessNotAllowedYet />);
      });
  }, []);

  function guessHandler(driver) {
    axios.post('/api/guess/tenth', {}, {
      params: {
        driver: driver
      },
      headers: {
        [headerName]: token
      }
    })
      .then(res => {
        alert('Gjetningen din ble lagret');
        navigate('/guess');
      })
      .catch(err => console.error(err));
  }

  return (
    <>
      <title>Gjett 10. plass</title>
      {data ?
        <>
          <h2>Gjett 10. plass i {data.race.name}</h2>
          <Countdown initialTimeLeft={data.timeLeft} />
          <ChooseDriver initialSelected={data.selected} drivers={data.competitors} guessHandler={guessHandler} />
        </>
        : ''}
      {error ? error : ''}
    </>
  )
}

export default GuessTenth

import Countdown from "./Countdown"
import axios from 'axios';
import { useEffect, useState } from 'react';
import ChooseDriver from "./ChooseDriver";
import { useNavigate } from 'react-router';
import { ErrorGuessNotAllowedYet } from "../error";

function GuessTenth() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

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
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/guess/tenth', {}, {
          params: {
            driver: driver
          },
          headers: {
            [headerName]: token
          }
        })
          .then(res => {
            alert('Tippingen din ble lagret');
            navigate('/guess');
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }

  return (
    <>
      <title>Tipp 10.plass</title>
      {data ?
        <>
          <h2>Tipp 10.plass i {data.race.name}</h2>
          <Countdown initialTimeLeft={data.timeLeft} />
          <ChooseDriver initialSelected={data.selected} drivers={data.competitors} guessHandler={guessHandler} />
        </>
        : ''}
      {error ? error : ''}
    </>
  )
}

export default GuessTenth

import Countdown from "./Countdown"
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import ChooseDriver from "./ChooseDriver";
import { useNavigate } from 'react-router-dom';
import { ErrorGuessingNotAvailableYet } from "../error";

function GuessWinner() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/guess/first')
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error(err);
        setError(<ErrorGuessingNotAvailableYet />);
      });
  }, []);

  function guessHandler(driver) {
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/guess/first', {}, {
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
      {data ?
        <>
          <h2>Tipp vinneren i {data.race.name}</h2>
          <Countdown initialTimeLeft={data.timeLeft} />
          <ChooseDriver initialSelected={data.selected} drivers={data.competitors} guessHandler={guessHandler} />
        </>
        : ''}
      {error ? <ErrorGuessingNotAvailableYet /> : ''}
    </>
  )
}

export default GuessWinner

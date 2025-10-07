import Countdown from "./Countdown"
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { ErrorGuessNotAllowedYet } from "../error";
import RankCompetitors from "./RankCompetitors";
import qs from 'qs';
import { CsrfTokenContext } from "../components";

function RankingDrivers() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { token, headerName } = useContext(CsrfTokenContext);

  useEffect(() => {
    axios.get('/api/guess/driver')
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error(err);
        setError(<ErrorGuessNotAllowedYet />);
      });
  }, []);

  function guessHandler(drivers) {
    axios.post('/api/guess/driver', {}, {
      params: {
        rankedCompetitors: drivers
      },
      headers: {
        [headerName]: token
      },
      paramsSerializer: (params => qs.stringify(params, { arrayFormat: 'repeat' }))
    })
      .then(res => {
        alert('Gjetningen din ble lagret');
        navigate('/guess');
      })
      .catch(err => console.error(err));
  }

  return (
    <>
      <title>Ranger sjåførene</title>
      {data ?
        <>
          <h2>Ranger sjåførene</h2>
          <Countdown initialTimeLeft={data.timeLeft} />
          <RankCompetitors initialCompetitors={data.competitors} guessHandler={guessHandler} />
        </>
        : ''}
      {error ? error : ''}
    </>
  )
}

export default RankingDrivers

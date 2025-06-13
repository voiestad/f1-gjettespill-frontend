import Countdown from "./Countdown"
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ErrorGuessingNotAvailableYet } from "../error";
import RankCompetitors from "./RankCompetitors";
import qs from 'qs';

function RankingDrivers() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/guess/driver')
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error(err);
        setError(<ErrorGuessingNotAvailableYet />);
      });
  }, []);

  function guessHandler(drivers) {

    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
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
            alert('Tippingen din ble lagret');
            navigate('/guess');
          })
          .catch(err => console.error(err));
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
      {error ? <ErrorGuessingNotAvailableYet /> : ''}
    </>
  )
}

export default RankingDrivers

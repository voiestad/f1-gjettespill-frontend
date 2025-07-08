import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Countdown from './Countdown';
import { ErrorGuessNotAllowedYet } from '../error';

function FlagSliders(props) {
  const { yellow: initialYellow, red: initialRed, safetyCar: initialSafetyCar } = props.flags;
  const navigate = useNavigate();
  const [yellow, setYellow] = useState(initialYellow);
  const [red, setRed] = useState(initialRed);
  const [safetyCar, setSafetyCar] = useState(initialSafetyCar);

  function guessHandler(event) {
    event.preventDefault();
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/guess/flag', {}, {
          params: {
            yellow: yellow,
            red: red,
            safetyCar: safetyCar
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
      <form>
        <label>Antall gule flagg<br />
          <input type="range" value={yellow} min={0} max={150} onChange={e => setYellow(e.target.value)} />
          <br />
          <div>{yellow}</div>
          <br /><br />
        </label>
        <label>Antall røde flagg<br />
          <input type="range" value={red} min={0} max={50} onChange={e => setRed(e.target.value)} />
          <br />
          <div>{red}</div>
          <br /><br />
        </label>
        <label>Antall sikkerhetsbiler<br />
          <input type="range" value={safetyCar} min={0} max={100} onChange={e => setSafetyCar(e.target.value)} /><br />
          <div>{safetyCar}</div><br /><br />
        </label>
        <input type="submit" value="Send inn gjett" onClick={guessHandler} />
      </form>
    </>
  )
}

function GuessFlags() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/guess/flag')
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error(err);
        setError(<ErrorGuessNotAllowedYet />);
      });
  }, []);

  return (
    <>
      <title>Tipp antall</title>
      {data ?
        <>
          <h2>Tipp antall</h2>
          <Countdown initialTimeLeft={data.timeLeft} />
          <FlagSliders flags={data.flags} />
        </>
        : ''}
      {error ? error : ''}
    </>
  )
}

export default GuessFlags

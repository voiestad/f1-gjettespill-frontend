import { useEffect, useState } from 'react';
import axios from 'axios';
import { ErrorGuessingNotAvailableYet, ErrorUnknown } from '../error';

function Table(props) {
  const { title, guesses } = props;

  return (
    <>
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Navn</th>
            <th>Tippet</th>
            <th>Startet</th>
          </tr>
        </thead>
        <tbody>
          {guesses.map((row) =>
            <tr key={row.user}>
              <td>{row.user}</td>
              <td>{row.driver}</td>
              <td>{row.position}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

function RaceGuess() {
  const [guesses, setGuesses] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/public/race-guess')
      .then(res => setGuesses(res.data))
      .catch(err => {
        if (err.status === 403) {
          setError(<ErrorGuessingNotAvailableYet />);
        } else {
          setError(<ErrorUnknown />);
        }
        console.error(err);
      });
  }, []);
  return (

    <>
      {guesses ?
        <>
          <h2>{guesses.name}</h2>
          <div className="tables">
            <Table guesses={guesses.first} title="1.plass" />
            <Table guesses={guesses.tenth} title="10.plass" />
          </div>
        </>
        : ''}
      {error ? error : ''}
    </>
  )
}

export default RaceGuess

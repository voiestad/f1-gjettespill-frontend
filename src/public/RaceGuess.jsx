import { useEffect, useState } from 'react';
import axios from 'axios';
import { ErrorGuessingNotAvailableYet, ErrorUnknown } from '../error';
import Table from '../util/Table';

function GuessesTable(props) {
  const { title, guesses } = props;
  const header = ["Navn", "Gjettet", "Startet"];
  const body = guesses.map((row) => ({
    key: row.username,
    values: [row.username, row.driver, row.position]
  }));
  return <Table title={title} header={header} body={body} />;
}

function QualifyingTable(props) {
  const { title, guesses } = props;
  const header = ["Navn", "Gjettet"];
  const body = guesses.map((row) => ({
    key: row.username,
    values: [row.username, row.driver]
  }));
  return <Table title={title} header={header} body={body} />;
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
          <title>{guesses.name}</title>
          <h2>{guesses.name}</h2>
          <div className="tables">
            {guesses.first ? <GuessesTable guesses={guesses.first} title="1. plass" /> : ''}
            {guesses.tenth ? <GuessesTable guesses={guesses.tenth} title="10. plass" /> : ''}
            {guesses.pole ? <QualifyingTable guesses={guesses.pole} title="Pole" /> : ''}
          </div>
        </>
        : <title>Gjettet på løp</title>}
      {error ? error : ''}
    </>
  )
}

export default RaceGuess

import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { translateCategory } from '../util/translator';
import { ErrorGuessNotAllowedYet, ErrorLoginNeedToGuess } from '../error';
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

function Guessing() {
  const [categories, setCategories] = useState(null);
  const [guesses, setGuesses] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    axios.get('/api/public/race-guess')
      .then(res => setGuesses(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    axios.get('/api/guess/categories')
      .then(res => {
        setCategories(res.data);
        setIsLoggedIn(true);
      })
      .catch(err => {
        if (err.status === 401) {
          setIsLoggedIn(false);
        }
        console.error(err);
      });
  }, []);

  return (
    <>
      <title>Gjetting</title>
      {isLoggedIn === false && <ErrorLoginNeedToGuess />}
      {categories && categories.length > 0 ?
        <>
          <h2>Gjetting - Velg kategori</h2>
          <div className="linkList">
            {categories.map(category =>
              <Link key={category} to={`/guess/${category.toLowerCase()}`}>{translateCategory(category)}</Link>
            )}
          </div>
        </>
        : null}
      {guesses ?
        <>
          <h2>{guesses.name}</h2>
          <div className="tables">
            {guesses.first ? <GuessesTable guesses={guesses.first} title="1. plass" /> : ''}
            {guesses.tenth ? <GuessesTable guesses={guesses.tenth} title="10. plass" /> : ''}
            {guesses.pole ? <QualifyingTable guesses={guesses.pole} title="Pole" /> : ''}
          </div>
        </>
        : null}
      {isLoggedIn && (!categories || categories.length === 0) && !guesses && <ErrorGuessNotAllowedYet />}
    </>
  );
}

export default Guessing

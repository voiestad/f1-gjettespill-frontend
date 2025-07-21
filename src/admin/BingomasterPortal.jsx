import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import axios from 'axios';
import { ErrorNotFound } from '../error';

export function BingomasterPortalChooseYear() {
  const [years, setYears] = useState(null);
  useEffect(() => {
    axios.get('/api/public/year/list')
      .then(res => setYears(res.data))
      .catch(err => console.error(err));
  }, []);
  return (
    <>
      <title>Administrer bingo</title>
      <h2>Administrer bingo</h2>
      <div className="linkList">
        {years ?
          years.map(year =>
            <Link key={year} to={`/bingo/admin/${year}`}>{year}</Link>
          ) : ''}
      </div>
    </>
  )
}

export function BingoMasterPortalChangeBingo() {
  const { year } = useParams();
  const [yearExist, setYearExist] = useState(null);
  const [bingoCard, setBingoCard] = useState(null);
  const [isBingoCard, setNoBingoCard] = useState(null);

  function loadBingoCard() {
    axios.get('/api/public/year/list')
      .then(res => {
        setYearExist(res.data.indexOf(parseInt(year)) != -1);
        if (res.data.indexOf(parseInt(year)) != -1) {
          axios.get(`/api/public/bingo/${year}`)
            .then(res => {
              setNoBingoCard(res.data.length !== 0);
              setBingoCard(res.data);
            })
            .catch(err => console.error(err));
        }
      })
      .catch(err => console.error(err));
  }

  function addBingo(event) {
    event.preventDefault();
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/bingomaster/add-card', {},
          {
            params: {
              year: year
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            loadBingoCard();
          })
          .catch(err => {
            alert('Kunne ikke legg til bingo');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  function updateSquare(event, id) {
    event.preventDefault();
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/bingomaster/set', {},
          {
            params: {
              year: year,
              id: id,
              text: new FormData(event.target).get('text')
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            const submitButton = event.target.getElementsByTagName('input')[0];
            submitButton.value = "Lagret!";
            setTimeout(() => submitButton.value = "Sett ny tekst", 1000);
          })
          .catch(err => {
            alert('Kunne ikke endre tekst på rute');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }
  
  function markSquare(event, id) {
    event.preventDefault();
    axios.get('/api/public/csrf-token')
      .then(res => {
        const headerName = res.data.headerName;
        const token = res.data.token;
        axios.post('/api/bingomaster/mark', {},
          {
            params: {
              year: year,
              id: id
            },
            headers: {
              [headerName]: token
            }
          })
          .then(res => {
            const bingoCardCopy = Array.of(... bingoCard);
            bingoCardCopy[id].marked = !bingoCardCopy[id].marked;
            setBingoCard(bingoCardCopy);
          })
          .catch(err => {
            alert('Kunne ikke endre markering på rute');
            console.error(err);
          })
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    loadBingoCard();
  }, []);
  return (
    <>
      {
        yearExist != null
          ? (yearExist ?
            <>
              <title>Bingo {year}</title>
              <h2>Bingo {year}</h2>
              {isBingoCard != null ?
                <>
                  {isBingoCard ?
                    bingoCard.map(square =>
                      <div key={square.id}>
                        <h3>{square.id + 1}</h3>
                        <form autoComplete="off" onSubmit={e => updateSquare(e, square.id)}>
                          <textarea defaultValue={square.text} placeholder="Rutetekst" name="text" rows="8" cols="20" />
                          <input type="submit" value="Sett ny tekst" />
                        </form>
                        <form>
                          <input type="submit" value={square.marked ? 'Fjern markering' : 'Marker'}
                          onClick={e => markSquare(e, square.id)} />
                        </form>
                      </div>
                    )
                    :
                    <form>
                      <input type="submit" value="Legg til bingo" onClick={addBingo} />
                    </form>}
                </>
                : ''}
            </>
            : <ErrorNotFound />)

          : ''
      }
    </>
  )
}

import axios from 'axios';
import { useEffect, useState } from 'react';
import { ErrorUnknown } from './';
import { Link } from 'react-router';

function BingoBoard(props) {
  const { bingoBoardData } = props;
  return (
    <>
      <h2>Bingo {bingoBoardData[0].year}</h2>
      <div className="bingo-container">
        <div className="bingo">
          {bingoBoardData.map(square =>
            <div key={square.id} className={square.marked ? 'marked' : ''}>{square.text}</div>
          )}
        </div>
      </div>
    </>
  )
}

function Bingo() {
  const [bingoBoardData, setBingoBoardData] = useState(null);
  const [error, setError] = useState(null);
  const [isBingoMaster, setIsBingoMaster] = useState(null);

  useEffect(() => {
    axios.get('/api/public/bingo')
      .then(res => setBingoBoardData(res.data))
      .catch(err => {
        if (err.status === 403) {
          setError(<p>Årets bingo er ikke tilgjenglig enda</p>);
        } else {
          console.error(err);
          setError(<ErrorUnknown />);
        }
      })
    axios.get('/api/bingomaster')
      .then(res => setIsBingoMaster(res.data))
      .catch(err => {
        if (err.status !== 401) {
          console.error(err);
        }
      })
  }, []);

  return (
    <>
      {bingoBoardData ? <BingoBoard bingoBoardData={bingoBoardData} /> : ''}
      {error ? error : ''}
      {isBingoMaster ? <Link to="/bingo/admin">Administrer bingo</Link> : ''}
    </>
  )
}

export default Bingo

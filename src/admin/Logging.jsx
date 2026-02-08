import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import axios from 'axios';

function capitalize(word) {
  return word[0].toUpperCase() + word.substring(1);
}

export function LogView() {
  const { logType, date } = useParams();
  const [content, setContent] = useState(null);

  useEffect(() => {
    axios.get('/api/admin/log/file', {
      params: {
        type: logType,
        date: date
      }
    }).then(res => setContent(res.data))
      .catch(err => {
        console.error(err);
        alert("Det oppstod en feil");
      });
  }, []);
  return (
    <>
      <title>{`${capitalize(logType)} log: ${date}`}</title>
      <h2>{capitalize(logType)} log: {date}</h2>
      <div className="log">
        <p>
          {content ? content : ''}
        </p>
      </div>
    </>
  )
}

export function LogChooseDate() {
  const { logType } = useParams();
  const [dates, setDates] = useState(null);

  useEffect(() => {
    axios.get('/api/admin/log/list', {
      params: {
        type: logType
      }
    }).then(res => setDates(res.data))
      .catch(err => {
        console.error(err);
        alert("Det oppstod en feil");
      });
  }, [logType]);
  return (
    <>
      <title>{capitalize(logType)}</title>
      <h2>{capitalize(logType)}</h2>
      <div className="linkList">
        {dates ?
          dates.map(date =>
            <Link key={date} to={`/admin/log/${logType}/${date}`}>{date}</Link>
          ) : ''}
      </div>
    </>
  )
}

export function LogChooseCategory() {
  return (
    <>
      <title>Logging</title>
      <h2>Logging</h2>
      <div className="linkList">
        <Link to="/admin/log/info">Info</Link>
        <Link to="/admin/log/error">Error</Link>
      </div>
    </>
  )
}

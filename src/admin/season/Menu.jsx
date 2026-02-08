import { Link, Outlet, useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { ErrorNotFound, ErrorUnknown } from '../../error';
import { CsrfTokenContext } from '../../components';

export function SeasonChooseYear() {
  const [years, setYears] = useState();
  useEffect(() => {
    axios.get('/api/public/year/list')
      .then(res => setYears(res.data))
      .catch(err => console.error(err));
  }, []);
  return (
    <>
      <title>Administrer sesonger</title>
      <h2>Administrer sesonger</h2>
      <div className="linkList">
        {years ?
          years.map(year =>
            <Link key={year} to={`/admin/season/${year}`}>{year}</Link>
          )
          : ''}
        <Link to="/admin/season/add">Legg til sesong</Link>
      </div>
    </>
  )
}

export function SeasonAdd() {
  const [year, setYear] = useState(null);
  const [loader, setLoader] = useState(false);
  const { token, headerName } = useContext(CsrfTokenContext);
  const navigate = useNavigate();

  function addSeason(event) {
    event.preventDefault();
    if (!year) {
      alert('År må være satt')
      return;
    }
    setLoader(true);
    axios.post('/api/admin/season/add', {}, {
      params: {
        year: year
      },
      headers: {
        [headerName]: token
      }
    })
      .then(res => {
        navigate('/admin/season');
      })
      .catch(err => {
        console.error(err);
        alert(err.response.data);
        setLoader(false);
      });
  }

  return (
    <>
      <title>Legg til sesong</title>
      {!loader ?
        <>
          <h2>Legg til sesong</h2>
          <form>
            <label>År<br />
              <input type="number" min="1" max="10000" pattern="[0-9]*" inputMode="numeric"
                onChange={e => setYear(e.target.value)} />
              <br />
            </label>
            <input type="submit" value="Legg til" onClick={addSeason} />
          </form>
        </>
        :
        <div className="loading-container">
          <div className="loading"></div>
          <p>Laster...</p>
        </div>
      }
    </>
  )
}

export function SeasonChooseCategory() {
  const { year } = useParams();

  return (
    <>
      <h2>{`Administrer ${year}`}</h2>
      <title>{`Administrer ${year}`}</title>
      <div className="linkList">
        <Link to={`/admin/season/${year}/manage`}>Endring av løp</Link>
        <Link to={`/admin/season/${year}/cutoff`}>Frister</Link>
        <Link to={`/admin/season/${year}/competitors`}>F1 deltakere</Link>
        <Link to={`/admin/season/${year}/points`}>Poengsystem</Link>
        <Link to={`/admin/season/${year}/results`}>Resultater</Link>
      </div>
    </>
  )
}

export function SeasonRoute() {
  const [content, setContent] = useState(null);
  const { year } = useParams();

  useEffect(() => {
    axios.get('/api/public/year/list')
      .then(res => {
        if (res.data.indexOf(parseInt(year)) == -1) {
          setContent(
            <>
              <title>F1 Gjettespill</title>
              <ErrorNotFound />
            </>
          );
        } else {
          setContent(<Outlet />);
        }
      })
      .catch(err => {
        console.error(err);
        setContent(
          <>
            <title>F1 Gjettespill</title>
            <ErrorUnknown />
          </>
        );
      });
  }, [])
  return (
    <>
      {content ? content : ''}
    </>
  )
}

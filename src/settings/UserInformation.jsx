import { useEffect, useState } from 'react';
import axios from 'axios';
import { translateFlag, translateCategory } from '../util/translator';

function SingleElementTable(props) {
  const { header, body } = props;
  return (
    <>
      <h3></h3>
      <table>
        <thead>
          <tr>
            <th>{header}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{body}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

function ChampionshipTable(props) {
  const { competitorName, competitors } = props;
  return (
    <>
      <h3>Tippet {competitorName.toLowerCase()}</h3>
      <table>
        <thead>
          <tr>
            <th>Plass</th>
            <th>{competitorName}</th>
            <th>År</th>
          </tr>
        </thead>
        <tbody>
          {competitors.map((row) =>
            <tr key={`${row.year}-${row.competitor}`}>
              <td>{row.position}</td>
              <td>{row.competitor}</td>
              <td>{row.year}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

function FlagTable(props) {
  const { flags } = props;
  return (
    <>
      <h3>Tippet antall</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Tippet</th>
            <th>År</th>
          </tr>
        </thead>
        <tbody>
          {flags
            .sort((a, b) => translateFlag(a.flag).localeCompare(translateFlag(b.flag)))
            .map((row) =>
              <tr key={`${row.year}-${row.flag}`}>
                <td>{translateFlag(row.flag)}</td>
                <td>{row.guessed}</td>
                <td>{row.year}</td>
              </tr>
            )}
        </tbody>
      </table>
    </>
  )
}

function PlaceGuessTable(props) {
  const { placeGuess } = props;
  return (
    <>
      <h3>Tippet løp</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Tippet</th>
            <th>Løp</th>
            <th>År</th>
          </tr>
        </thead>
        <tbody>
          {placeGuess.map((row) =>
              <tr key={`${row.year}-${row.category}-${row.raceName}`}>
                <td>{translateCategory(row.category)}</td>
                <td>{row.driver}</td>
                <td>{row.raceName}</td>
                <td>{row.year}</td>
              </tr>
            )}
        </tbody>
      </table>
    </>
  )
}

function NotifiedTable(props) {
  const { notifiedCount } = props;
  return (
    <>
      <h3>Påminnelser e-post</h3>
      <table>
        <thead>
          <tr>
            <th>Løp</th>
            <th>Antall påminnelser</th>
            <th>År</th>
          </tr>
        </thead>
        <tbody>
          {notifiedCount.map((row) =>
              <tr key={`${row.year}-${row.raceName}`}>
                <td>{row.raceName}</td>
                <td>{row.timesNotified}</td>
                <td>{row.year}</td>
              </tr>
            )}
        </tbody>
      </table>
    </>
  )
}

function EmailPreferenceTable(props) {
  const { preferences } = props;
  return (
    <>
      <h3>Preferanser påminnelser</h3>
      <table>
        <thead>
          <tr>
            <th>Timer før løp</th>
          </tr>
        </thead>
        <tbody>
          {preferences.map((preference) =>
              <tr key={preference}>
                <td>{preference}</td>
              </tr>
            )}
        </tbody>
      </table>
    </>
  )
}

function UserInformation() {
  const [info, setUserInfo] = useState(null);

  useEffect(() => {
    axios.get('/api/settings/info')
      .then(res => {
        console.log(res.data);
        setUserInfo(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <h2>Brukerinformasjon</h2>
      {info ?
        <div className="tables">
          <SingleElementTable header="Brukernavn" body={info.user.username} />
          <SingleElementTable header="Bruker-ID" body={info.user.id} />
          <SingleElementTable header="Google-ID" body={info.user.googleId} />
          <SingleElementTable header="E-post" body={info.email} />
          <ChampionshipTable competitorName="Sjåfør" competitors={info.driverGuess} />
          <ChampionshipTable competitorName="Konstruktør" competitors={info.constructorGuess} />
          <FlagTable flags={info.flagGuess} />
          <PlaceGuessTable placeGuess={info.placeGuess} />
          <NotifiedTable notifiedCount={info.notifiedCount} />
          <EmailPreferenceTable preferences={info.emailPreferences} />
        </div>
        : ''}
    </>
  )
}

export default UserInformation

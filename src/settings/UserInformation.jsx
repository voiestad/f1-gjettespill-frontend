import { useEffect, useState } from 'react';
import axios from 'axios';
import { translateFlag, translateCategory } from '../util/translator';
import Table from '../util/Table';

function ChampionshipTable(props) {
  const { competitorName, competitors } = props;
  const header = ["Plass", competitorName, "År"];
  const body = competitors.map((row) => ({
    key: `${row.year}-${row.competitor}`,
    values: [row.position, row.competitor, row.year]
  }));
  return <Table title={`Gjettet ${competitorName.toLowerCase()}`} header={header} body={body} />;
}

function FlagTable(props) {
  const header = ["Type", "Gjettet", "År"];
  const body = props.flags
    .sort((a, b) => translateFlag(a.flag).localeCompare(translateFlag(b.flag)))
    .map((row) => ({
      key: `${row.year}-${row.flag}`,
      values: [translateFlag(row.flag), row.guessed, row.year]
    }));
  return <Table title="Gjettet antall" header={header} body={body} />;
}

function PlaceGuessTable(props) {
  const header = ["Type", "Gjettet", "Løp", "År"];
  const body = props.placeGuess.map((row) => ({
    key: `${row.year}-${row.category}-${row.raceName}`,
    values: [translateCategory(row.category), row.driver, row.raceName, row.year]
  }));
  return <Table title="Gjettet løp" header={header} body={body} />;
}

function NotifiedTable(props) {
  const header = ["Løp", "Antall påminnelser", "År"];
  const body = props.notifiedCount.map((row) => ({
    key: `${row.year}-${row.raceName}`,
    values: [row.raceName, row.timesNotified, row.year]
  }));
  return <Table title="Påminnelser e-post" header={header} body={body} />;
}

function EmailPreferenceTable(props) {
  const header = ["Timer før løp"];
  const body = props.preferences.map((preference) => ({
    key: preference,
    values: [preference]
  }));
  return <Table title="Preferanser påminnelser" header={header} body={body} />;
}

function UserInformation() {
  const [info, setUserInfo] = useState(null);

  useEffect(() => {
    axios.get('/api/settings/info')
      .then(res => setUserInfo(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <title>Brukerinformasjon</title>
      <h2>Brukerinformasjon</h2>
      {info ?
        <div className="tables">
          <Table title="" header={["Brukernavn"]} body={[{ key: info.user.username, values: [info.user.username] }]} />
          <Table title="" header={["Bruker-ID"]} body={[{ key: info.user.id, values: [info.user.id] }]} />
          <Table title="" header={["Google-ID"]} body={[{ key: info.user.googleId, values: [info.user.googleId] }]} />
          <Table title="" header={["E-post"]} body={[{ key: info.email, values: [info.email] }]} />
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

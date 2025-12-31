import { Link } from 'react-router';
import Table from '../util/Table';

function Leaderboard(props) {
  const header = ["Plass", "Navn", "Poeng"];
  const body = props.leaderboard.map((row) => ({
    key: row.guesser.id,
    values: [row.rank,
    <Link to={`/user/${row.guesser.id}`}>{row.guesser.username}</Link>,
    row.guesser.points]
  }));
  return <Table title="Rangering" header={header} body={body} />;
}

export default Leaderboard

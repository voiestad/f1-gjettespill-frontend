import Table from "../util/Table";

function PlacementsTable(props) {
  const { previousPlacements } = props;
  const header = ["Plassering", "År"];
  const body = previousPlacements.map(row => ({ key: row.value, values: [row.pos, row.value] }));
  return <Table title="Tidligere plasseringer" header={header} body={body} />;
}

function MedalTable(props) {
  const { medals } = props;
  const header = ["Gull", "Sølv", "Bronse"];
  const body = [{ key: "row", values: [medals.gold, medals.silver, medals.bronze] }]
  return <Table title="Medaljer" header={header} body={body} />;
}

function Placements(props) {
  const { placements } = props;
  return (
    <>
      <h2>{placements.username}</h2>
      <div className="tables">
        <PlacementsTable previousPlacements={placements.previousPlacements} />
        <MedalTable medals={placements.medals} />
      </div>
    </>
  )
}

export default Placements

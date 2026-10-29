import { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { CsrfTokenContext } from "../../components";
import type { CutoffRace } from "../../types";

function SeasonCutoff() {
  const { year } = useParams();
  const [yearCutoff, setYearCutoff] = useState<string | null>(null);
  const [raceCutoffs, setRaceCutoffs] = useState<CutoffRace[] | null>(null);
  const { token, headerName } = useContext(CsrfTokenContext);

  const loadCutoffs = useCallback(() => {
    axios
      .get(`/api/admin/season/cutoff/list/${year}`)
      .then((res) => {
        setYearCutoff(res.data.cutoffYear);
        setRaceCutoffs(res.data.cutoffRaces);
      })
      .catch((err) => console.error(err));
  }, [year]);

  useEffect(() => {
    loadCutoffs();
  }, [loadCutoffs]);

  function updateCutoffYear(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const submitButton = form.getElementsByTagName("input")[1];

    axios
      .post(
        "/api/admin/season/cutoff/set/year",
        {},
        {
          params: {
            year: year,
            cutoff: new FormData(form).get("cutoff"),
          },
          headers: {
            [headerName]: token,
          },
        },
      )
      .then(() => {
        submitButton.value = "Lagret!";
        setTimeout(() => (submitButton.value = "Sett frist"), 1000);
      })
      .catch((err) => {
        alert("Kunne ikke lagre den nye fristen");
        console.error(err);
      });
  }

  function updateRaceCutoff(
    event: React.FormEvent<HTMLFormElement>,
    id: number,
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const submitButton = form.getElementsByTagName("input")[1];

    axios
      .post(
        "/api/admin/season/cutoff/set/race",
        {},
        {
          params: {
            id: id,
            cutoff: new FormData(event.currentTarget).get("cutoff"),
          },
          headers: {
            [headerName]: token,
          },
        },
      )
      .then(() => {
        submitButton.value = "Lagret!";
        setTimeout(() => (submitButton.value = "Sett frist"), 1000);
      })
      .catch((err) => {
        alert("Kunne ikke lagre den nye fristen");
        console.error(err);
      });
  }

  return (
    <>
      <title>{`Frister ${year}`}</title>
      <h2>{`Frister ${year}`}</h2>
      {yearCutoff ? (
        <form onSubmit={updateCutoffYear}>
          <label>
            {year} sesongen
            <br />
            <input
              type="datetime-local"
              defaultValue={yearCutoff}
              name="cutoff"
            />
            <input type="submit" value="Sett frist" />
          </label>
          <br />
          <br />
        </form>
      ) : (
        ""
      )}
      {raceCutoffs
        ? raceCutoffs.map((cutoff) => (
            <form
              key={cutoff.race.id}
              onSubmit={(e) => updateRaceCutoff(e, cutoff.race.id)}
            >
              <label>
                {cutoff.race.position} {cutoff.race.name} {cutoff.race.id}
                <br />
                <input
                  type="datetime-local"
                  defaultValue={cutoff.cutoff}
                  name="cutoff"
                />
                <input type="submit" value="Sett frist" />
              </label>
              <br />
              <br />
            </form>
          ))
        : ""}
    </>
  );
}

export default SeasonCutoff;

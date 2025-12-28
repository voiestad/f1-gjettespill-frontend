import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { CsrfTokenContext } from '../components';
import Table from '../util/Table';

function LeagueInvitations() {
  const [pending, setPending] = useState([]);
  const [sent, setSent] = useState([]);
  const { token, headerName } = useContext(CsrfTokenContext);
  const [inviteLeague, setInviteLeague] = useState("");
  const [leagues, setLeagues] = useState([]);
  const [users, setUsers] = useState([]);
  const [inviteUser, setInviteUser] = useState("");

  useEffect(() => {
    loadPending();
    loadSent();
    loadLeagues();
    axios.get('/api/public/user/list')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  function loadPending() {
    axios.get('/api/league/invitations/pending')
      .then(res => setPending(res.data))
      .catch(err => console.error(err));
  }

  function loadSent() {
    axios.get('/api/league/invitations/sent')
      .then(res => setSent(res.data))
      .catch(err => console.error(err));
  }

  function loadLeagues() {
    axios.get('/api/public/league/memberships')
      .then(res => setLeagues(res.data))
      .catch(err => console.error(err));
  }

  function accept(league) {
    axios.post("/api/league/join", {}, {
      params: {
        leagueId: league
      },
      headers: {
        [headerName]: token
      }
    }).then(res => {
      loadPending();
    }).catch(err => {
      console.error(err)
    })
  }

  function reject(inviter, league) {
    axios.delete("/api/league/reject", {
      params: {
        leagueId: league,
        inviter: inviter
      },
      headers: {
        [headerName]: token
      }
    }).then(res => {
      loadPending();
    }).catch(err => {
      console.error(err)
    })
  }

  function invite() {
    axios.put("/api/league/invite", {}, {
      params: {
        leagueId: inviteLeague,
        userId: inviteUser
      },
      headers: {
        [headerName]: token
      }
    }).then(res => {
      loadSent();
    }).catch(err => {
      console.error(err)
    })
  }

  function uninvite(invited, league) {
    axios.delete("/api/league/invite", {
      params: {
        leagueId: league,
        userId: invited
      },
      headers: {
        [headerName]: token
      }
    }).then(res => {
      loadSent();
    }).catch(err => {
      console.error(err)
    })
  }

  return (
    <>
      <title>Invitasjoner</title>
      <h2>Invitasjoner</h2>
      <div className="tables">
        <h3>Send invitasjoner</h3>
        <label>
          Liga<br />
          <select onChange={e => setInviteLeague(e.target.value)}>
            <option value="">Velg liga</option>
            {leagues.map(l =>
              <option key={l.leagueId} value={l.leagueId}>
                {l.leagueName}
              </option>)}
          </select>
        </label>
        <label>
          Bruker<br />
          <select onChange={e => setInviteUser(e.target.value)}>
            <option value="">Velg bruker</option>
            {users.map(u =>
              <option key={u.id} value={u.id}>
                {u.username}
              </option>)}
          </select>
        </label>
        <input type="submit" value="Send invitasjon" onClick={invite} />
        <Table title="Mottatte invitasjoner" header={["Avsender", "Liga", "Godta", "Avslå"]}
          body={pending.map((invitation) => ({
            key: `${invitation.inviter.id}-${invitation.league.leagueId}`,
            values: [
              invitation.inviter.username,
              invitation.league.leagueName,
              <input type="submit" value="&#x2713;" onClick={() => accept(invitation.league.leagueId)} />,
              <input type="submit" value="&#x10102;" onClick={() => reject(invitation.inviter.id, invitation.league.leagueId)} />]
          }))} />
        <Table title="Sendte invitasjoner" header={["Mottaker", "Liga", "Angre"]} body={sent.map((invitation) => ({
          key: `${invitation.invited.id}-${invitation.league.leagueId}`,
          values: [
            invitation.invited.username,
            invitation.league.leagueName,
            <input type="submit" value="&#128465;" onClick={() => uninvite(invitation.invited.id, invitation.league.leagueId)} />]
        }))} />
      </div>
    </>
  )
}

export default LeagueInvitations

import { Link, useParams } from 'react-router';
import { useEffect, useState } from 'react';

export function SeasonCompetitors() {
  const { year } = useParams();
  return (
    <>
      <h2>Deltakere {year}</h2>
      <div className="linkList">
        <Link to={`/admin/season/${year}/competitors/constructors`}>Konstruktører</Link>
        <Link to={`/admin/season/${year}/competitors/drivers`}>Sjåfører</Link>
        <Link to={`/admin/season/${year}/competitors/alias`}>Alternative navn</Link>
      </div>
    </>
  )
}

export function SeasonConstructors() {

}

export function SeasonDrivers() {

}

export function SeasonAlias() {

}

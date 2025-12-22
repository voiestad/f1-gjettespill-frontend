import { Link } from 'react-router';

function Contact() {
  return (
    <>
      <title>Kontakt</title>
      <h2>Kontakt</h2>
      <div className="paragraph">
        <p>
          Har du generelle spørsmål om nettsiden, oppdaget en feil, forslag til nye funksjoner
          eller endringer på nettsiden. Vennligst ta kontakt på epost:<br /><br />
          <a href="mailto:kontakt@f1gjettespill.no">kontakt@f1gjettespill.no</a>
          <br /><br /><br />
          Det er også mulig å melde inn feil og forslag ved å lage issues på GitHub:<br /><br />
          <Link to="https://github.com/voiestad/f1-gjettespill-backend/issues/new">Backend</Link><br />
          <Link to="https://github.com/voiestad/f1-gjettespill-frontend/issues/new">Frontend</Link>
        </p>
      </div>
    </>
  )
}

export default Contact

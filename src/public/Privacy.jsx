import { Link } from 'react-router';

function Privacy() {
  return (
    <>
      <title>Personvernerklæring</title>
      <h2>Personvernerklæring</h2>
      <div className="paragraph">
        <p>
          Dette er en personvernerklæring for F1 Gjettespill og gjelder for <Link to="/">f1gjettespill.no</Link>. Nettsiden
          styres av Vebjørn Øiestad og alle spørsmål angående nettsiden kan sendes inn via kontaktskjemaet <Link to="/contact">her</Link>.
        </p>
        <h3>Personopplysninger som samles inn</h3>
        <h4>Krevd</h4>
        <p>
          Google OpenID<br /><br />
          Brukernavn<br /><br />
          Gjetning<br /><br />
        </p>
        <h4>Valgfritt</h4>
        <p>
          E-post <Link to="#reminders">(med mer)</Link>
        </p>
        <h3>Bruksområder av personopplysninger</h3>
        <h4>Innlogging</h4>
        <p>
          Nettsiden bruker <Link to="https://developers.google.com/identity/protocols/oauth2">Google OAuth2</Link> for
          innlogging. <Link to="https://developers.google.com/identity/protocols/oauth2/scopes">"Scopet"</Link> som
          brukes er kun <Link to="https://en.wikipedia.org/wiki/OpenID">OpenID</Link>, som er definert som
          ikke-sensitiv av Google. Denne IDen er nødvendig for å koble innloggingen til brukeren din. IDen knyttes
          til en tilfeldig generert ID som brukes på resten av nettsiden og brukernavnet som du velger selv. For å
          redusere personlige opplysninger som er knyttet til brukeren, er det lurt å ikke oppgi fullt navn som
          brukernavn.
        </p>
        <h4 id="reminders">Påminnelser</h4>
        <p>
          Dersom du velger å melde deg på for å få påminnelser på e-post, vil e-posten kun brukes til å sende
          påminnelser og ingenting annet. Preferansene for når man ønsker påminnelser blir brukt til å sende
          påminnelser på riktig tidspunkt. I tillegg lagres det også hvor mange ganger en påminnelse blir sendt ut
          for hvert løp for å sende riktig antall påminnelser.
        </p>
        <h4>Gjettedata</h4>
        <p>
          Gjettedataen blir brukt til å regne ut en poengsum som blir brukt å rangere deltakerne etter hvor bra de
          har gjettet for å avgjøre vinneren hvert år.
        </p>
        <h4>Tredjeparter</h4>
        <p>
          Dataen som blir samlet inn vil aldri bli delt med tredjeparter.
        </p>
        <h3>Informasjonskapsler</h3>
        <p>
          Det brukes kun <Link to="https://en.wikipedia.org/wiki/Session_ID">"session ID token"</Link> som
          brukes for å knytte økten din opp mot innloggingen din.
        </p>
        <h3>Dine rettigheter</h3>
        <h4>Rett til innsyn</h4>
        <p>
          Hvis du ønsker innsyn i hva av dine personlige opplysninger som er lagret kan du se
          det <Link to="/settings/info">her</Link>.
        </p>
        <h4>Rett til korrigering</h4>
        <p>
          Brukernavnet ditt kan når som helst endres <Link to="/settings/username">her</Link>.
        </p>
        <h4>Rett til begrensning</h4>
        <p>
          E-post som er lagret for å sende påminnelser kan når som helst fjernes <Link to="/settings/mail">her</Link>.
          Når e-post blir fjernet vil også preferansene dine og antall påminnelser som er sendt ut fjernes.
        </p>
        <h4>Rett til sletting</h4>
        <p>
          Brukeren din kan når som helst slettes <Link to="/settings/delete">her</Link>. Da vil e-post bli fjernet,
          brukernavn anonymisert og OpenID fjernet. All gjettedataen vil forbli lagret for å bevare integriteten
          av statistikken, men dataen vil ikke lengre være tilknyttet dine personopplysinger på noe som helst vis.
        </p>
        <h4>Rett til å klage</h4>
        <p>
          Hvis du mener dine personlige opplysninger blir behandlet feil, kan du klage <Link to="/contact">her</Link>.
        </p>
      </div>
    </>
  )
}

export default Privacy

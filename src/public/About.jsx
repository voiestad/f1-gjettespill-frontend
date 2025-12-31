import { Link } from 'react-router';
import logo from '../assets/voiestad_logo.svg';

function About() {
  return (
    <>
      <title>Om F1 Gjettespill</title>
      <h2>Om F1 Gjettespill</h2>
      <div className="paragraph">
        <h3>Hva er F1 Gjettespill?</h3>
        <p>
          F1 Gjettespill går ut på at deltakerne gjetter på sluttresultatene av Formel 1 sesongen.
          I tillegg gjettes det på hvem som kommer på pole, førsteplass og tiendeplass i grand prix gjennom året.
          Vinneren for året er den som har flest poeng når sesongen er over.
        </p>
        <h3>Hvordan funker F1 Gjettespill?</h3>
        <p>
          Før hver sesong starter, gjetter man på hvordan man tror rekkefølgen i sjåførmesterskapet og
          konstruktørmesterskapet kommer til å ende, i tillegg til hvor mange gule flagg, røde flagg og
          sikkerhetsbiler (inkludert virtuelle sikkerthetsbiler) det kommer til å være i løpet av sesongen.
          Gjetningene kan endres så mye man ønsker frem til testingen som foregår før sesongen starter 
          (pre-season testing).<br /><br />
          Man kan også gjette på hvem man tror kommer på pole, første- og tiendeplass i hver grand prix. 
          Dette kan man gjøre fra startoppstillingen for løpet er klar frem til 1 time før løpet starter for tiendeplass.
          For pole og førsteplass er fristen tre døgn før fristen for tiendeplass. Her er det også mulig å endre
          på gjetningene sine så lenge det er mulig å gjette.<br /><br />
          Poengene man får blir beregnet basert på hvor langt unna gjetningen var det reelle resultatet. Hvordan
          poengene eksakt blir beregnet kan du se <Link to="/score">her</Link>.<br /><br />
          Vinneren er den som har flest poeng når sesongen er over.
        </p>
        <h3>Kommersielle aktiviteter</h3>
        <p>
          Nettsiden er kun ment for å ha det gøy. F1 Gjettespill driver ikke med kommersielle aktiviteter
          eller pengespill. Dette gjelder for nå og i fremtiden.
        </p>
        <h3>Ansvarsfraskrivelse</h3>
        <p>
          F1 Gjettespill er på ingen måte assosiert med Formel 1 og varemerket F1 tilhører Formula One Group.
        </p>
        <h3>Utvikler</h3>
        <p>
          Nettsiden er utviklet og styres av Vebjørn Øiestad. For henvendelser angående nettsiden ligger
          kontaktinformasjon <Link to="/contact">her</Link>.
        </p>
        <br />
        <p id="v-logo">
          <Link to="https://voiestad.no">
            <img src={logo} alt="" width="100" height="100" />
          </Link>
        </p>
      </div>
    </>
  )
}

export default About

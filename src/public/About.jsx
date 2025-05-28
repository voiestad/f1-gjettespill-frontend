import { Link } from 'react-router';
import logo from '../assets/logo.svg';

function About() {
  return (
    <>
      <h2>Om F1 Tipping</h2>
      <div className="paragraph">
        <h3>Hva er F1 Tipping?</h3>
        <p>
          F1 Tipping er en tippeside der deltakerne tipper på sluttresultatene av Formel 1 sesongen. I tillegg
          tippes det på hvem som kommer på første- og tiendeplass i hvert løp gjennom året.
        </p>
        <h3>Hvordan funker F1 Tipping?</h3>
        <p>
          Før hver sesong starter tipper man på hvordan man tror rekkefølgen i sjåførmesterskapet og
          konstruktørmesterskapet kommer til å ende, i tillegg til hvor mange gule flagg, røde flagg og
          sikkerhetsbiler (inkludert virtuelle sikkerthetsbiler) det kommer til å være i løpet av sesongen.
          Tippingene kan endres så mye man ønsker frem til testingen før sesongen starter.<br /><br />
          Man kan også tippe på hvem man tror kommer på første- og tiendeplass i hvert løp. Dette kan man gjøre
          fra resultatene av kvalifiseringen er klar frem til løpet starter. Her er det også mulig å endre på
          tippingene sine helt frem til løpet starter.<br /><br />
          Poengene man får blir beregnet basert på hvor langt unna tippingen var det reelle resultatet. Hvordan
          poengene eksakt blir beregnet kan du se <Link to="/score">her</Link>.<br /><br />
          Vinneren er den som har flest poeng når sesongen er over.
        </p>
        <h3>Utvikler</h3>
        <p>
          Nettsiden er utviklet og styres av Vebjørn Øiestad. Henvendelser angående nettsiden kan sendes inn via
          kontaktskjemaet <Link to="/contact">her</Link>.
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

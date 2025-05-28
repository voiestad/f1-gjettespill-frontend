import { Link } from 'react-router';

function Footer() {
  return (
    <>
      <footer>
        <p><Link to="/about">Om siden</Link></p>
        <p><Link to="https://github.com/Vebb02/f1">GitHub</Link></p>
        <p><Link to="/contact">Kontakt</Link></p>
        <p><Link to="/privacy">Personvernerklæring</Link></p>
      </footer>
    </>
  )
}

export default Footer

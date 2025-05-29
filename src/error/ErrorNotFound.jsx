import { Link } from 'react-router';

function ErrorNotFound() {
  return (
    <>
      <h2>Beklager, vi kunne ikke finne siden du lette etter...</h2>
		<p>
			Hvis du mener det er en feil, vennligst meld det inn <Link to="/contact">her</Link>.
		</p>
		<Link to="/">Tilbake til hjem</Link>
    </>
  )
}

export default ErrorNotFound

import { Link } from 'react-router';

function ErrorUnknown() {
  return (
    <>
      <h2>Det oppstod en ukjent feil...</h2>
		<p>
			Hvis feilen vedvarer, vennligst meld det inn <Link to="/contact">her</Link>.
		</p>
		<Link to="/">Tilbake til hjem</Link>
    </>
  )
}

export default ErrorUnknown

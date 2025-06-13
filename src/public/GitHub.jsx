import { Link } from 'react-router';

function GitHub() {
  return (
    <>
      <title>GitHub</title>
      <h2>GitHub</h2>
      <div className="linkList">
        <Link to="https://github.com/Vebb02/f1">Backend</Link>
        <Link to="https://github.com/Vebb02/f1-front-end">Frontend</Link>
      </div>
    </>
  )
}

export default GitHub

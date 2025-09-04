import { Link } from 'react-router';

function GitHub() {
  return (
    <>
      <title>GitHub</title>
      <h2>GitHub</h2>
      <div className="linkList">
        <Link to="https://github.com/voiestad/f1-gjettespill-backend">Backend</Link>
        <Link to="https://github.com/voiestad/f1-gjettespill-frontend">Frontend</Link>
      </div>
    </>
  )
}

export default GitHub

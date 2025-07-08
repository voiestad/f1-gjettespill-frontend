import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { translateCategory } from '../util/translator';
import { ErrorGuessNotAllowedYet } from '../error';

function GuessChooseCategory() {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    axios.get('/api/guess/categories')
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => console.error(err))
  }, []);

  return (
    <>
      <title>Tipping - Velg kategori</title>
      {categories && categories.length > 0 ?
        <>
          <h2>Tipping - Velg kategori</h2>
          <div className="linkList">
            {categories.map(category =>
              <Link key={category} to={`/guess/${category.toLowerCase()}`}>{translateCategory(category)}</Link>
            )}
          </div>
        </>
        : ''}
      {categories && categories.length === 0 ? <ErrorGuessNotAllowedYet /> : ''}
    </>
  )
}

export default GuessChooseCategory

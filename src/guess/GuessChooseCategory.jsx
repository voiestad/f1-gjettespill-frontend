import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { translateCategory } from '../util/translator';
import { ErrorGuessingNotAvailableYet } from '../error';

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
      <h2>Velg kategori</h2>
      <div className="linkList">
        {categories ?
          (categories.length > 0 ? categories.map(category =>
            <Link key={category} to={`/guess/${category.toLowerCase()}`}>{translateCategory(category)}</Link>
          )
            : <ErrorGuessingNotAvailableYet />)
          : ''}
      </div>
    </>
  )
}

export default GuessChooseCategory

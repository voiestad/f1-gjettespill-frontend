import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import Footer from './Footer.jsx'
import Header from './Header.jsx'

function App() {
  const [score, setScore] = useState("temp")

  useEffect(() => {
    axios.get('http://localhost:8080/api/public/score')
      .then(res => setScore(res.data))
      .catch(err => console.error(err));
  }, [])
  return (
    <>
      <Header />
      <main>
        <p>{JSON.stringify(score)}</p>
      </main>
      <Footer />
    </>
  )
}

export default App

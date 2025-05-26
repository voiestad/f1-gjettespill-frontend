import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import Footer from './Footer.jsx'
import Header from './Header.jsx'

function App() {
  const [score, setScore] = useState("temp")

  useEffect(() => {
    axios.get('/api/public/header')
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

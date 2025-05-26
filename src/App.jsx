import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
import Home from './Home.jsx'

function App() {
  return (
    <>
      <Header />
      <main>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
          </Routes>
        </BrowserRouter>
      </main>
      <Footer />
    </>
  )
}

export default App

import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
import Home from './Home.jsx'

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route index element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App

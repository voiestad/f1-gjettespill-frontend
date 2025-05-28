import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
import Home from './Home.jsx'
import Error from './Error.jsx'

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" >
              <Route index element={<Home />}/>
              <Route path="*" element={<Error />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App

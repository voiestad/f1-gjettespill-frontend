import { BrowserRouter, Routes, Route } from "react-router";
import './App.css';
import { About, Contact, Error, Footer, Header, Home, LoggedIn, Privacy } from './public';
import { MyProfile, User, UserList } from './user'
import { ScrollToTop } from './components';

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <main>
          <Routes>
            <Route path="/" >
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="logged-in" element={<LoggedIn />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="user">
                <Route index element={<UserList />} />
                <Route path="myprofile" element={<MyProfile />} />
                <Route path=":id" element={<User />} />
              </Route>
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

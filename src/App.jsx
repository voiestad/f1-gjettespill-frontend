import { BrowserRouter, Routes, Route } from "react-router";
import './App.css';
import { About, Bingo, Contact, Footer, Header, Home, LoggedIn, Privacy, Score } from './public';
import { Settings, Username } from './settings';
import { ErrorNotFound } from './error';
import { MyProfile, User, UserList } from './user'
import { ProtectedRoute, ScrollToTop } from './components';

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
              <Route path="bingo" element={<Bingo />} />
              <Route path="contact" element={<Contact />} />
              <Route path="logged-in" element={<LoggedIn />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="settings">
                <Route path="username" element={<Username />} />
              </Route>
              <Route path="score" element={<Score />} />
              <Route path="user">
                <Route index element={<UserList />} />
                <Route path=":id" element={<User />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="settings">
                  <Route index element={<Settings />} />
                </Route>
                <Route path="user">
                  <Route path="myprofile" element={<MyProfile />} />
                </Route>
              </Route>
              <Route path="*" element={<ErrorNotFound />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App

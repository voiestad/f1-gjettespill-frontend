import { BrowserRouter, Routes, Route } from 'react-router';
import { lazy } from 'react';
import './App.css';
import {
  About,
  Bingo,
  Contact,
  Footer,
  GitHub,
  Header,
  Home,
  LoggedIn,
  Login,
  Privacy,
  RaceGuess,
  Score,
  StatsChooseRace,
  StatsChooseYear,
  StatsRace
} from './public';
import { ErrorNotFound } from './error';
import { Compare, MyProfile, User, UserList } from './user'
import { BingomasterRoute, ProtectedRoute, ScrollToTop } from './components';
import { BingoMasterPortalChangeBingo, BingomasterPortalChooseYear } from './admin/BingomasterPortal';
import { CreateLeague } from './league';

const AdminRoute = lazy(() => import('./admin/AdminRoute'));
const SettingsRoute = lazy(() => import('./settings/SettingsRoute'));
const GuessRoute = lazy(() => import('./guess/GuessRoute'));

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
              <Route path="github" element={<GitHub />} />
              <Route path="logged-in" element={<LoggedIn />} />
              <Route path="login" element={<Login />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="race-guess" element={<RaceGuess />} />
              <Route path="score" element={<Score />} />
              <Route path="stats">
                <Route index element={<StatsChooseYear />} />
                <Route path=":year">
                  <Route index element={<StatsChooseRace />} />
                  <Route path=":raceId" element={<StatsRace />} />
                </Route>
              </Route>
              <Route path="user">
                <Route index element={<UserList />} />
                <Route path=":id" element={<User />} />
                <Route path="compare" element={<Compare />} />
              </Route>
              <Route path="settings/*" element={<SettingsRoute />} />
              <Route element={<ProtectedRoute />}>
                <Route path="admin/*" element={<AdminRoute />} />
                <Route path="bingo">
                  <Route path="admin" element={<BingomasterRoute />}>
                    <Route index element={<BingomasterPortalChooseYear />} />
                    <Route path=":year" element={<BingoMasterPortalChangeBingo />} />
                  </Route>
                </Route>
                <Route path="guess/*" element={<GuessRoute />} />
                <Route path="league">
                  <Route path="add" element={<CreateLeague />} />
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

import { BrowserRouter, Routes, Route } from "react-router";
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
  Privacy,
  RaceGuess,
  Score,
  StatsChooseRace,
  StatsChooseYear,
  StatsRace
} from './public';
import {
  DeleteAccount,
  Mail,
  ReferralCode,
  Settings,
  UserInformation,
  Username,
  VerificationCode
} from './settings';
import { ErrorNotFound } from './error';
import { Compare, MyProfile, User, UserList } from './user'
import { ProtectedRoute, ScrollToTop } from './components';
import {
  GuessChooseCategory,
  GuessWinner,
  GuessFlags,
  GuessTenth,
  RankingConstructors,
  RankingDrivers
} from "./guess";
import {
  AdminBingomasters,
  AdminPortal,
  Backup,
  FlagChooseRace,
  FlagChooseYear,
  FlagRegister,
  LogChooseCategory,
  LogChooseDate,
  LogView,
  SeasonAdd,
  SeasonChooseCategory,
  SeasonChooseYear
} from './admin';
import AdminRoute from "./components/AdminRoute";

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
              <Route path="privacy" element={<Privacy />} />
              <Route path="race-guess" element={<RaceGuess />} />
              <Route path="settings">
                <Route path="username" element={<Username />} />
              </Route>
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

              <Route element={<ProtectedRoute />}>
                <Route path="admin" element={<AdminRoute />}>
                  <Route index element={<AdminPortal />} />
                  <Route path="backup" element={<Backup />} />
                  <Route path="bingo" element={<AdminBingomasters />} />
                  <Route path="flag">
                    <Route index element={<FlagChooseYear />} />
                    <Route path=":year">
                      <Route index element={<FlagChooseRace />} />
                      <Route path=":raceId" element={<FlagRegister />} />
                    </Route>
                  </Route>
                  <Route path="log">
                    <Route index element={<LogChooseCategory />} />
                    <Route path=":logType">
                      <Route index element={<LogChooseDate />} />
                      <Route path=":date" element={<LogView />} />
                    </Route>
                  </Route>
                  <Route path="season">
                    <Route index element={<SeasonChooseYear />} />
                    <Route path="add" element={<SeasonAdd />} />
                    <Route path=":year">
                      <Route index element={<SeasonChooseCategory />} />
                      <Route path="manage">
                        <Route index />
                        <Route path=":raceId" />
                      </Route>
                      <Route path="cutoff" />
                      <Route path="competitors">
                        <Route index />
                        <Route path="constructors" />
                        <Route path="drivers" />
                        <Route path="alias" />
                      </Route>
                      <Route path="points" />
                    </Route>
                  </Route>
                </Route>
                <Route path="guess">
                  <Route index element={<GuessChooseCategory />} />
                  <Route path="driver" element={<RankingDrivers />} />
                  <Route path="constructor" element={<RankingConstructors />} />
                  <Route path="flag" element={<GuessFlags />} />
                  <Route path="tenth" element={<GuessTenth />} />
                  <Route path="first" element={<GuessWinner />} />
                </Route>
                <Route path="settings">
                  <Route index element={<Settings />} />
                  <Route path="delete" element={<DeleteAccount />} />
                  <Route path="info" element={<UserInformation />} />
                  <Route path="mail">
                    <Route index element={<Mail />} />
                    <Route path="verification" element={<VerificationCode />} />
                  </Route>
                  <Route path="referral" element={<ReferralCode />} />
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

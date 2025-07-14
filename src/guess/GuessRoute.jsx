import { Routes, Route } from 'react-router';
import {
  GuessChooseCategory,
  GuessWinner,
  GuessFlags,
  GuessTenth,
  RankingConstructors,
  RankingDrivers
} from "./";
function GuessRoute() {
  return (
    <>
      <Routes>
        <Route index element={<GuessChooseCategory />} />
        <Route path="driver" element={<RankingDrivers />} />
        <Route path="constructor" element={<RankingConstructors />} />
        <Route path="flag" element={<GuessFlags />} />
        <Route path="tenth" element={<GuessTenth />} />
        <Route path="first" element={<GuessWinner />} />
      </Routes>
    </>
  )
}

export default GuessRoute

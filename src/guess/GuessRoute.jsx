import { Routes, Route } from 'react-router';
import {
  GuessChooseCategory,
  GuessDriver,
  GuessFlags,
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
        <Route path="tenth" element={<GuessDriver title="Gjett 10.plass" category="tenth" />} />
        <Route path="first" element={<GuessDriver title="Gjett 1. plass" category="first" />} />
        <Route path="pole" element={<GuessDriver title="Gjett pole" category="pole" />} />
      </Routes>
    </>
  )
}

export default GuessRoute

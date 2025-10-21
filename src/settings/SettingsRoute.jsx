import { Routes, Route } from 'react-router';
import {
  DeleteAccount,
  ReferralCode,
  Reminders,
  Settings,
  UserInformation,
  Username
} from './';
import { ProtectedRoute } from '../components';

function SettingsRoute() {

  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route index element={<Settings />} />
          <Route path="delete" element={<DeleteAccount />} />
          <Route path="info" element={<UserInformation />} />
          <Route path="referral" element={<ReferralCode />} />
          <Route path="reminders" element={<Reminders />} />
        </Route>
        <Route path="username" element={<Username />} />

      </Routes>
    </>
  )
}

export default SettingsRoute

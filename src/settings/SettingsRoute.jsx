import { Routes, Route } from 'react-router';
import {
  DeleteAccount,
  Mail,
  ReferralCode,
  Settings,
  UserInformation,
  Username,
  VerificationCode
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
          <Route path="mail">
            <Route index element={<Mail />} />
            <Route path="verification" element={<VerificationCode />} />
          </Route>
          <Route path="referral" element={<ReferralCode />} />
        </Route>
        <Route path="username" element={<Username />} />

      </Routes>
    </>
  )
}

export default SettingsRoute


import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import PublicProfile from "./pages/PublicUserPage"
import UserLogin from "./pages/UserLogin"
import UserDashboard from "./pages/UserDashboard"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import NotFound from "./pages/NotFound"
import GetInfo from "./pages/GetInfo"
import SuccessPage from "./pages/SuccessPage"


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/user" element={<UserLogin />} />
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/:slug" element={<PublicProfile />} />
      <Route path="/getinfo" element={<GetInfo />} />
      <Route path="/payment-success" element={<SuccessPage />} />
      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

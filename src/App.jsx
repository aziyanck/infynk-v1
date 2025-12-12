import React, { Suspense, lazy } from 'react';
import { Routes, Route } from "react-router-dom";
import { ThreeDot } from 'react-loading-indicators';
import LandingPage from "./pages/LandingPage";

// Lazy Load Pages
const PublicProfile = lazy(() => import("./pages/PublicUserPage"));
const UserLogin = lazy(() => import("./pages/UserLogin"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const GetInfo = lazy(() => import("./pages/GetInfo"));
const SuccessPage = lazy(() => import("./pages/SuccessPage"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/legal/CookiePolicy"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));

const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
    <ThreeDot variant="pulsate" color="#3194cc" size="large" text="" textColor="" />
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <main className="min-h-screen"> 
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user" element={<UserLogin />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/:slug" element={<PublicProfile />} />
          <Route path="/getinfo" element={<GetInfo />} />
          <Route path="/payment-success" element={<SuccessPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Suspense>
  )
}
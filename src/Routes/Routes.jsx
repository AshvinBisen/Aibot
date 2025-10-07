import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";   // ✅ Navigate import kiya
import Login from "../Pages/Auther/Login";
import Signup from "../Pages/Auther/Signup";
import ForgotPassword from "../Pages/Auther/ForgotPassword";
import ResetPassword from "../Pages/Auther/ResetPassword";

import Dashboard from "../Pages/UserDashboardPages/Dashboard";
import WalletManagement from "../Pages/UserDashboardPages/WalletManagement";
import BotWallet from "../Pages/UserDashboardPages/BotWallet";
import TrendSettings from "../Pages/UserDashboardPages/TrendSettings";
import TradeHistory from "../Pages/UserDashboardPages/TradeHistory";
import LastBalance from "../Pages/UserDashboardPages/LastBalance";
import Topups from "../Pages/UserDashboardPages/Topups";
import Setting from "../Pages/UserDashboardPages/Settings";

import Profile from "../Pages/Profile/ProfileView";         
import ProfileEdit from "../Pages/Profile/ProfileEdit"; 

import AuthLayout from "../Layouts/AuthLayout";
import DashboardLayout from "../Layouts/DashboardLayout";
import ProtectedRoute from "../Components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ✅ Root par redirect kare login page par */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 🔑 Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* 📊 Dashboard Pages (Protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} /> 
        <Route path="wallet-management" element={<WalletManagement />} />
         <Route path="bot-wallet" element={<BotWallet />} />
        <Route path="trend-settings" element={<TrendSettings />} /> 
        <Route path="trade-history" element={<TradeHistory />} /> 
        <Route path="last-balance" element={<LastBalance />} />
        <Route path="top-ups" element={<Topups />} />
        <Route path="setting" element={<Setting />} /> 

        {/* 👤 Profile Routes */}
        <Route path="profile" element={<Profile />} /> 
        <Route path="profile/edit" element={<ProfileEdit />} /> 
      </Route>
    </Routes>
  );
};

export default AppRoutes;

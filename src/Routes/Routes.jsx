import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../Pages/Auther/Login";
import Signup from "../Pages/Auther/Signup";
import ForgotPassword from "../Pages/Auther/ForgotPassword";
import ResetPassword from "../Pages/Auther/ResetPassword";

import Dashboard from "../Pages/UserDashboardPages/Dashboard";
import WalletManagement from "../Pages/UserDashboardPages/WalletManagement";
import TrendSettings from "../Pages/UserDashboardPages/TrendSettings";
import TradeHistory from "../Pages/UserDashboardPages/TradeHistory";

import Profile from "../Pages/Profile/ProfileView";         
import ProfileEdit from "../Pages/Profile/ProfileEdit"; 

import AuthLayout from "../Layouts/AuthLayout";
import DashboardLayout from "../Layouts/DashboardLayout";
import ProtectedRoute from "../Components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
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
        <Route path="trend-settings" element={<TrendSettings />} /> 
        <Route path="trade-history" element={<TradeHistory />} /> 

        {/* 👤 Profile Routes */}
        <Route path="profile" element={<Profile />} /> 
        <Route path="profile/edit" element={<ProfileEdit />} /> 
      </Route>
    </Routes>
  );
};

export default AppRoutes;

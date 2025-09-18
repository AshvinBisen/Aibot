import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="auth-layout bg-black text-white min-h-screen flex items-center justify-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;

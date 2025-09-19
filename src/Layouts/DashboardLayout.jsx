// src/Layouts/DashboardLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

const DashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex w-full relative h-screen bg-[#000]">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        toggleSidebar={() => setIsMobileOpen(!isMobileOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        {/* <Navbar toggleSidebar={() => setIsMobileOpen(!isMobileOpen)} /> */}

        {/* Outlet */}
        <main className="flex-1 p-2 md:p-3 lg:p-4 overflow-y-auto ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

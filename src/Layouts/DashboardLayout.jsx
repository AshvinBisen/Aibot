


import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

const DashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex relative min-h-screen bg-[#000] text-white w-full">
      {/* Sidebar */}
      <div className="h-screen sticky top-0 overflow-hidden z-70">
        <Sidebar
          isMobileOpen={isMobileOpen}
          toggleSidebar={() => setIsMobileOpen(!isMobileOpen)}
        />
      </div>
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out w-full max-w-full">
        {/* Navbar */}
        <Navbar toggleSidebar={() => setIsMobileOpen(!isMobileOpen)} />

        {/* Main Content Wrapper */}
        <main className="flex-1 w-full p-3 md:p-5 mt-[60px] md:mt-0 overflow-y-auto max-w-full">
          {/* Responsive scroll wrapper for child pages */}
          <div className="w-full max-w-full overflow-x-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

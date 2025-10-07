// src/Components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaThLarge,
  FaWallet,
  FaChartLine,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaBalanceScale } from "react-icons/fa";
import { FaCog, FaTools, FaWrench, FaSlidersH } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { CgArrowsExchange } from "react-icons/cg";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import botLogo from "../assets/logo.png";

const Sidebar = ({ isMobileOpen, toggleSidebar }) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  // Auto collapse for screen < 1200px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Dashboard", icon: <FaThLarge />, path: "/dashboard" },
    { name: "Trade History", icon: <FaHistory />, path: "/dashboard/trade-history" },
    { name: "Wallet Management", icon: <FaWallet />, path: "/dashboard/wallet-management" },
    { name: "Last Balance", icon: <FaBalanceScale />, path: "/dashboard/last-balance" },
    { name: "Trend Settings", icon: <FaChartLine />, path: "/dashboard/trend-settings" },
    { name: "Top-ups", icon: <FaTools />, path: "/dashboard/top-ups" },
    // { name: "Setting", icon: <FaCog />, path: "/dashboard/setting" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`fixed md:static top-0 left-0 h-screen bg-[#070707be] text-white flex flex-col shadow-xl border-r border-white
      transition-transform duration-300 z-40
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      ${isExpanded ? "w-56" : "w-22"}`}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/20">
        <div className="flex items-center gap-2">
          <img src={botLogo} alt="Bot Logo" className="w-8 h-8" />
          {isExpanded && (
            <h1 className="text-[16px] font-extrabold tracking-widest bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
              Volume Bot
            </h1>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hidden md:block text-gray-400 hover:text-green-400 transition-transform duration-300"
        >
          {isExpanded ? (
            <MdOutlineKeyboardDoubleArrowLeft size={26} />
          ) : (
            <MdOutlineKeyboardDoubleArrowRight size={26} />
          )}
        </button>
        {/* Mobile Close Button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-white"
        >
          ✖
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-6 flex flex-col gap-3 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={toggleSidebar}
            className={`group flex items-center rounded-lg transition-all duration-300 relative
              ${isExpanded ? "gap-3 px-2 py-2" : "justify-center p-2"}
              ${isActive(item.path)
                ? "bg-gradient-to-br from-gray-900 to-black border text-white shadow-lg scale-[1.02]"
                : "hover:bg-gradient-to-br from-gray-900 to-black  text-white/95 hover:text-white"
              }`}
          >
            <span
              className={`text-lg transition-transform duration-300 group-hover:scale-110
                ${isActive(item.path) ? "text-white" : "text-white/80"}`}
            >
              {item.icon}
            </span>
            {isExpanded && (
              <span className="font-medium tracking-wide transition-all duration-300 group-hover:translate-x-1">
                {item.name}
              </span>
            )}
          </Link>

         
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/30">
        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-600 text-white hover:opacity-90 transition-all duration-300"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          <FaSignOutAlt />
          {isExpanded && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

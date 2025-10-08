import React, { useState } from "react";
import { Link } from "react-router-dom"; // useNavigate remove
import { FiUser, FiEdit2, FiLogOut } from "react-icons/fi";
import { RiWallet3Fill } from "react-icons/ri";
import { SiCoinbase } from "react-icons/si";
import { FaGhost, FaFirefoxBrowser } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import userAvatar from "../assets/logo.png"; 

export default function Navbar({
  userName = "Volume bot",
  // userAvatar = "https://i.pravatar.cc/40",
  toggleSidebar,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user"); // ya aapka token key
    // Close menu
    setIsMenuOpen(false);
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-[#0a0a0a] px-4 lg:h-16 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* <button onClick={toggleSidebar} className="md:hidden text-white text-2xl">
            <HiMenuAlt2 />
          </button>
          <div className="hidden md:block w-full max-w-xs md:max-w-[16rem] lg:max-w-[22rem] relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg bg-[#010101] border border-white/80 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
            </svg>
          </div> */}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Wallet Button */}
          {/* <button
            onClick={() => setIsWalletOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-md bg-[#3b82f6] text-white hover:bg-blue-600 h-9 px-3 text-sm font-medium"
          >
            <RiWallet3Fill className="h-4 w-4" />
            <span className="hidden lg:block">Connect Wallet</span>
          </button> */}

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center gap-2 rounded-md hover:bg-[#1a1a1a] h-9 px-3 text-sm font-medium text-white"
            >
              <img
                src={userAvatar}
                alt="profile"
                className="w-6 h-6 rounded-full border"
              />
              <span className="hidden md:inline">{userName}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 transition ${isMenuOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#000000] rounded-lg shadow-xl border border-white/80 overflow-hidden z-40">
                <div className="px-4 py-2 border-b border-white/80 font-semibold text-white">
                  My Account
                </div>
                {/* <Link
                  to="/dashboard/profile"
                  className="flex items-center px-4 py-2 text-sm text-white hover:bg-[#2b2a2a] gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="w-4 h-4" /> My Profile
                </Link>
                <Link
                  to="/dashboard/profile/edit"
                  className="flex items-center px-4 py-2 text-sm text-white hover:bg-[#2b2a2a] gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiEdit2 className="w-4 h-4" /> Edit Profile
                </Link> */}
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-red-600 gap-2"
                  onClick={handleLogout} // Updated logout
                >
                  <FiLogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Wallet Modal */}
      {isWalletOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-[#000000] border border-white/90 rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button onClick={() => setIsWalletOpen(false)} className="absolute top-4 right-4 text-white hover:text-white">
              ✖
            </button>
            <h2 className="text-lg font-semibold text-white">Connect Wallet</h2>
            <p className="text-sm text-white mb-4">
              Choose a wallet provider to connect to your account and start trading
            </p>

            <div className="grid gap-3">
              {[
                { name: "MetaMask", desc: "Connect using browser wallet", icon: <FaFirefoxBrowser className="w-10 h-10 text-orange-500" /> },
                { name: "WalletConnect", desc: "Connect using WalletConnect", icon: <RiWallet3Fill className="w-10 h-10 text-blue-500" /> },
                { name: "Coinbase Wallet", desc: "Connect using Coinbase Wallet", icon: <SiCoinbase className="w-10 h-10 text-sky-400" /> },
                { name: "Phantom", desc: "Connect using Phantom wallet", icon: <FaGhost className="w-10 h-10 text-purple-500" /> },
              ].map((wallet, i) => (
                <button
                  key={i}
                  className="flex items-center gap-4 p-4 border border-white/90 rounded-md hover:bg-black transition"
                  onClick={() => {
                    alert(`${wallet.name} connect functionality 🚀`);
                    setIsWalletOpen(false);
                  }}
                >
                  {wallet.icon}
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-white">{wallet.name}</span>
                    <span className="text-xs text-white/90">{wallet.desc}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-white mt-4">
              By connecting a wallet, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      )}
    </>
  );
}


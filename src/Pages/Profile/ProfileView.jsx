import React, { useState } from "react";
import { MdContentCopy, MdEdit, MdLock } from "react-icons/md";
import defaultAvatar from "../../assets/logo.png"; // replace with bot logo default

const UserProfile = () => {
  const [user, setUser] = useState({
    username: "JohnDoe",
    role: "User",
    fullName: "John Doe",
    email: "john.doe@example.com",
    emailVerified: true,
    phone: "+91-XXXX-XXXX",
    wallet: "0x1234567890abcdef...",
    twoFA: true,
    lastLogin: { ip: "192.168.1.1", time: "2025-09-18 17:00" },
    passwordChanged: "2025-08-10",
    recentLogins: [
      { device: "Chrome - Windows", location: "India", time: "2025-09-18 16:30" },
      { device: "Firefox - Mac", location: "India", time: "2025-09-17 14:20" },
      { device: "Edge - Windows", location: "US", time: "2025-09-16 10:15" },
    ],
    totalTrades: 120,
    portfolioGrowth: 25.5,
  });

  const copyWallet = () => {
    navigator.clipboard.writeText(user.wallet);
    alert("Wallet address copied!");
  };

  return (
    <div className="p-6 space-y-8 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 bg-gray-900 rounded-2xl p-4 shadow-md">
        <img
          src={defaultAvatar}
          alt="Avatar"
          className="w-16 h-16 rounded-full border-2 border-green-400"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-gray-400 text-sm">{user.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-3">
          <h2 className="text-xl font-bold mb-3">Personal Information</h2>
          <p><span className="text-gray-400">Full Name:</span> {user.fullName}</p>
          <p>
            <span className="text-gray-400">Email:</span> {user.email}{" "}
            {user.emailVerified ? (
              <span className="text-green-400 font-semibold text-xs bg-gray-800 px-2 py-1 rounded-full ml-2">
                Verified
              </span>
            ) : (
              <span className="text-red-400 font-semibold text-xs bg-gray-800 px-2 py-1 rounded-full ml-2">
                Not Verified
              </span>
            )}
          </p>
          <p><span className="text-gray-400">Phone:</span> {user.phone}</p>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Wallet:</span>
            <span className="font-mono">{user.wallet}</span>
            <button
              onClick={copyWallet}
              className="p-1 bg-green-500 hover:bg-green-600 rounded-full text-sm"
            >
              <MdContentCopy />
            </button>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <button className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-xl text-sm font-semibold">
              <MdEdit /> Edit Profile
            </button>
            <button className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-xl text-sm font-semibold">
              <MdLock /> Change Password
            </button>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-3">
          <h2 className="text-xl font-bold mb-3">Account Security</h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">2FA Status:</span>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user.twoFA}
                readOnly
                className="hidden"
              />
              <span className={`w-11 h-6 flex items-center bg-gray-700 rounded-full p-1 transition-colors ${
                user.twoFA ? "bg-green-500" : "bg-gray-700"
              }`}>
                <span
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    user.twoFA ? "translate-x-5" : ""
                  }`}
                />
              </span>
            </label>
          </div>
          <p><span className="text-gray-400">Last Login:</span> {user.lastLogin.time} ({user.lastLogin.ip})</p>
          <p><span className="text-gray-400">Password Last Changed:</span> {user.passwordChanged}</p>
        </div>

        {/* Activity Overview Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-3">
          <h2 className="text-xl font-bold mb-3">Activity Overview</h2>
          <div>
            <h3 className="text-gray-400 font-medium mb-1">Recent Logins</h3>
            {user.recentLogins.slice(0, 5).map((login, idx) => (
              <p key={idx} className="text-sm">
                {login.time} - {login.device} ({login.location})
              </p>
            ))}
          </div>
          <div className="mt-3">
            <h3 className="text-gray-400 font-medium mb-1">Quick Stats</h3>
            <p>Total Trades Executed: <span className="font-semibold">{user.totalTrades}</span></p>
            <p>Portfolio Growth: <span className="font-semibold">{user.portfolioGrowth}%</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

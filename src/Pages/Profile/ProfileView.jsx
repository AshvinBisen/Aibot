// src/Pages/Profile/ProfileView.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdContentCopy, MdEdit } from "react-icons/md";

const ProfileView = () => {
  const [user] = useState({
    profilePic: "https://via.placeholder.com/150",
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+91 98765 43210",
    walletAddress: "0x123...abc",
    verified: true,
    enable2FA: true,
    loginAlerts: true,
  });

  return (
    <div className="p-6 sm:p-8 lg:p-12 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <Link
          to="/dashboard/profile/edit"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl font-semibold shadow-md transition-all"
        >
          <MdEdit /> Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Personal Info */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">Personal Information</h2>

          {/* Profile Pic */}
          <div className="flex flex-col items-center mb-4">
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-green-400 mb-2 object-cover"
            />
            <p className="text-lg font-semibold text-white">{user.fullName}</p>
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <p className="text-white font-medium">
              {user.email}{" "}
              {user.verified && (
                <span className="text-xs text-green-400 ml-2">(Verified)</span>
              )}
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Phone</label>
            <p className="text-white font-medium">{user.phone}</p>
          </div>

          {/* Wallet */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Wallet Address</label>
            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 p-3 rounded-xl text-green-400 font-mono">
              {user.walletAddress}
              <MdContentCopy
                className="cursor-pointer hover:text-white"
                onClick={() => {
                  navigator.clipboard.writeText(user.walletAddress);
                  alert("Wallet address copied!");
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: Security Settings */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">Security Settings</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-medium">Two-Factor Authentication</span>
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  user.enable2FA ? "bg-green-600 text-white" : "bg-gray-600 text-white"
                }`}
              >
                {user.enable2FA ? "Enabled" : "Disabled"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-medium">Login Alerts</span>
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  user.loginAlerts ? "bg-green-600 text-white" : "bg-gray-600 text-white"
                }`}
              >
                {user.loginAlerts ? "On" : "Off"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;

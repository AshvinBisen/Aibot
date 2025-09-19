// src/Pages/Profile/ProfileEdit.jsx
import React, { useState } from "react";
import { MdContentCopy, MdUpload, MdCancel, MdSave, MdLock } from "react-icons/md";

const ProfileEdit = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [walletAddress] = useState("0x123...abc"); // read-only
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [enable2FA, setEnable2FA] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // Profile picture preview
  const handlePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = () => {
    alert("Profile updated successfully!");
    // TODO: Integrate POST /profile/update
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    // TODO: Integrate POST /profile/change-password
  };

  const handleCancel = () => {
    // Reset to original values or navigate back
    alert("Changes cancelled!");
  };

  return (
    <div className="p-6 sm:p-8 lg:p-12 space-y-8">
      <h1 className="text-3xl font-bold text-white">Edit Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Personal Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Personal Information</h2>

            {/* Profile Pic */}
            <div className="flex flex-col items-center mb-4">
              <img
                src={preview || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-green-400 mb-2 object-cover"
              />
              <label className="flex items-center gap-2 cursor-pointer text-green-400 font-semibold">
                <MdUpload size={20} /> Upload New Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePicChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Full Name */}
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-1 block">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-400 outline-none"
              />
              <span className="text-xs text-green-400 mt-1 inline-block">Verified</span>
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-1 block">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>

            {/* Wallet Address */}
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-1 block">Wallet Address</label>
              <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 p-3 rounded-xl text-green-400 font-mono">
                {walletAddress}
                <MdContentCopy
                  className="cursor-pointer hover:text-white"
                  onClick={() => {
                    navigator.clipboard.writeText(walletAddress);
                    alert("Wallet address copied!");
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Security & Password */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Security Settings</h2>

            {/* Password */}
            <div className="space-y-3 mb-4">
              <label className="text-gray-400 text-sm block">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-400 outline-none"
              />

              <label className="text-gray-400 text-sm block">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-400 outline-none"
              />

              <label className="text-gray-400 text-sm block">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-400 outline-none"
              />

              <button
                onClick={handleChangePassword}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold mt-2 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MdLock /> Change Password
              </button>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={enable2FA}
                  onChange={() => setEnable2FA(!enable2FA)}
                  className="w-6 h-6 accent-green-400"
                />
                <label className="text-gray-400 font-medium">Enable 2FA</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={loginAlerts}
                  onChange={() => setLoginAlerts(!loginAlerts)}
                  className="w-6 h-6 accent-green-400"
                />
                <label className="text-gray-400 font-medium">Login Alerts (Email)</label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSaveProfile}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MdSave /> Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MdCancel /> Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;

// src/Pages/Dashboard/Profile.jsx
import React from "react";

const Profile = () => {
  const user = {
    name: "John Cena",
    email: "john@example.com",
    phone: "+91 9876543210",
    joined: "Jan 2024",
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center p-6">
      <div className="bg-gray-900 w-full max-w-md p-8 rounded-2xl shadow-lg text-center">
        <img
          src="https://i.pravatar.cc/100"
          alt="profile"
          className="w-24 h-24 mx-auto rounded-full border-4 border-gray-700"
        />
        <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
        <p className="text-gray-400">{user.email}</p>
        <p className="text-gray-400">{user.phone}</p>
        <p className="mt-2 text-sm text-gray-500">Joined: {user.joined}</p>

        <button className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import logo from "../../assets/logo.png";
import botImage from "../../assets/bg_logo.jpg";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // Page open/refresh hone par fields reset
  useEffect(() => {
    setNewPassword("");
    setConfirmPassword("");
  }, []);

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }

    if (!validatePassword(newPassword)) {
      toast.error(
        "Password must be at least 8 chars with 1 uppercase, 1 number & 1 special char."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    toast.success("Password updated successfully ✅", { duration: 2500 });

    setTimeout(() => {
      navigate("/login"); // 2.5s ke baad login page pe redirect
    }, 2500);
  };

  return (
    <div className="min-h-screen w-full bg-[#060D12] flex justify-center">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex w-full min-h-screen flex-col-reverse lg:flex-row overflow-hidden">
        {/* Left Side */}
        <div className="flex-1 bg-black/40 relative hidden sm:block">
          <img
            src={botImage}
            alt="Volume Bot"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] via-transparent to-transparent"></div>
        </div>

        {/* Right Side */}
        <div className="flex-1 relative flex items-center justify-center py-10 px-4 sm:px-6 md:px-10 bg-gradient-to-br from-[#071016]/70 to-[#0b0b0f]/60">
          <div className="absolute -top-10 -right-6 w-[300px] h-[200px] rounded-full bg-gradient-to-br from-[#18ffd6] to-[#2b7cff] opacity-30 blur-2xl pointer-events-none mix-blend-screen"></div>

          <div className="relative z-10 max-w-[500px] w-full px-6 md:px-10 py-8 rounded-[24px] md:rounded-[32px] shadow-2xl border border-white backdrop-blur-xl">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Bot logo" className="w-14 h-14 md:w-16 md:h-16" />
            </div>

            <h1 className="text-2xl md:text-4xl font-semibold text-white text-center">
              Reset Password
            </h1>
            <p className="text-center text-base md:text-lg text-[#FFF] mt-2 mb-6">
              Enter your new password below
            </p>

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              {/* New Password */}
              <div className="px-2 md:px-4 py-2 md:py-3">
                <label className="text-base md:text-[20px] text-[#00f0c2] block mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    autoComplete="off"
                    className="w-full text-white outline-none bg-[#0b0f12]/60 
                              border border-white/60 hover:border-white 
                              rounded-xl px-3 py-2 md:px-4 md:py-3 
                              text-sm md:text-base pr-10"
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 
                              cursor-pointer text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff size={20} />
                    ) : (
                      <HiOutlineEye size={20} />
                    )}
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="px-2 md:px-4 py-2 md:py-3">
                <label className="text-base md:text-[20px] text-[#00f0c2] block mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    autoComplete="off"
                    className="w-full text-white outline-none bg-[#0b0f12]/60 
                              border border-white/60 hover:border-white 
                              rounded-xl px-3 py-2 md:px-4 md:py-3 
                              text-sm md:text-base pr-10"
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 
                              cursor-pointer text-white"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? (
                      <HiOutlineEyeOff size={20} />
                    ) : (
                      <HiOutlineEye size={20} />
                    )}
                  </span>
                </div>
              </div>


              <button
                type="submit"
                className="w-[160px] md:w-[180px] mt-4 py-2 md:py-3 mx-auto rounded-xl bg-gradient-to-r from-[#00f0c2] to-[#5ad8ff] text-black font-bold shadow-2xl flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base"
              >
                Reset Password <FaArrowRight />
              </button>
            </form>

            <p className="text-center text-xs md:text-sm text-gray-400 mt-6">
              Back to{" "}
              <a href="/login" className="text-teal-300 hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

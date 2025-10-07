import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import logo from "../../assets/logo.png";
import botImage from "../../assets/bg_logo.jpg";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showAdminPasscode, setShowAdminPasscode] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // ✅ Validate fields
    if (!email.trim() || !password.trim() || !adminPasscode.trim()) {
      toast.error("Please fill in all fields ❌");
      return;
    }

    setLoading(true);

    try {
      // ✅ API request
      const response = await axios.post("https://volumebot.furfoori.com/api/signup", {
        email,
        password,
        role: "user",
        adminPasscode,
      });

      if (response.data.success) {
        toast.success("Account created successfully 🎉");

        // ✅ Reset form
        setEmail("");
        setPassword("");
        setAdminPasscode("");

        // ✅ Redirect to login page
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error("Signup failed ❌");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error("Email already exists ❌");
      } else {
        toast.error("Something went wrong. Please try again ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#060D12]">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex w-full min-h-full overflow-hidden flex-col-reverse lg:flex-row gap-5">
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
        <div className="flex-1 relative py-5 p-2 xs:p-4 sm:p-6 md:p-10 bg-gradient-to-br from-[#071016]/70 to-[#0b0b0f]/60">
          <div className="absolute -top-10 -right-6 w-[300px] h-[200px] rounded-full bg-gradient-to-br from-[#18ffd6] to-[#2b7cff] opacity-30 blur-2xl pointer-events-none mix-blend-screen"></div>

          <div className="relative z-10 w-full max-w-[95%] md:max-w-[90%] mx-auto px-6 md:px-10 py-6 rounded-[24px] md:rounded-[32px] shadow-2xl border border-white backdrop-blur-xl">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Bot logo" className="w-14 h-14 md:w-16 md:h-16" />
            </div>

            <h1 className="text-2xl md:text-4xl font-semibold text-white text-center">
              Create Account
            </h1>
            <p className="text-center text-base md:text-lg text-[#FFF] mt-2 mb-6">
              Sign up with Admin Access
            </p>

            <form onSubmit={handleSignUp} className="space-y-4" autoComplete="off">
              {/* Email */}
              <div className="px-2 md:px-4 py-2 md:py-3">
                <label className="text-base md:text-[20px] text-[#00f0c2] block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mail@gmail.com"
                  className="w-full text-white outline-none bg-[#0b0f12]/60 border border-white/60 hover:border-white rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative px-2 md:px-4 py-2 md:py-3">
                <label className="text-base md:text-[20px] text-[#00f0c2] block mb-1">
                  Password
                </label>
                <div className="flex items-center bg-[#0b0f12]/60 border border-white/60 hover:border-white rounded-xl px-3 py-2 md:px-4 md:py-3">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent text-white outline-none text-sm md:text-[16px]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="ml-3 text-gray-300"
                  >
                    {showPwd ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>

              {/* Admin Passcode */}
              <div className="relative px-2 md:px-4 py-2 md:py-3">
                <label className="text-base md:text-[20px] text-[#00f0c2] block mb-1">
                  Admin Passcode
                </label>
                <div className="flex items-center bg-[#0b0f12]/60 border border-white/60 hover:border-white rounded-xl px-3 py-2 md:px-4 md:py-3">
                  <input
                    type={showAdminPasscode ? "text" : "password"}
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    placeholder="Enter Admin Code"
                    className="flex-1 bg-transparent text-white outline-none text-sm md:text-[16px]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPasscode((s) => !s)}
                    className="ml-3 text-gray-300"
                  >
                    {showAdminPasscode ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`w-[120px] mt-4 py-2 md:py-3 m-auto rounded-xl bg-gradient-to-r from-[#00f0c2] to-[#5ad8ff] text-black font-bold shadow-2xl flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Signing..." : "Sign up"} <FaArrowRight />
              </button>
            </form>

            <p className="text-center text-xs md:text-sm text-gray-400 mt-6">
              Already have an account?{" "}
              <a href="/login" className="text-teal-300 hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;



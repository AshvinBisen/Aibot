import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../Hooks/useAuth";
import { FaArrowRight } from "react-icons/fa";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import logo from "../../assets/logo.png";
import botImage from "../../assets/bg_logo.jpg";

const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Auto redirect if user is already logged in
  useEffect(() => {
    if (user?.token) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://volumebot.furfoori.com/api/login",
        { email, password }
      );

      if (response.data?.success) {
        const userData = {
          token: response.data.data.token,
          email: response.data.data.email,
          role: response.data.data.role,
        };

        login(userData); // ✅ Save in AuthContext & localStorage
        toast.success("Login successful! 🎉", { duration: 2000 });

        // ✅ Redirect to dashboard after 1.5s
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setError(response.data?.message || "Login failed ❌");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#060D12]">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex w-full min-h-screen flex-col-reverse lg:flex-row gap-5">
        {/* Left side image */}
        <div className="flex-1 bg-black/40 relative hidden sm:block">
          <img src={botImage} alt="AI Bot" className="w-full h-full object-cover opacity-90" />
        </div>

        {/* Right side form */}
        <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 md:px-10 bg-gradient-to-br from-[#071016]/70 to-[#0b0b0f]/60">
          <div className="relative z-10 w-full max-w-[500px] px-6 md:px-10 py-8 rounded-[24px] md:rounded-[32px] shadow-2xl border border-white backdrop-blur-xl">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Bot logo" className="w-14 h-14 md:w-16 md:h-16" />
            </div>
            <h1 className="text-2xl md:text-4xl font-semibold text-white text-center">Welcome back</h1>
            <p className="text-center text-base md:text-lg text-[#FFF] mt-2 mb-6">
              Sign in to access your Volume Bot dashboard
            </p>

            {error && <div className="mb-4 p-3 text-red-800 bg-red-100 rounded-lg text-center">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
              {/* Email */}
              <div className="px-2 md:px-4 py-2 md:py-3">
                <label className="text-base md:text-[20px] text-[#00f0c2] block mb-2">Email</label>
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
                <label className="text-base md:text-[20px] text-[#00f0c2] block mb-1">Password</label>
                <div className="flex items-center bg-[#0b0f12]/60 border border-white/60 hover:border-white rounded-xl px-3 py-2 md:px-4 md:py-3">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent text-white outline-none text-sm md:text-[16px]"
                    required
                  />
                  <button type="button" onClick={() => setShowPwd((s) => !s)} className="ml-3 text-gray-300">
                    {showPwd ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-[160px] md:w-[180px] mt-4 py-2 md:py-3 mx-auto rounded-xl bg-gradient-to-r from-[#00f0c2] to-[#5ad8ff] text-black font-bold flex items-center justify-center gap-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Signing..." : "Sign in"} <FaArrowRight />
              </button>
            </form>

            <p className="text-center text-xs md:text-sm text-gray-400 mt-6">
              Don't have an account? <a href="/signup" className="text-teal-300 hover:underline">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;



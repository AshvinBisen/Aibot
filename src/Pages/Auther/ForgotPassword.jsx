import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import logo from "../../assets/logo.png";
import botImage from "../../assets/bg_logo.jpg";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = email, 2 = otp
  const navigate = useNavigate();

  // 🔄 Page open/refresh hone par fields reset
  useEffect(() => {
    setEmail("");
    setOtp("");
    setStep(1);
  }, []);

  // ✅ Step 1: Send OTP
  const handleSendOTP = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email!");
      return;
    }

    // 🔹 Backend API call yaha karna hai
    toast.success("OTP sent to your email 📩", { duration: 2500 });

    setStep(2); // Email successful → OTP step par move
  };

  // ✅ Step 2: Verify OTP
  const handleVerifyOTP = (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP!");
      return;
    }

    // 🔹 Yaha OTP check karna hai (API ke through)
    if (otp === "1234") {
      toast.success("OTP verified ✅ Redirecting...", { duration: 2000 });

      setTimeout(() => {
        navigate("/reset-password"); // Reset Password Page
      }, 2000);
    } else {
      toast.error("Invalid OTP!");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#060D12] flex justify-center">
      {/* ✅ Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex w-full  flex-col-reverse lg:flex-row overflow-hidden">
        {/* Left Side */}
        <div className="flex-1 bg-black/40 relative hidden sm:block">
          <img
            src={botImage}
            alt="AI Trading Bot"
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
              {step === 1 ? "Forgot Password" : "Verify OTP"}
            </h1>
            <p className="text-center text-base md:text-lg text-[#FFF] mt-2 mb-6">
              {step === 1
                ? "Enter your email to receive a reset link"
                : "Enter the OTP sent to your email"}
            </p>

            {/* Form */}
            <form
              onSubmit={step === 1 ? handleSendOTP : handleVerifyOTP}
              className="space-y-4"
              autoComplete="off"
            >
              {step === 1 && (
                <div className="px-2 md:px-4 py-2 md:py-3">
                  <label className="text-base md:text-[20px] text-[#00f0c2] block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mail@gmail.com"
                    autoComplete="off"
                    className="w-full text-white outline-none bg-[#0b0f12]/60 border border-white/60 hover:border-white rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="px-2 md:px-4 py-2 md:py-3">
                  <label className="text-base md:text-[20px] text-[#00f0c2] block mb-2">
                    OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    autoComplete="off"
                    className="w-full text-white outline-none bg-[#0b0f12]/60 border border-white/60 hover:border-white rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-[160px] md:w-[180px] mt-4 py-2 md:py-3 mx-auto rounded-xl bg-gradient-to-r from-[#00f0c2] to-[#5ad8ff] text-black font-bold shadow-2xl flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base"
              >
                {step === 1 ? "Send OTP" : "Verify OTP"} <FaArrowRight />
              </button>
            </form>

            {step === 1 && (
              <p className="text-center text-xs md:text-sm text-gray-400 mt-6">
                Remember password?{" "}
                <a href="/login" className="text-teal-300 hover:underline">
                  Back to Login
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;

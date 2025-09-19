import React, { useState, useRef, useEffect } from "react";
import { MdContentCopy } from "react-icons/md";
import { RefreshCw } from "lucide-react";

const Settings = () => {
  const [tokenAddress, setTokenAddress] = useState("0x123...abc");
  const [rpcUrl, setRpcUrl] = useState("https://rpc-url");
  const [password, setPassword] = useState("");
  const [enable2FA, setEnable2FA] = useState(true);
  const [tursoStatus, setTursoStatus] = useState("Disconnected");
  const logsRef = useRef(null);
  const [logs, setLogs] = useState([]);
  const [botCount, setBotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => [...prev, `Log at ${new Date().toLocaleTimeString()}`]);
      logsRef.current?.scrollTo(0, logsRef.current.scrollHeight);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://dummydata.com/register?ref=demo123");
    const msg = document.getElementById("copiedMessage");
    msg.classList.remove("hidden");
    setTimeout(() => msg.classList.add("hidden"), 2000);
  };

  const handleSaveConfig = () => alert("Configuration Saved!");
  const handleUpdatePassword = () => alert("Password Updated!");
  const handleRestartBot = () => alert("Bot Restarted!");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* ✅ Row 1: Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-5 shadow-md">
          <h3 className="text-gray-400 font-medium mb-2">Bot Status</h3>
          <p className="text-white font-bold text-xl">{tursoStatus}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-5 shadow-md">
          <h3 className="text-gray-400 font-medium mb-2">2FA Enabled</h3>
          <p className="text-white font-bold text-xl">
            {enable2FA ? "Yes" : "No"}
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-5 shadow-md">
          <h3 className="text-gray-400 font-medium mb-2">Connected Bots</h3>
          <p className="text-white font-bold text-xl">{botCount}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-5 shadow-md">
          <h3 className="text-gray-400 font-medium mb-2">Logs</h3>
          <p className="text-green-400 font-bold text-xl">{logs.length}</p>
        </div>
      </div>

      {/* ✅ Row 2: Bot Config (Left) + Logs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bot Configuration */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Bot Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Target Token Address
              </label>
              <input
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">RPC URL</label>
              <input
                type="text"
                value={rpcUrl}
                onChange={(e) => setRpcUrl(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>
            <button
              onClick={handleSaveConfig}
              className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold shadow-md transition-all"
            >
              Save
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Logs</h2>
          <div
            ref={logsRef}
            className="bg-gray-800 p-3 rounded-xl h-64 overflow-y-auto font-mono text-xs text-gray-300"
          >
            {logs.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
          <button
            onClick={handleRestartBot}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-semibold shadow-md transition-all"
          >
            <RefreshCw size={18} /> Restart Bot
          </button>
        </div>
      </div>

      {/* ✅ Row 3: Set Bot (Left) + Security (Center) + Referral Link (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Set My Bot */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Set My Bot</h2>
          <label className="text-gray-400 text-sm mb-2 block">
            Select Number of Bots
          </label>
          <select
            value={botCount}
            onChange={(e) => setBotCount(parseInt(e.target.value))}
            className="w-40 p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
          >
            {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <p className="mt-4 text-gray-300">
            ✅ You have set{" "}
            <span className="font-bold text-green-400">{botCount}</span> bot(s).
          </p>
        </div>

        {/* Security */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Security</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Change Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-400 outline-none"
              />
              <button
                onClick={handleUpdatePassword}
                className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold shadow-md transition-all"
              >
                Update Password
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={enable2FA}
                onChange={() => setEnable2FA(!enable2FA)}
                className="w-5 h-5 accent-green-400"
              />
              <label className="text-gray-400 font-medium">Enable 2FA</label>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Referral Link</h2>
          <div className="p-3 rounded-lg bg-black/60 border border-gray-700 text-green-400 font-mono text-xs break-all">
            https://dummydata.com/register?ref=demo123
          </div>
          <button
            onClick={handleCopyLink}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-xl font-semibold hover:scale-105 transition-all"
          >
            <MdContentCopy /> Copy Link
          </button>
          <div id="copiedMessage" className="hidden text-xs text-green-400 mt-2">
            ✅ Link copied to clipboard!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

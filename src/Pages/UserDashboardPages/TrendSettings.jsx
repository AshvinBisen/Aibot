import React, { useState } from "react";
import { FaChartLine, FaArrowUp, FaArrowDown, FaCog } from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

// Dummy Trend History Data
const trendData = [
  { date: "Mon", trend: 1.2 },
  { date: "Tue", trend: 0.8 },
  { date: "Wed", trend: 1.5 },
  { date: "Thu", trend: 1.0 },
  { date: "Fri", trend: 1.8 },
  { date: "Sat", trend: 2.0 },
  { date: "Sun", trend: 1.7 },
];

const TrendSettings = () => {
  // 🔹 Main Saved State
  const [currentTrend, setCurrentTrend] = useState("Up");
  const [buyMultiplier, setBuyMultiplier] = useState(1);
  const [sellMultiplier, setSellMultiplier] = useState(1);
  const [dailyLimit, setDailyLimit] = useState(20);

  // 🔹 Temporary Draft State
  const [draftTrend, setDraftTrend] = useState(currentTrend);
  const [draftBuy, setDraftBuy] = useState(buyMultiplier);
  const [draftSell, setDraftSell] = useState(sellMultiplier);
  const [draftLimit, setDraftLimit] = useState(dailyLimit);

  // 🔹 Message state
  const [message, setMessage] = useState("");

  // 🔹 Save Handler
  const handleSave = () => {
    setCurrentTrend(draftTrend);
    setBuyMultiplier(draftBuy);
    setSellMultiplier(draftSell);
    setDailyLimit(draftLimit);

    // show success message
    setMessage("✅ Trend settings saved successfully!");

    // auto hide after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Current Trend</h3>
            <FaChartLine className="text-blue-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-white">{currentTrend}</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Buy Multiplier</h3>
            <FaArrowUp className="text-green-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-white">{buyMultiplier}x</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Sell Multiplier</h3>
            <FaArrowDown className="text-red-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-white">{sellMultiplier}x</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Daily Limit</h3>
            <FaCog className="text-yellow-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-white">{dailyLimit} Trades</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form Section */}
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 shadow-lg space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Configure Trend Settings</h2>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="text-gray-400 w-32">Select Trend:</label>
              <select
                value={draftTrend}
                onChange={(e) => setDraftTrend(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-black/60 border border-gray-700 text-white focus:outline-none"
              >
                <option value="Up">Up</option>
                <option value="Down">Down</option>
                <option value="Stable">Stable</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="text-gray-400 w-32">Buy Multiplier:</label>
              <input
                type="number"
                value={draftBuy}
                onChange={(e) => setDraftBuy(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-black/60 border border-gray-700 text-white focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="text-gray-400 w-32">Sell Multiplier:</label>
              <input
                type="number"
                value={draftSell}
                onChange={(e) => setDraftSell(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-black/60 border border-gray-700 text-white focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="text-gray-400 w-32">Daily Trade Limit:</label>
              <input
                type="number"
                value={draftLimit}
                onChange={(e) => setDraftLimit(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-black/60 border border-gray-700 text-white focus:outline-none"
              />
            </div>

            <button
              onClick={handleSave}
              className="mt-2 px-6 py-2 bg-green-500 hover:bg-green-600 rounded-2xl text-white font-semibold transition-all"
            >
              Apply Changes
            </button>

            {/* Success Message */}
            {message && (
              <div className="mt-2 p-2 bg-green-600 text-white rounded-lg text-center font-medium">
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Right: Preview Chart */}
        <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Trend Preview</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="trend" stroke="#7CFC00" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Trend Change History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-br from-gray-900 to-black text-white">
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Trend</th>
                <th className="px-4 py-2 font-medium">Buy Multiplier</th>
                <th className="px-4 py-2 font-medium">Sell Multiplier</th>
                <th className="px-4 py-2 font-medium">Daily Limit</th>
              </tr>
            </thead>
            <tbody>
              {trendData.map((item, idx) => (
                <tr key={idx} className="border-t border-gray-800 hover:bg-gray-800/70 transition">
                  <td className="px-4 py-2 text-gray-300">{item.date}</td>
                  <td className="px-4 py-2 text-white">{currentTrend}</td>
                  <td className="px-4 py-2 text-green-400 font-semibold">{buyMultiplier}x</td>
                  <td className="px-4 py-2 text-red-400 font-semibold">{sellMultiplier}x</td>
                  <td className="px-4 py-2 text-yellow-400 font-semibold">{dailyLimit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrendSettings;

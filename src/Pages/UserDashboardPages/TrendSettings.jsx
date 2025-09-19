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

    setMessage("✅ Trend settings saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="p-1 sm:p-2 md:p-4 lg:p-6 pt-4 space-y-6 text-white w-full lg:max-w-full max-w-6xl mx-auto">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-3 sm:p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-xs sm:text-sm">Current Trend</h3>
            <FaChartLine className="text-blue-400" size={18} />
          </div>
          <p className="text-lg sm:text-2xl font-bold">{currentTrend}</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-3 sm:p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-xs sm:text-sm">Buy Multiplier</h3>
            <FaArrowUp className="text-green-400" size={18} />
          </div>
          <p className="text-lg sm:text-2xl font-bold">{buyMultiplier}x</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-3 sm:p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-xs sm:text-sm">Sell Multiplier</h3>
            <FaArrowDown className="text-red-400" size={18} />
          </div>
          <p className="text-lg sm:text-2xl font-bold">{sellMultiplier}x</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-3 sm:p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-xs sm:text-sm">Daily Limit</h3>
            <FaCog className="text-yellow-400" size={18} />
          </div>
          <p className="text-lg sm:text-2xl font-bold">{dailyLimit} Trades</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left: Form Section */}
        <div className="lg:col-span-2 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-3 sm:p-6 shadow-lg space-y-4">
          <h2 className="text-base sm:text-xl font-bold mb-2 sm:mb-4">
            Configure Trend Settings
          </h2>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="text-gray-400 w-full sm:w-32">Select Trend:</label>
              <select
                value={draftTrend}
                onChange={(e) => setDraftTrend(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-black/60 border border-gray-700 focus:outline-none"
              >
                <option value="Up">Up</option>
                <option value="Down">Down</option>
                <option value="Stable">Stable</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="text-gray-400 w-full sm:w-32">Buy Multiplier:</label>
              <input
                type="number"
                value={draftBuy}
                onChange={(e) => setDraftBuy(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-black/60 border border-gray-700 focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="text-gray-400 w-full sm:w-32">Sell Multiplier:</label>
              <input
                type="number"
                value={draftSell}
                onChange={(e) => setDraftSell(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-black/60 border border-gray-700 focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="text-gray-400 w-full sm:w-32">Daily Limit:</label>
              <input
                type="number"
                value={draftLimit}
                onChange={(e) => setDraftLimit(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-black/60 border border-gray-700 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSave}
              className="mt-2 px-4 sm:px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold transition"
            >
              Apply Changes
            </button>

            {message && (
              <div className="mt-2 p-2 bg-green-600 text-white rounded-lg text-center font-medium">
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Right: Chart */}
        <div className="lg:col-span-1 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-3 sm:p-6 shadow-lg">
          <h2 className="text-base sm:text-xl font-bold mb-2 sm:mb-4">Trend Preview</h2>
          <ResponsiveContainer width="100%" height={250}>
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
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-lg p-3 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
          Trend Change History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] sm:text-sm text-left border-collapse min-w-[200px]">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-2 sm:px-4 py-2">Date</th>
                <th className="px-2 sm:px-4 py-2">Trend</th>
                <th className="px-2 sm:px-4 py-2">Buy</th>
                <th className="px-2 sm:px-4 py-2">Sell</th>
                <th className="px-2 sm:px-4 py-2">Limit</th>
              </tr>
            </thead>
            <tbody>
              {trendData.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-800 hover:bg-gray-800/70 transition"
                >
                  <td className="px-2 sm:px-4 py-2 text-gray-300">{item.date}</td>
                  <td className="px-2 sm:px-4 py-2">{currentTrend}</td>
                  <td className="px-2 sm:px-4 py-2 text-green-400 font-semibold">
                    {buyMultiplier}x
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-red-400 font-semibold">
                    {sellMultiplier}x
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-yellow-400 font-semibold">
                    {dailyLimit}
                  </td>
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

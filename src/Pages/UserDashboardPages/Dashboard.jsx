import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaExchangeAlt,
  FaCalendarDay,
  FaCoins,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaRobot,
  FaDollarSign,
  FaEthereum,
  FaBitcoin,
  FaFileExcel,
} from "react-icons/fa";
import { useAuth } from "../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Pehle se cached data load karo ya null
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem("dashboardData");
    return cached ? JSON.parse(cached) : null;
  });

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?.token) return;

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "https://volumebot.furfoori.com/api/dashboard",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setData(response.data.data);
        localStorage.setItem("dashboardData", JSON.stringify(response.data.data));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.response?.data?.message || "Failed to fetch dashboard data");
      }
    };

    fetchDashboardData();

    // Optional: Polling for real-time update har 30 sec me
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);

  }, [user]);

  if (!data && !error)
    return <div className="flex items-center justify-center min-h-screen bg-black text-white">Loading...</div>;

  if (error)
    return <div className="flex items-center justify-center min-h-screen bg-black text-red-400">{error}</div>;

  // Filtered trades
  const latestTrades = data?.latest_trades?.slice(0, 50) || [];
  const filteredTrades = latestTrades.filter(
    (trade) =>
      trade.wallet_address.toLowerCase().includes(search.toLowerCase()) ||
      trade.type.toLowerCase().includes(search.toLowerCase())
  );

  // Export to Excel
  const exportToExcel = () => {
    if (filteredTrades.length === 0) return;

    const exportData = filteredTrades.map((trade) => ({
      Type: trade.type.toUpperCase(),
      "Token Amount": parseFloat(trade.token_amount).toFixed(4),
      "USDT Amount": parseFloat(trade.usdt_amount).toFixed(4),
      Price: parseFloat(trade.price).toFixed(6),
      "Wallet Address": trade.wallet_address,
      Timestamp: new Date(trade.timestamp).toLocaleString(),
      "Gas Fee (BNB)": parseFloat(trade.gas_fee_bnb).toFixed(6),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Latest Trades");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "Latest_Trades.xlsx");
  };

  return (
    <div className="p-4 space-y-8 w-full">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: "Total Transactions", value: data?.total_transactions || 0, icon: <FaExchangeAlt className="text-green-400" size={22} />, subtitle: "Running" },
          { title: "Daily Transactions", value: data?.daily_transactions || 0, icon: <FaCalendarDay className="text-blue-400" size={22} />, subtitle: "Running" },
          { title: "Total Fee BNB", value: data?.total_fee_bnb || 0, icon: <FaCoins className="text-yellow-400" size={22} />, subtitle: "Amount" },
          { title: "Daily Fee BNB", value: data?.daily_fee_bnb || 0, icon: <FaMoneyBillWave className="text-purple-400" size={22} />, subtitle: "Amount" },
          { title: "Total Buy USDT", value: data?.total_buy_usdt || 0, icon: <FaArrowUp className="text-pink-400" size={22} />, subtitle: "Amount" },
          { title: "Total Sell USDT", value: data?.total_sell_usdt || 0, icon: <FaArrowDown className="text-green-400" size={22} />, subtitle: "Amount" },
          { title: "Total Bot Agents", value: data?.total_bot_agents || 0, icon: <FaRobot className="text-blue-400" size={22} />, subtitle: "Bot" },
          { title: "Total USDT", value: data?.total_available_balances?.total_usdt || 0, icon: <FaDollarSign className="text-yellow-400" size={22} />, subtitle: "Amount" },
          { title: "Total Token", value: data?.total_available_balances?.total_token || 0, icon: <FaEthereum className="text-purple-400" size={22} />, subtitle: "Amount" },
          { title: "Total BNB", value: data?.total_available_balances?.total_bnb || 0, icon: <FaBitcoin className="text-pink-400" size={22} />, subtitle: "Amount" },
        ].map((card, index) => (
          <div key={index} className="rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-5 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">{card.title}</h3>
              {card.icon}
            </div>
            <p className="text-lg font-bold text-white">{card.value}</p>
            <p className="text-sm text-green-400">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Dex Screener Iframe */}
      <iframe
        src="https://dexscreener.com/bsc/0x55a209722ebb99c2f42befc5147c022b9b7cc83d?embed=1&theme=dark&metrics=TVL%2Cvolume%2CpriceChangeH1%2CpriceChangeH6%2CpriceChangeH24%2Cliquidity"
        width="100%"
        height="500"
        frameBorder="0"
      ></iframe>

      {/* Latest Trades Table */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl p-4 sm:p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white mb-4">Latest Trades</h2>

        {/* Search & Export */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <input
            type="text"
            placeholder="Search by wallet or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 w-full sm:w-[300px] rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-br from-gray-900 to-black text-gray-200"
          />
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
          >
            <FaFileExcel /> Export to Excel
          </button>
        </div>

        <div className="overflow-x-auto bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-lg p-3 sm:p-6">
          <table className="w-full min-w-[700px] text-sm text-left border-collapse table-auto">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="px-4 py-2 w-[80px]">Type</th>
                <th className="px-4 py-2 w-[120px]">Token Amount</th>
                <th className="px-4 py-2 w-[120px]">USDT Amount</th>
                <th className="px-4 py-2 w-[100px]">Price</th>
                <th className="px-4 py-2 w-[150px]">Wallet Address</th>
                <th className="px-4 py-2 w-[160px]">Timestamp</th>
                <th className="px-4 py-2 w-[100px]">Gas Fee (BNB)</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade, index) => (
                <tr key={index} className="border-t border-gray-700 hover:bg-gray-800/70 transition">
                  <td className={`px-4 py-2 font-semibold ${trade.type === "sell" ? "text-red-400" : "text-green-400"}`}>
                    {trade.type.toUpperCase()}
                  </td>
                  <td className="px-4 py-2 text-gray-300">{parseFloat(trade.token_amount).toFixed(4)}</td>
                  <td className="px-4 py-2 text-gray-300">{parseFloat(trade.usdt_amount).toFixed(4)}</td>
                  <td className="px-4 py-2 text-gray-300">{parseFloat(trade.price).toFixed(6)}</td>
                  <td className="px-4 py-2 break-words max-w-[150px] text-gray-300">{trade.wallet_address}</td>
                  <td className="px-4 py-2 text-gray-300">{new Date(trade.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2 text-gray-300">{parseFloat(trade.gas_fee_bnb).toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View More Button */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/dashboard/trade-history")}
            className="px-4 py-2 border border-white/50 rounded bg-gradient-to-br from-gray-600 to-black/50 hover:bg-grey-500 text-white transition-colors"
          >
            View More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;




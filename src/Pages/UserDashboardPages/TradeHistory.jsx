import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaFileExcel, FaExchangeAlt, FaCalendarDay, FaCoins, FaMoneyBillWave, FaArrowUp, FaArrowDown } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAuth } from "../../Hooks/useAuth";
import CopyIconButton from "../../Components/CopyButton";

const TradeHistory = () => {
  const { user } = useAuth();
  const getToday = () => new Date().toISOString().split("T")[0];
  const getMonthAgo = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  };

  const itemsPerPage = 10;

  // ✅ State
  const [trades, setTrades] = useState(() => {
    const cached = localStorage.getItem("tradeHistory");
    return cached ? JSON.parse(cached) : [];
  });
  const [statistics, setStatistics] = useState({
    total_trades: 0,
    total_buy: 0,
    total_sell: 0,
    total_bnb_fee: 0,
    today_trades: 0,
    today_buy: 0,
    today_sell: 0,
    today_bnb_fee: 0,
  });
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(getMonthAgo());
  const [endDate, setEndDate] = useState(getToday());
  const [loading, setLoading] = useState(trades.length === 0);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(trades.length);

  // ✅ Fetch trades function with caching
  const fetchTrades = useCallback(
    async (page = 1) => {
      if (!user?.token) {
        setError("No authentication token found. Please log in again.");
        setLoading(false);
        return;
      }

      // Try loading from cache first
      const cachedTrades = localStorage.getItem("tradeHistory");
      if (cachedTrades && trades.length === 0) {
        setTrades(JSON.parse(cachedTrades));
        setLoading(false);
      }

      try {
        setLoading(true);
        setError("");

        const url = `https://volumebot.furfoori.com/api/trades-history`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.data?.success) {
          const { trades, pagination, statistics } = response.data.data;

          setTrades(trades || []);
          setStatistics(statistics || statistics);
          setTotalItems(pagination?.total || trades.length);
          setTotalPages(pagination?.totalPages || 1);

          // ✅ Cache trades
          localStorage.setItem("tradeHistory", JSON.stringify(trades || []));
        } else {
          setError("Failed to fetch trade history.");
        }
      } catch (err) {
        console.error("API Error:", err);
        if (err.response?.status === 401) setError("Unauthorized: Please log in again.");
        else if (err.response?.status === 400) setError("Bad Request: Check your date filters.");
        else setError(err.response?.data?.message || "Error fetching trade history.");
      } finally {
        setLoading(false);
      }
    },
    [user, trades]
  );

  useEffect(() => {
    if (user?.token) fetchTrades(currentPage);

    const interval = setInterval(() => {
      if (user?.token) fetchTrades(currentPage);
    }, 30000);

    return () => clearInterval(interval);
  }, [user, currentPage, fetchTrades]);

  // Filter trades based on search
  const filteredTrades = trades.filter(
    (trade) =>
      trade.wallet_address?.toLowerCase().includes(search.toLowerCase()) ||
      trade.type?.toLowerCase().includes(search.toLowerCase())
  );

  // Export trades to Excel
  const exportToExcel = () => {
    if (filteredTrades.length === 0) return;

    const exportData = filteredTrades.map((trade) => ({
      ID: trade.id,
      Type: trade.type,
      "Token Amount": parseFloat(trade.token_amount || 0).toFixed(3),
      "USDT Amount": parseFloat(trade.usdt_amount || 0).toFixed(3),
      Price: parseFloat(trade.price || 0).toFixed(6),
      "Gas Fee (BNB)": trade.gas_fee_bnb,
      Wallet: trade.wallet_address,
      "Date & Time": new Date(trade.timestamp).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trades");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "Trade_History.xlsx");
  };

  const DateInput = ({ value, onChange, min, max }) => (
    <input
      type="date"
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      className="px-3 py-2 rounded border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-br from-black/5 to-gray-600 text-gray-100 appearance-none"
    />
  );

  const cards = [
    { title: "Total Trades", value: statistics.total_trades, icon: <FaExchangeAlt className="text-green-400" /> },
    { title: "Total Buy", value: statistics.total_buy, icon: <FaArrowUp className="text-blue-400" /> },
    { title: "Total Sell", value: statistics.total_sell, icon: <FaArrowDown className="text-red-400" /> },
    { title: "Total BNB Fee", value: statistics.total_bnb_fee, icon: <FaCoins className="text-yellow-400" /> },
    { title: "Today's Trades", value: statistics.today_trades, icon: <FaCalendarDay className="text-green-400" /> },
    { title: "Today's Buy", value: statistics.today_buy, icon: <FaArrowUp className="text-blue-400" /> },
    { title: "Today's Sell", value: statistics.today_sell, icon: <FaArrowDown className="text-red-400" /> },
    { title: "Today's BNB Fee", value: statistics.today_bnb_fee, icon: <FaMoneyBillWave className="text-yellow-400" /> },
  ];

  return (
    <div className="p-2 sm:p-4 w-full max-w-full">
      {/* ---------- CARDS SECTION ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, idx) => (
          <div key={idx} className="rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-5 shadow-md">
            <div className="flex justify-between mb-2">
              <h3 className="text-gray-400 text-sm font-medium">{card.title}</h3>
              {card.icon}
            </div>
            <p className="text-lg font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="p-4 w-full max-w-full bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 text-left">Trade History</h2>

        {/* ---------- FILTERS ---------- */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2 w-full sm:w-auto justify-end items-center flex-col sm:flex-row">
            <DateInput value={startDate} onChange={(e) => setStartDate(e.target.value)} max={endDate} />
            <DateInput value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} max={getToday()} />
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end items-center">
            <input
              type="text"
              placeholder="Search by wallet or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 w-full max-w-[400px] rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-br from-gray-900 to-black text-gray-200"
            />
            <button
              onClick={exportToExcel}
              className="ml-2 text-green-500 hover:text-green-400 p-2 border border-white/50 rounded bg-gradient-to-br from-gray-600 to-black/50 hover:bg-gray-700 transition-colors"
              title="Download Excel"
            >
              <FaFileExcel size={22} />
            </button>
          </div>
        </div>

        {/* ---------- TABLE ---------- */}
        <div className="overflow-x-auto w-full bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-lg p-3 sm:p-6">
          {loading && trades.length === 0 ? (
            <p className="text-white text-center py-10">Loading trade history...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-10">{error}</p>
          ) : (
            <table className="w-full text-sm text-left border-collapse table-auto">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="py-2 px-3">S.No</th>
                  <th className="py-2 px-3">ID</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Token Amount</th>
                  <th className="py-2 px-3">USDT Amount</th>
                  <th className="py-2 px-3">Price</th>
                  <th className="py-2 px-3">Gas Fee (BNB)</th>
                  <th className="py-2 px-3">Wallet</th>
                  <th className="py-2 px-3">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.length > 0 ? (
                  filteredTrades.map((trade, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-700/50">
                      <td className="py-2 px-3">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                      <td className="py-2 px-3">{trade.id}</td>
                      <td className={`py-2 px-3 font-semibold ${trade.type === "buy" ? "text-green-500" : "text-red-500"}`}>
                        {trade.type.toUpperCase()}
                      </td>
                      <td className="py-2 px-3">{parseFloat(trade.token_amount || 0).toFixed(3)}</td>
                      <td className="py-2 px-3">{parseFloat(trade.usdt_amount || 0).toFixed(3)}</td>
                      <td className="py-2 px-3">{parseFloat(trade.price || 0).toFixed(6)}</td>
                      <td className="py-2 px-3">{trade.gas_fee_bnb}</td>
                      <td className="py-2 px-3 truncate max-w-[150px]">
                        {trade.wallet_address?.slice(0, 8)}...{trade.wallet_address?.slice(-6)}
                        <CopyIconButton text={trade.wallet_address} />
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">{new Date(trade.timestamp).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-6 text-center text-gray-400">
                      No trades found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ---------- PAGINATION ---------- */}
        {totalItems > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              Page {currentPage} of {totalPages} ({totalItems} trades)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-900 text-white disabled:opacity-50 hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-900 text-white disabled:opacity-50 hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeHistory;

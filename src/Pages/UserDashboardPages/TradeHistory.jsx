import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaFileExcel, FaExchangeAlt, FaCalendarDay, FaCoins, FaMoneyBillWave, FaArrowUp, FaArrowDown } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAuth } from "../../Hooks/useAuth";

// Copy button component
const CopyButtonIcon = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy Wallet Address"}
      className={`ml-2 p-1 rounded-full ${copied ? "bg-green-600 text-white" : "bg-gray-700 text-white"}`}
      style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
    >
      <FaFileExcel size={14} />
    </button>
  );
};

const TradeHistory = () => {
  const { user } = useAuth();
  const getToday = () => new Date().toISOString().split("T")[0];
  const getMonthAgo = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  };

  const itemsPerPage = 10;

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

  // Fetch trades
  const fetchTrades = useCallback(
    async (page = 1) => {
      if (!user?.token) return;

      try {
        setLoading(true);
        setError("");

        const url = `https://volumebot.furfoori.com/api/trades-history`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (response.data?.success) {
          const { trades, pagination, statistics } = response.data.data;
          setTrades(trades || []);
          setStatistics(statistics || {});
          setTotalItems(pagination?.total || trades.length);
          setTotalPages(pagination?.totalPages || 1);
          localStorage.setItem("tradeHistory", JSON.stringify(trades || []));
        } else {
          setError("Failed to fetch trade history.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching trade history.");
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (user?.token) fetchTrades(currentPage);
    const interval = setInterval(() => fetchTrades(currentPage), 30000);
    return () => clearInterval(interval);
  }, [user, currentPage, fetchTrades]);

  const filteredTrades = trades.filter(
    (trade) =>
      trade.wallet_address?.toLowerCase().includes(search.toLowerCase()) ||
      trade.type?.toLowerCase().includes(search.toLowerCase())
  );

  const exportToExcel = () => {
    if (!filteredTrades.length) return;

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
      className="px-3 py-2 rounded border border-gray-600 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-br from-black/5 to-gray-600 text-gray-100"
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
    <div className="p-2 md:p-4 w-full max-w-full">
      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
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

      {/* FILTERS + TABLE */}
      <div className="overflow-x-auto w-full bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl p-2 sm:p-4">
        <h2 className="text-2xl font-semibold mb-4 text-left text-white">Trade History</h2>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          {/* Date Filters */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <DateInput
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate}
            />
            <DateInput
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              max={getToday()}
            />
          </div>

  {/* Search + Export */}
  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-end items-center">
    <input
      type="text"
      placeholder="Search by wallet or type..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="px-3 py-2 w-full sm:w-[300px] rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-br from-gray-900 to-black text-gray-200"
    />
    <button
      onClick={exportToExcel}
      className="flex items-center justify-center gap-2 px-3 py-2 w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
    >
      <FaFileExcel /> Export Excel
    </button>
  </div>
</div>


        {/* TABLE */}
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
                <th className="py-2 px-3 w-[250px]">Wallet</th>
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
                    <td className="py-2 px-3 truncate flex items-center">
                      {trade.wallet_address.slice(0, 8)}...{trade.wallet_address.slice(-6)}
                      <CopyButtonIcon text={trade.wallet_address} />
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">{new Date(trade.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-6 text-center text-gray-400">No trades found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* PAGINATION */}
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


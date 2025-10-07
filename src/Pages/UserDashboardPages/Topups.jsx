import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../Hooks/useAuth";
import { FaRegCopy, FaFileExcel, FaDollarSign, FaBitcoin, FaEthereum, FaCoins } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CopyIconButton from "../../Components/CopyButton";

// Copy button
function CopyButtonIcon({ text }) {
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
      title={copied ? "Copied!" : "Copy"}
      className={`ml-2 p-1 rounded-full ${copied ? "bg-green-600 text-white" : "bg-gray-700 text-white"}`}
      style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
    >
      <FaRegCopy size={14} />
    </button>
  );
}

const Topups = () => {
  const { user } = useAuth();
  const botURL = "https://volumebot.furfoori.com";
  const getToday = () => new Date().toISOString().split("T")[0];
  const getMonthAgo = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  };

  const itemsPerPage = 10;

  const [topups, setTopups] = useState(() => {
    const cached = localStorage.getItem("topups");
    return cached ? JSON.parse(cached) : [];
  });
  const [statistics, setStatistics] = useState(null);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(getMonthAgo());
  const [endDate, setEndDate] = useState(getToday());
  const [loading, setLoading] = useState(topups.length === 0);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(topups.length);

  // Fetch topups + statistics
  const fetchTopups = useCallback(
    async (page = 1) => {
      if (!user?.token) return;

      try {
        setError("");
        const start = new Date(startDate).toISOString();
        const end = new Date(new Date(endDate).setHours(23, 59, 59, 999)).toISOString();

        const url = `${botURL}/api/topups?page=${page}&limit=${itemsPerPage}&startDate=${start}&endDate=${end}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (res.data?.success) {
          const { topups, pagination, statistics } = res.data.data;
          setTopups(topups || []);
          setStatistics(statistics || null);
          setTotalItems(pagination?.total || topups.length);
          setTotalPages(pagination?.totalPages || 1);

          localStorage.setItem("topups", JSON.stringify(topups || []));
        } else {
          setError("Failed to fetch topups.");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Error fetching topups.");
      } finally {
        setLoading(false);
      }
    },
    [user, startDate, endDate, itemsPerPage]
  );

  useEffect(() => {
    if (user?.token) fetchTopups(currentPage);

    const interval = setInterval(() => {
      if (user?.token) fetchTopups(currentPage);
    }, 30000);

    return () => clearInterval(interval);
  }, [user, currentPage, fetchTopups]);

  const filteredTopups = topups.filter(
    (t) =>
      t.wallet_address?.toLowerCase().includes(search.toLowerCase()) ||
      t.token_type?.toLowerCase().includes(search.toLowerCase()) ||
      t.tx_hash?.toLowerCase().includes(search.toLowerCase())
  );

  const exportToExcel = () => {
    if (filteredTopups.length === 0) return;

    const exportData = filteredTopups.map((t) => ({
      ID: t.id,
      Wallet: t.wallet_address,
      "Token Type": t.token_type,
      Amount: t.amount,
      Symbol: t.token_symbol,
      "TX Hash": t.tx_hash,
      Timestamp: new Date(t.timestamp).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Topups");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Topups.xlsx");
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

  return (
    <div className="p-2 sm:p-4 w-full max-w-full ">
      
      {/* ✅ Statistics Cards Section */}
      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              title: "Total Topups",
              value: statistics.total_topups || 0,
              icon: <FaCoins className="text-yellow-400" size={22} />,
              subtitle: "Transactions",
            },
            {
              title: "Total USDT",
              value: statistics.total_usdt || 0,
              icon: <FaDollarSign className="text-green-400" size={22} />,
              subtitle: "Amount",
            },
            {
              title: "Total BNB",
              value: statistics.total_bnb || 0,
              icon: <FaBitcoin className="text-pink-400" size={22} />,
              subtitle: "Amount",
            },
            {
              title: "Total Token",
              value: statistics.total_token || 0,
              icon: <FaEthereum className="text-purple-400" size={22} />,
              subtitle: "Amount",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-5 shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-400 text-sm font-medium">{card.title}</h3>
                {card.icon}
              </div>
              <p className="text-lg font-bold text-white">{card.value}</p>
              <p className="text-sm text-green-400">{card.subtitle}</p>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 w-full max-w-full bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl">
      <h2 className="text-2xl font-semibold mb-4 text-left">Topups</h2>
      {/* Filters */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 w-full sm:w-auto justify-end items-center flex-col sm:flex-row">
          <DateInput value={startDate} onChange={(e) => setStartDate(e.target.value)} max={endDate} />
          <DateInput value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} max={getToday()} />
        </div>

        <div className="flex gap-2 w-full sm:w-auto justify-end items-center">
          <input
            type="text"
            placeholder="Search by wallet, type or tx..."
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

      {/* Table */}
      <div className="overflow-x-auto w-full bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-lg p-3 sm:p-6">
        {loading && topups.length === 0 ? (
          <p className="text-white text-center py-10">Loading topups...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-10">{error}</p>
        ) : (
          <table className="w-full text-sm text-left border-collapse table-auto">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="py-2 px-3">S no</th>
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Wallet</th>
                <th className="py-2 px-3">Token</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Symbol</th>
                <th className="py-2 px-3">TX Hash</th>
                <th className="py-2 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopups.length > 0 ? (
                filteredTopups.map((t, i) => (
                  <tr key={i} className="border-b border-gray-800 hover:bg-gray-700/50">
                    <td className="py-2 px-3">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                    <td className="py-2 px-3 flex items-center">
                      <span>{t.id}</span>
                      <CopyIconButton text={t.id} />
                    </td>
                    <td className="py-2 px-3 truncate max-w-[150px]">
                      {t.wallet_address?.slice(0, 8)}...{t.wallet_address?.slice(-6)}
                      <CopyIconButton text={t.wallet_address} />
                    </td>
                    <td className="py-2 px-3 flex items-center gap-1">
                      {t.token_icon} {t.token_type}
                    </td>
                    <td className="py-2 px-3">{parseFloat(t.amount).toFixed(6)}</td>
                    <td className="py-2 px-3">{t.token_symbol}</td>
                    <td className="py-2 px-3 truncate max-w-[180px]">
                      {t.tx_hash?.slice(0, 8)}...{t.tx_hash?.slice(-6)} <CopyIconButton text={t.tx_hash} />
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">{new Date(t.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-gray-400">
                    No topups found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages} ({totalItems} topups)
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

export default Topups;



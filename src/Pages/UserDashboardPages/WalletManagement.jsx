import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../Hooks/useAuth";
import {
  FaRegCopy,
  FaFileExcel,
  FaBitcoin,
  FaDollarSign,
  FaWallet,
  FaEthereum,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
      title={copied ? "Copied!" : "Copy Wallet Address"}
      className={`ml-2 p-1 rounded-full ${
        copied ? "bg-green-600 text-white" : "bg-gray-700 text-white"
      }`}
      style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
    >
      <FaRegCopy size={14} />
    </button>
  );
}

const WalletManagementTable = () => {
  const { user } = useAuth();

  const [wallets, setWallets] = useState(() => {
    const cached = localStorage.getItem("walletsData");
    return cached ? JSON.parse(cached) : [];
  });

  const [stats, setStats] = useState(() => {
    const cachedStats = localStorage.getItem("walletStats");
    return cachedStats ? JSON.parse(cachedStats) : null;
  });

  const [loading, setLoading] = useState(wallets.length === 0);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchWallets = useCallback(async (isBackground = false) => {
    if (!user?.token) {
      setError("Authorization token not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      if (!isBackground) setLoading(true);
      const response = await axios.get(
        "https://volumebot.furfoori.com/api/wallets-current-balances",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (response.data?.success) {
        const apiData = response.data.data;
        setStats(apiData);
        setWallets(apiData.wallets || []);

        // ✅ Update cache in background
        localStorage.setItem("walletsData", JSON.stringify(apiData.wallets || []));
        localStorage.setItem("walletStats", JSON.stringify(apiData));
      } else {
        setError("Failed to fetch wallets.");
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError("❌ Forbidden: Invalid token. Please login again.");
      } else {
        setError(err.response?.data?.message || "Error fetching wallets.");
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [user]);

  // ✅ Load cache instantly, then fetch fresh data in background
  useEffect(() => {
    if (wallets.length > 0) {
      // Background fetch to refresh silently
      fetchWallets(true);
    } else {
      // No cache, show loading until API comes
      fetchWallets(false);
    }

    const interval = setInterval(() => fetchWallets(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredWallets = wallets.filter(
    (w) =>
      w.address.toLowerCase().includes(search.toLowerCase()) ||
      w.usdt_balance.toString().includes(search) ||
      w.bnb_balance.toString().includes(search) ||
      w.token_balance.toString().includes(search)
  );

  const exportToExcel = () => {
    if (filteredWallets.length === 0) return;
    const exportData = filteredWallets.map((w) => ({
      "Wallet Address": w.address,
      "Total USDT": w.usdt_balance,
      "Total BNB": w.bnb_balance,
      "Total Token": w.token_balance,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Wallets");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "Wallets.xlsx");
  };

  return (
    <div className="p-2 sm:p-4 w-full max-w-full">
      {/* ✅ STAT CARDS */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              title: "Total Wallets",
              value: stats.total_wallets,
              icon: <FaWallet className="text-blue-400" size={22} />,
              subtitle: "Count",
            },
            {
              title: "Total USDT",
              value: stats.total_balances?.total_usdt ?? 0,
              icon: <FaDollarSign className="text-yellow-400" size={22} />,
              subtitle: "Amount",
            },
            {
              title: "Total Token",
              value: stats.total_balances?.total_token ?? 0,
              icon: <FaEthereum className="text-purple-400" size={22} />,
              subtitle: "Amount",
            },
            {
              title: "Total BNB",
              value: stats.total_balances?.total_bnb ?? 0,
              icon: <FaBitcoin className="text-pink-400" size={22} />,
              subtitle: "Amount",
            },
            {
              title: "Central Wallet Address",
              value: (
                <span className="flex items-center">
                  {stats.central_wallet?.address?.slice(0, 6)}...
                  {stats.central_wallet?.address?.slice(-4)}
                  <CopyButtonIcon text={stats.central_wallet?.address} />
                </span>
              ),
              icon: <FaWallet className="text-green-400" size={22} />,
              subtitle: "Click to copy",
            },
            {
              title: "Central Wallet USDT",
              value: stats.central_wallet?.usdt_balance ?? 0,
              icon: <FaDollarSign className="text-yellow-400" size={22} />,
              subtitle: "USDT Balance",
            },
            {
              title: "Central Wallet Token",
              value: stats.central_wallet?.token_balance ?? 0,
              icon: <FaEthereum className="text-purple-400" size={22} />,
              subtitle: "Token Balance",
            },
            {
              title: "Central Wallet BNB",
              value: stats.central_wallet?.bnb_balance ?? 0,
              icon: <FaBitcoin className="text-pink-400" size={22} />,
              subtitle: "BNB Balance",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-5 shadow-md hover:shadow-lg transition-all"
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

      {/* ✅ TABLE */}
      <div className="overflow-x-auto mt-8 w-full bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-lg p-3 sm:p-6 space-y-6">
        <h2 className="text-2xl font-semibold mb-4 text-left text-white">
          Wallet Management
        </h2>

        {/* Search + Export */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <input
            type="text"
            placeholder="Search wallet or balances..."
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

        {loading && wallets.length === 0 ? (
          <p className="text-white text-center py-10">Loading wallets...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-10">{error}</p>
        ) : (
          <table className="w-full text-sm text-left border-collapse table-auto">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="py-2 px-3">S No</th>
                <th className="py-2 px-3 w-[350px]">Wallet Address</th>
                <th className="py-2 px-3">Total USDT</th>
                <th className="py-2 px-3">Total BNB</th>
                <th className="py-2 px-3">Total Token</th>
              </tr>
            </thead>
            <tbody>
              {filteredWallets.map((wallet, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-gray-700/50">
                  <td className="py-2 px-3">{idx + 1}</td>
                  <td className="py-2 px-3 flex items-center truncate max-w-[350px]">
                    <span>
                      {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                    </span>
                    <CopyButtonIcon text={wallet.address} />
                  </td>
                  <td className="py-2 px-3">{wallet.usdt_balance}</td>
                  <td className="py-2 px-3">{wallet.bnb_balance}</td>
                  <td className="py-2 px-3">{wallet.token_balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WalletManagementTable;


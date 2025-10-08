import React, { useState, useEffect, useCallback } from "react";
import { Copy, ArrowDownToLine, FileText } from "lucide-react";
import QRCode from "react-qr-code";
import toast, { Toaster } from "react-hot-toast";
import * as XLSX from "xlsx";
import axios from "axios";
import { useAuth } from "../../Hooks/useAuth";

const BotWallet = () => {
  const { user } = useAuth();

  // --- State ---
  const [balances, setBalances] = useState({ usdt: 0, token: 0, bnb: 0 });
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [error, setError] = useState("");

  const [walletAddressInput, setWalletAddressInput] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawToken, setWithdrawToken] = useState("USDT");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const walletAddress = "0xaba27d5704fce8ddd8ee5a6596cb4c759aba03a4";
  const qrValue = `ethereum:${walletAddress}?token=USDT`;

  // --- Fetch balances with caching ---
  const fetchBalances = useCallback(async (forceRefresh = false) => {
    const cacheKey = "walletBalances";
    const cached = localStorage.getItem(cacheKey);

    // Show cached data instantly
    if (cached && !forceRefresh) {
      try {
        const parsed = JSON.parse(cached);
        setBalances(parsed);
        setLoadingBalances(false);
      } catch {}
    }

    try {
      const response = await axios.get(
        "https://volumebot.furfoori.com/api/wallets-current-balances",
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      if (response.data?.success && response.data.data?.central_wallet) {
        const wallet = response.data.data.central_wallet;
        const updated = {
          usdt: wallet.usdt_balance,
          token: wallet.token_balance,
          bnb: wallet.bnb_balance,
        };
        setBalances(updated);
        localStorage.setItem(cacheKey, JSON.stringify(updated));
      }
    } catch (err) {
      if (!cached) setError("Error fetching balances.");
    } finally {
      setLoadingBalances(false);
    }
  }, [user]);

  // --- Fetch transactions with caching (placeholder for now) ---
  const fetchTransactions = useCallback(async (forceRefresh = false) => {
    const cacheKey = "walletTransactions";
    const cached = localStorage.getItem(cacheKey);

    if (cached && !forceRefresh) {
      try {
        const parsed = JSON.parse(cached);
        setTransactions(parsed);
        setLoadingTransactions(false);
      } catch {}
    }

    try {
      // Replace later with actual API
      const res = { data: [] }; // example placeholder
      const fetched = res.data || [];

      setTransactions(fetched);
      localStorage.setItem(cacheKey, JSON.stringify(fetched));
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoadingTransactions(false);
    }
  }, []);

  // --- On mount ---
  useEffect(() => {
    fetchBalances();
    fetchTransactions();

    // Optional auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchBalances(true);
      fetchTransactions(true);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchBalances, fetchTransactions]);

  // --- Copy wallet ---
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("✅ Wallet address copied!");
  };

  // --- Handle withdraw ---
  const handleWithdraw = async () => {
    if (!walletAddressInput.trim()) return toast.error("⚠ Enter wallet address");
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0)
      return toast.error("⚠ Enter valid amount");
    if (!withdrawToken) return toast.error("⚠ Select token type");

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(`✅ ${withdrawAmount} ${withdrawToken} withdrawal request submitted!`);
      setWalletAddressInput("");
      setWithdrawAmount("");
      setWithdrawToken("USDT");
    } catch (err) {
      toast.error("❌ Withdrawal failed, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Filtered transactions ---
  const filteredTransactions = transactions
    .filter((txn) => filterType === "all" || txn.type === filterType)
    .filter((txn) => !search || txn.hash?.toLowerCase().includes(search.toLowerCase()))
    .filter((txn) => (!startDate || txn.date >= startDate) && (!endDate || txn.date <= endDate));

  // --- Export to Excel ---
  const exportToExcel = () => {
    if (!transactions.length) return;
    const ws = XLSX.utils.json_to_sheet(
      filteredTransactions.map((txn, idx) => ({
        "S No": idx + 1,
        "Txn Hash": txn.hash,
        Type: txn.type,
        Amount: txn.amount,
        Date: txn.date,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions.xlsx");
  };

  // --- Skeleton loader for balances ---
  const renderBalances = () =>
    loadingBalances ? (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      </div>
    ) : (
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>USDT:</span>
          <span>{balances.usdt}</span>
        </div>
        <div className="flex justify-between">
          <span>Token:</span>
          <span>{balances.token}</span>
        </div>
        <div className="flex justify-between">
          <span>BNB (Gas):</span>
          <span>{balances.bnb}</span>
        </div>
      </div>
    );

  return (
    <div className="p-2 sm:p-4 space-y-6 text-white max-w-7xl mx-auto">
      <Toaster position="top-right" />
      {error && (
        <div className="bg-red-600/20 border border-red-600 text-red-400 p-3 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Wallet Address & Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 shadow-lg p-4">
          <h2 className="font-semibold mb-2">Wallet Address</h2>
          <div className="flex items-center justify-between bg-gray-800 rounded-lg p-2">
            <span className="truncate">{walletAddress}</span>
            <button onClick={copyToClipboard} className="p-1.5 hover:bg-gray-700 rounded-lg">
              <Copy size={16} />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 shadow-lg p-4">
          <h2 className="font-semibold mb-2">Balances</h2>
          {renderBalances()}
        </div>
      </div>

      {/* Add Funds + Withdraw */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Add Funds */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 shadow-lg p-4 flex flex-col items-center space-y-3">
          <h2 className="font-semibold">Add Funds</h2>
          <QRCode value={qrValue} size={150} />
          <p className="text-gray-400 text-center text-sm">
            Scan QR or copy wallet address to deposit funds.
          </p>
          <p className="text-gray-500 text-xs text-center">
            Manual Transfer: Send only <strong>BEP-20</strong> USDT tokens.
          </p>
        </div>

        {/* Withdraw Form */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 shadow-lg p-4 flex flex-col space-y-4">
          <h2 className="font-semibold text-lg text-center">Withdraw</h2>

          <div className="flex flex-col w-full">
            <label className="text-gray-300 text-[16px] mb-1">Wallet Address</label>
            <input
              type="text"
              value={walletAddressInput}
              onChange={(e) => setWalletAddressInput(e.target.value)}
              placeholder="Enter wallet address"
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-white-700"
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-gray-300 text-[16px] mb-1">Amount</label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-white-700"
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-gray-300 text-[16px] mb-1">Token</label>
            <select
              value={withdrawToken}
              onChange={(e) => setWithdrawToken(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-white-700"
            >
              <option value="BNB">BNB</option>
              <option value="USDT">USDT</option>
            </select>
          </div>

          <button
            disabled={isSubmitting}
            onClick={handleWithdraw}
            className={`w-full max-w-[150px] py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 ${
              isSubmitting
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            <ArrowDownToLine size={16} />
            <span>{isSubmitting ? "Processing..." : "Withdraw"}</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-white mb-4">Wallet Management</h2>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search txn hash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[150px] px-3 py-2 rounded border border-gray-600 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-1 min-w-[120px] px-3 py-2 rounded border border-gray-600 bg-gray-800 text-gray-200"
          >
            <option value="all">All</option>
            <option value="Deposit">Deposits</option>
            <option value="Withdraw">Withdrawals</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="flex-1 min-w-[120px] px-3 py-2 rounded border border-gray-600 bg-gray-800 text-gray-200"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="flex-1 min-w-[120px] px-3 py-2 rounded border border-gray-600 bg-gray-800 text-gray-200"
          />
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors flex-none"
          >
            <FileText size={16} /> Export
          </button>
        </div>

        <table className="w-full text-sm text-left border-collapse table-auto">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="py-2 px-3">S No</th>
              <th className="py-2 px-3 w-[350px]">Txn Hash</th>
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-3">Amount</th>
              <th className="py-2 px-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loadingTransactions ? (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  Loading transactions...
                </td>
              </tr>
            ) : filteredTransactions.length ? (
              filteredTransactions.map((txn, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-gray-700/50">
                  <td className="py-2 px-3">{idx + 1}</td>
                  <td className="py-2 px-3 flex items-center truncate max-w-[350px]">
                    <span>{txn.hash}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(txn.hash);
                        toast.success("Txn Hash copied!");
                      }}
                      className="ml-2 p-1 hover:bg-gray-700 rounded"
                    >
                      <Copy size={14} />
                    </button>
                  </td>
                  <td className="py-2 px-3">{txn.type}</td>
                  <td className="py-2 px-3">{txn.amount}</td>
                  <td className="py-2 px-3">{txn.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BotWallet;


import React, { useState } from "react";
import { Copy, RefreshCw, ArrowDownToLine } from "lucide-react";
import { Dialog } from "@headlessui/react";
import QRCode from "react-qr-code";
import toast, { Toaster } from "react-hot-toast";

const WalletManagement = () => {
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [walletAddress] = useState("0x1234...abcd5678");
  const [balances] = useState({
    usdt: 1200.5,
    token: 5000,
    bnb: 0.34,
  });
  const [filter, setFilter] = useState("all");

  const [transactions] = useState([
    { hash: "0xabc123...", type: "Deposit", amount: "100 USDT", date: "2025-09-10" },
    { hash: "0xdef456...", type: "Withdraw", amount: "50 TOKEN", date: "2025-09-12" },
    { hash: "0xghi789...", type: "Deposit", amount: "0.1 BNB", date: "2025-09-13" },
  ]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("✅ Wallet address copied!");
  };

  const refreshTransactions = () => {
    toast.promise(new Promise((res) => setTimeout(res, 1000)), {
      loading: "🔄 Refreshing transactions...",
      success: "✔ Transactions refreshed!",
      error: "❌ Failed to refresh",
    });
  };

  const filteredTxns =
    filter === "all" ? transactions : transactions.filter((txn) => txn.type === filter);

  return (
    <div className="p-1 sm:p-2 md:p-4 lg:p-6 pt-4 space-y-6 text-white w-full lg:max-w-full max-w-6xl mx-auto">
      {/* Toaster */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Wallet Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 shadow-lg p-3 sm:p-5">
          <h2 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4">Wallet Address</h2>
          <div className="flex items-center justify-between bg-gray-800 rounded-lg p-2 sm:p-3">
            <span className="truncate text-xs sm:text-sm">{walletAddress}</span>
            <button
              onClick={copyToClipboard}
              className="p-1.5 sm:p-2 hover:bg-gray-700 rounded-lg transition"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 shadow-lg p-3 sm:p-5">
          <h2 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4">Balances</h2>
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
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
        </div>
      </div>

      {/* Add Funds + Withdraw */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 shadow-lg p-3 sm:p-5 flex flex-col items-center space-y-3">
          <h2 className="text-sm sm:text-lg font-semibold">Add Funds</h2>
          <QRCode value={walletAddress} size={100} />
          <p className="text-gray-400 text-center text-xs sm:text-sm">
            Scan QR or copy wallet address to deposit funds.
          </p>
          <p className="text-gray-500 text-[10px] sm:text-xs text-center">
            Manual Transfer: Send only <strong>BEP-20</strong> tokens.
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 shadow-lg p-3 sm:p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4">Withdraw</h2>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
              Withdraw securely. Confirmation modal ensures safety.
            </p>
          </div>
          <button
            onClick={() => setIsWithdrawOpen(true)}
            className="bg-red-600 hover:bg-red-700 transition text-white py-2 px-3 sm:px-4 rounded-lg flex items-center justify-center space-x-2 text-xs sm:text-sm"
          >
            <ArrowDownToLine size={14} />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 shadow-lg p-3 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
          <h2 className="text-sm sm:text-lg font-semibold">Transaction History</h2>
          <div className="flex space-x-2">
            <select
              className="bg-gray-800 text-white rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-700"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Deposit">Deposits</option>
              <option value="Withdraw">Withdrawals</option>
            </select>
            <button
              className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition"
              onClick={refreshTransactions}
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] sm:text-sm text-left border-collapse min-w-[320px]">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-2 sm:px-4 py-2">Txn Hash</th>
                <th className="px-2 sm:px-4 py-2">Type</th>
                <th className="px-2 sm:px-4 py-2">Amount</th>
                <th className="px-2 sm:px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.length ? (
                filteredTxns.map((txn, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-700 hover:bg-gray-800 transition"
                  >
                    <td className="px-2 sm:px-4 py-2 truncate">{txn.hash}</td>
                    <td className="px-2 sm:px-4 py-2">{txn.type}</td>
                    <td className="px-2 sm:px-4 py-2">{txn.amount}</td>
                    <td className="px-2 sm:px-4 py-2">{txn.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-4 text-gray-500 text-xs sm:text-sm"
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdraw Modal */}
      <Dialog
        open={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2">
          <div className="bg-gradient-to-br from-gray-900 to-black p-3 sm:p-5 rounded-xl shadow-lg w-full max-w-[95%] sm:max-w-md border border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Confirm Withdrawal
            </h3>
            <input
              type="text"
              placeholder="Enter amount"
              className="w-full p-2 sm:p-3 rounded-lg bg-gray-800 border border-gray-700 mb-3 sm:mb-4 text-white text-sm"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsWithdrawOpen(false)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-700 rounded-lg text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs sm:text-sm"
                onClick={() => toast.success("✔ Withdrawal confirmed!")}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default WalletManagement;

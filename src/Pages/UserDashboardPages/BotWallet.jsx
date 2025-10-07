import React, { useState } from "react";
import { Copy, ArrowDownToLine, FileText } from "lucide-react";
import { Dialog } from "@headlessui/react";
import QRCode from "react-qr-code";
import toast, { Toaster } from "react-hot-toast";
import * as XLSX from "xlsx";

// Copy button component
const CopyButtonIcon = ({ text }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("✅ Copied!");
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1 rounded hover:bg-gray-700 transition"
    >
      <Copy size={16} />
    </button>
  );
};

const BotWallet = () => {
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const walletAddress = "0xaba27d5704fce8ddd8ee5a6596cb4c759aba03a4";

  // Static Wallet Balances
  const balances = {
    usdt: 5000,
    token: 2000,
    bnb: 1.5,
  };

  // Static Transactions
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const transactions = [
    { hash: "0xabc123...", type: "Deposit", amount: "100 USDT", date: "2025-09-10" },
    { hash: "0xdef456...", type: "Withdraw", amount: "50 TOKEN", date: "2025-09-12" },
    { hash: "0xghi789...", type: "Deposit", amount: "0.1 BNB", date: "2025-09-13" },
  ];

  const filteredTransactions = transactions
    .filter((txn) => filterType === "all" || txn.type === filterType)
    .filter((txn) => !search || txn.hash.toLowerCase().includes(search.toLowerCase()))
    .filter((txn) => (!startDate || txn.date >= startDate) && (!endDate || txn.date <= endDate));

  // Export Transactions to Excel
  const exportToExcel = () => {
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

  const qrValue = `ethereum:${walletAddress}?token=USDT`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("✅ Wallet address copied!");
  };

  return (
    <div className="p-2 sm:p-4 space-y-6 text-white max-w-7xl mx-auto">
      <Toaster position="top-right" />

      {/* Wallet Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wallet Address */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 shadow-lg p-4">
          <h2 className="font-semibold mb-2">Wallet Address</h2>
          <div className="flex items-center justify-between bg-gray-800 rounded-lg p-2">
            <span className="truncate">{walletAddress}</span>
            <button onClick={copyToClipboard} className="p-1.5 hover:bg-gray-700 rounded-lg">
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Balances */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 shadow-lg p-4">
          <h2 className="font-semibold mb-2">Balances</h2>
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
        </div>
      </div>

      {/* Add Funds + Withdraw */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 shadow-lg p-4 flex flex-col justify-between">
          <div>
            <h2 className="font-semibold mb-2">Withdraw</h2>
            <p className="text-gray-400 text-sm mb-4">
              Withdraw securely. Confirmation modal ensures safety.
            </p>
          </div>
          <button
            onClick={() => setIsWithdrawOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
          >
            <ArrowDownToLine size={14} />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Transaction Table */}
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
            {filteredTransactions.length ? (
              filteredTransactions.map((txn, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-gray-700/50">
                  <td className="py-2 px-3">{idx + 1}</td>
                  <td className="py-2 px-3 flex items-center truncate max-w-[350px]">
                    <span>{txn.hash}</span>
                    <CopyButtonIcon text={txn.hash} />
                  </td>
                  <td className="py-2 px-3">{txn.type}</td>
                  <td className="py-2 px-3">{txn.amount}</td>
                  <td className="py-2 px-3">{txn.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Withdraw Modal */}
      <Dialog open={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2">
          <div className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Confirm Withdrawal</h3>
            <input
              type="text"
              placeholder="Enter amount"
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 mb-4 text-white text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsWithdrawOpen(false)}
                className="px-4 py-2 bg-gray-700 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => toast.success("✔ Withdrawal confirmed!")}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
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

export default BotWallet;




// import React, { useState, useEffect } from "react";
// import { Copy, RefreshCw, ArrowDownToLine, FileText } from "lucide-react";
// import { Dialog } from "@headlessui/react";
// import QRCode from "react-qr-code";
// import toast, { Toaster } from "react-hot-toast";
// import * as XLSX from "xlsx";

// const CopyButtonIcon = ({ text }) => {
//   const handleCopy = () => {
//     navigator.clipboard.writeText(text);
//     toast.success("✅ Copied!");
//   };
//   return (
//     <button
//       onClick={handleCopy}
//       className="ml-2 p-1 rounded hover:bg-gray-700 transition"
//     >
//       <Copy size={16} />
//     </button>
//   );
// };

// const BotWallet = () => {
//   const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
//   const [walletAddress] = useState("0xaba27d5704fce8ddd8ee5a6596cb4c759aba03a4");

//   // Wallet Balances
//   const [balances, setBalances] = useState({
//     usdt: 0,
//     token: 0,
//     bnb: 0,
//   });

//   useEffect(() => {
//     const fetchBalances = async () => {
//       try {
//         const response = await fetch(
//           "https://volumebot.furfoori.com/api/wallets-current-balances"
//         );
//         const data = await response.json();
//         if (data.central_wallet) {
//           setBalances({
//             usdt: data.central_wallet.usdt_balance,
//             token: data.central_wallet.token_balance,
//             bnb: data.central_wallet.bnb_balance,
//           });
//         }
//       } catch (e) {
//         toast.error("Failed to fetch wallet balances");
//       }
//     };

//     fetchBalances();
//     // Auto-refresh every 30 seconds
//     const interval = setInterval(fetchBalances, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   // Transactions
//   const [filterType, setFilterType] = useState("all");
//   const [search, setSearch] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const [transactions] = useState([
//     { hash: "0xabc123...", type: "Deposit", amount: "100 USDT", date: "2025-09-10", currency: "USDT" },
//     { hash: "0xdef456...", type: "Withdraw", amount: "50 TOKEN", date: "2025-09-12", currency: "TOKEN" },
//     { hash: "0xghi789...", type: "Deposit", amount: "0.1 BNB", date: "2025-09-13", currency: "BNB" },
//   ]);

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(walletAddress);
//     toast.success("✅ Wallet address copied!");
//   };

//   const filteredTransactions = transactions
//     .filter((txn) => (filterType === "all" ? true : txn.type === filterType))
//     .filter((txn) => !search || txn.hash.toLowerCase().includes(search.toLowerCase()))
//     .filter((txn) => (!startDate || txn.date >= startDate) && (!endDate || txn.date <= endDate));

//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(
//       filteredTransactions.map((txn, idx) => ({
//         "S No": idx + 1,
//         "Txn Hash": txn.hash,
//         Type: txn.type,
//         Amount: txn.amount,
//         Date: txn.date,
//       }))
//     );
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Transactions");
//     XLSX.writeFile(wb, "transactions.xlsx");
//   };

//   const qrValue = `ethereum:${walletAddress}?token=USDT`;

//   return (
//     <div className="p-2 sm:p-4 space-y-6 text-white max-w-7xl mx-auto">
//       <Toaster position="top-right" />

//       {/* Wallet Info */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Wallet Address */}
//         <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 shadow-lg p-4">
//           <h2 className="font-semibold mb-2">Wallet Address</h2>
//           <div className="flex items-center justify-between bg-gray-800 rounded-lg p-2">
//             <span className="truncate">{walletAddress}</span>
//             <button onClick={copyToClipboard} className="p-1.5 hover:bg-gray-700 rounded-lg">
//               <Copy size={16} />
//             </button>
//           </div>
//         </div>

//         {/* Balances */}
//         <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 shadow-lg p-4">
//           <h2 className="font-semibold mb-2">Balances</h2>
//           <div className="space-y-1">
//             <div className="flex justify-between">
//               <span>USDT:</span>
//               <span>{balances.usdt}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Token:</span>
//               <span>{balances.token}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>BNB (Gas):</span>
//               <span>{balances.bnb}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add Funds + Withdraw */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 shadow-lg p-4 flex flex-col items-center space-y-3">
//           <h2 className="font-semibold">Add Funds</h2>
//           <QRCode value={qrValue} size={150} />
//           <p className="text-gray-400 text-center text-sm">
//             Scan QR or copy wallet address to deposit funds.
//           </p>
//           <p className="text-gray-500 text-xs text-center">
//             Manual Transfer: Send only <strong>BEP-20</strong> USDT tokens.
//           </p>
//         </div>
//         <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 shadow-lg p-4 flex flex-col justify-between">
//           <div>
//             <h2 className="font-semibold mb-2">Withdraw</h2>
//             <p className="text-gray-400 text-sm mb-4">
//               Withdraw securely. Confirmation modal ensures safety.
//             </p>
//           </div>
//           <button
//             onClick={() => setIsWithdrawOpen(true)}
//             className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
//           >
//             <ArrowDownToLine size={14} />
//             <span>Withdraw</span>
//           </button>
//         </div>
//       </div>

//       {/* Transaction Table */}
//       <div className="overflow-x-auto bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-lg p-6 space-y-4">
//         <h2 className="text-2xl font-semibold text-white mb-4">Wallet Management</h2>

//         {/* Filters */}
//         <div className="flex flex-wrap items-center gap-2 mb-4">
//           <input
//             type="text"
//             placeholder="Search txn hash..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="flex-1 min-w-[150px] px-3 py-2 rounded border border-gray-600 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             className="flex-1 min-w-[120px] px-3 py-2 rounded border border-gray-600 bg-gray-800 text-gray-200"
//           >
//             <option value="all">All</option>
//             <option value="Deposit">Deposits</option>
//             <option value="Withdraw">Withdrawals</option>
//           </select>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="flex-1 min-w-[120px] px-3 py-2 rounded border border-gray-600 bg-gray-800 text-gray-200"
//           />
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="flex-1 min-w-[120px] px-3 py-2 rounded border border-gray-600 bg-gray-800 text-gray-200"
//           />
//           <button
//             onClick={exportToExcel}
//             className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors flex-none"
//           >
//             <FileText size={16} /> Export
//           </button>
//         </div>


//         <table className="w-full text-sm text-left border-collapse table-auto">
//           <thead className="bg-gray-800 text-gray-300">
//             <tr>
//               <th className="py-2 px-3">S No</th>
//               <th className="py-2 px-3 w-[350px]">Txn Hash</th>
//               <th className="py-2 px-3">Type</th>
//               <th className="py-2 px-3">Amount</th>
//               <th className="py-2 px-3">Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredTransactions.length ? (
//               filteredTransactions.map((txn, idx) => (
//                 <tr key={idx} className="border-b border-gray-800 hover:bg-gray-700/50">
//                   <td className="py-2 px-3">{idx + 1}</td>
//                   <td className="py-2 px-3 flex items-center truncate max-w-[350px]">
//                     <span>{txn.hash}</span>
//                     <CopyButtonIcon text={txn.hash} />
//                   </td>
//                   <td className="py-2 px-3">{txn.type}</td>
//                   <td className="py-2 px-3">{txn.amount}</td>
//                   <td className="py-2 px-3">{txn.date}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center py-4 text-gray-500">
//                   No transactions found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Withdraw Modal */}
//       <Dialog open={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} className="relative z-50">
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2">
//           <div className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
//             <h3 className="text-lg font-semibold mb-4">Confirm Withdrawal</h3>
//             <input
//               type="text"
//               placeholder="Enter amount"
//               className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 mb-4 text-white text-sm"
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setIsWithdrawOpen(false)}
//                 className="px-4 py-2 bg-gray-700 rounded-lg text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => toast.success("✔ Withdrawal confirmed!")}
//                 className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default BotWallet;


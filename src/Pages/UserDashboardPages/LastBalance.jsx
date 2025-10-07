import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../Hooks/useAuth";
import { FaRegCopy, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Copy button component
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
      title={copied ? "Copied!" : "Copy ID"}
      className={`ml-2 p-1 rounded-full ${
        copied ? "bg-green-600 text-white" : "bg-gray-700 text-white"
      }`}
      style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
    >
      <FaRegCopy size={14} />
    </button>
  );
}

const LastBalance = () => {
  const { user } = useAuth();
  const getToday = () => new Date().toISOString().split("T")[0];
  const getMonthAgo = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  };

  const itemsPerPage = 10;

  // States
  const [balances, setBalances] = useState(() => {
    const cached = localStorage.getItem("lastBalances");
    return cached ? JSON.parse(cached) : [];
  });
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(getMonthAgo());
  const [endDate, setEndDate] = useState(getToday());
  const [loading, setLoading] = useState(balances.length === 0);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(balances.length);

  // Fetch balances
  const fetchBalances = useCallback(
    async (page = 1) => {
      if (!user?.token) return;

      try {
        setError("");
        const start = new Date(startDate).toISOString();
        const end = new Date(new Date(endDate).setHours(23, 59, 59, 999)).toISOString();

        const url = `https://volumebot.furfoori.com/api/daily-last-balances?page=${page}&limit=${itemsPerPage}&startDate=${start}&endDate=${end}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (res.data?.success) {
          const { balances, pagination } = res.data.data;
          setBalances(balances || []);
          setTotalItems(pagination?.total || balances.length);
          setTotalPages(pagination?.totalPages || 1);

          localStorage.setItem("lastBalances", JSON.stringify(balances || []));
        } else {
          setError("Failed to fetch balances.");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Error fetching balances.");
      } finally {
        setLoading(false);
      }
    },
    [user, startDate, endDate, itemsPerPage]
  );

  useEffect(() => {
    if (user?.token) fetchBalances(currentPage);

    const interval = setInterval(() => {
      if (user?.token) fetchBalances(currentPage);
    }, 30000);

    return () => clearInterval(interval);
  }, [user, currentPage, fetchBalances]);

  // Filtered balances by search
  const filteredBalances = balances.filter(
    (b) =>
      b.id.toString().includes(search) ||
      b.total_usdt.includes(search) ||
      b.total_bnb.includes(search) ||
      b.total_token.includes(search)
  );

  // Export to Excel
  const exportToExcel = () => {
    if (filteredBalances.length === 0) return;

    const exportData = filteredBalances.map((b) => ({
      ID: b.id,
      "Total USDT": parseFloat(b.total_usdt).toFixed(6),
      "Total BNB": parseFloat(b.total_bnb).toFixed(6),
      "Total Token": parseFloat(b.total_token).toFixed(6),
      Timestamp: new Date(b.timestamp).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Last Balances");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Last_Balances.xlsx");
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
    <div className="p-4 w-full max-w-full bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl">
      <h2 className="text-2xl font-semibold mb-4 text-left">Last Balances</h2>

      {/* Filters */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 w-full sm:w-auto justify-end items-center flex-col sm:flex-row">
          <DateInput value={startDate} onChange={(e) => setStartDate(e.target.value)} max={endDate} />
          <DateInput value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} max={getToday()} />
        </div>

        <div className="flex gap-2 w-full sm:w-auto justify-end items-center">
          <input
            type="text"
            placeholder="Search by ID or balance..."
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
        {loading && balances.length === 0 ? (
          <p className="text-white text-center py-10">Loading balances...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-10">{error}</p>
        ) : (
          <table className="w-full text-sm text-left border-collapse table-auto">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Total USDT</th>
                <th className="py-2 px-3">Total BNB</th>
                <th className="py-2 px-3">Total Token</th>
                <th className="py-2 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredBalances.length > 0 ? (
                filteredBalances.map((b, i) => (
                  <tr key={i} className="border-b border-gray-800 hover:bg-gray-700/50">
                    <td className="py-2 px-3 flex items-center">
                      <span>{b.id}</span>
                      <CopyButtonIcon text={b.id} />
                    </td>
                    <td className="py-2 px-3">{parseFloat(b.total_usdt).toFixed(6)}</td>
                    <td className="py-2 px-3">{parseFloat(b.total_bnb).toFixed(6)}</td>
                    <td className="py-2 px-3">{parseFloat(b.total_token).toFixed(6)}</td>
                    <td className="py-2 px-3 whitespace-nowrap">{new Date(b.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-400">
                    No balances found
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
            Page {currentPage} of {totalPages} ({totalItems} balances)
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
  );
};

export default LastBalance;





// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { useAuth } from "../../Hooks/useAuth";
// import { FaRegCopy, FaFileExcel } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// // Copy button component
// function CopyButtonIcon({ text }) {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(text).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   };

//   return (
//     <button
//       onClick={handleCopy}
//       title={copied ? "Copied!" : "Copy ID"}
//       className={`ml-2 p-1 rounded-full ${
//         copied ? "bg-green-600 text-white" : "bg-gray-700 text-white"
//       }`}
//       style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
//     >
//       <FaRegCopy size={14} />
//     </button>
//   );
// }

// const LastBalance = () => {
//   const { user } = useAuth();
//   const token = user?.token;

//   // ✅ Initialize from cache
//   const cachedBalances = localStorage.getItem("lastBalances");
//   const [balances, setBalances] = useState(
//     cachedBalances ? JSON.parse(cachedBalances) : []
//   );
//   const [loading, setLoading] = useState(cachedBalances ? false : true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");

//   const fetchBalances = useCallback(async () => {
//     if (!token) return;

//     try {
//       const response = await axios.get(
//         "https://volumebot.furfoori.com/api/daily-last-balances",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data?.success) {
//         setBalances(response.data.data.balances);
//         localStorage.setItem(
//           "lastBalances",
//           JSON.stringify(response.data.data.balances)
//         );
//       } else {
//         setError("Failed to fetch balances.");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Error fetching balances.");
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);

//   useEffect(() => {
//     fetchBalances();
//     // ✅ Optional: Poll every 30s for latest balances
//     const interval = setInterval(fetchBalances, 30000);
//     return () => clearInterval(interval);
//   }, [fetchBalances]);

//   // Filter balances based on search
//   const filteredBalances = balances.filter(
//     (b) =>
//       b.id.toString().includes(search) ||
//       b.total_usdt.includes(search) ||
//       b.total_bnb.includes(search) ||
//       b.total_token.includes(search)
//   );

//   const exportToExcel = () => {
//     if (filteredBalances.length === 0) return;

//     const exportData = filteredBalances.map((b) => ({
//       ID: b.id,
//       "Total USDT": b.total_usdt,
//       "Total BNB": b.total_bnb,
//       "Total Token": b.total_token,
//       Timestamp: new Date(b.timestamp).toLocaleString(),
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Last Balances");

//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(dataBlob, "Last_Balances.xlsx");
//   };

//   return (
//     <div className="p-4 w-full max-w-full">
//       <div className="overflow-x-auto w-full bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-lg p-3 sm:p-6 space-y-4">
//         <h2 className="text-2xl font-semibold mb-4 text-left">Last Balances</h2>

//         {/* Search & Export */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
//           <input
//             type="text"
//             placeholder="Search by ID or balance..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="px-3 py-2 w-full sm:w-[300px] rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-br from-gray-900 to-black text-gray-200"
//           />
//           <button
//             onClick={exportToExcel}
//             className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
//           >
//             <FaFileExcel /> Export to Excel
//           </button>
//         </div>

//         {loading && balances.length === 0 ? (
//           <p className="text-white text-center py-10">Loading balances...</p>
//         ) : error ? (
//           <p className="text-red-500 text-center py-10">{error}</p>
//         ) : (
//           <table className="w-full text-sm text-left border-collapse table-auto">
//             <thead className="bg-gray-800 text-gray-300">
//               <tr>
//                 <th className="py-2 px-3">ID</th>
//                 <th className="py-2 px-3">Total USDT</th>
//                 <th className="py-2 px-3">Total BNB</th>
//                 <th className="py-2 px-3">Total Token</th>
//                 <th className="py-2 px-3">Timestamp</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredBalances.map((balance, idx) => (
//                 <tr key={idx} className="border-b border-gray-800 hover:bg-gray-700/50">
//                   <td className="py-2 px-3 flex items-center">
//                     <span>{balance.id}</span>
//                     <CopyButtonIcon text={balance.id} />
//                   </td>
//                   <td className="py-2 px-3">{parseFloat(balance.total_usdt).toFixed(6)}</td>
//                   <td className="py-2 px-3">{parseFloat(balance.total_bnb).toFixed(6)}</td>
//                   <td className="py-2 px-3">{parseFloat(balance.total_token).toFixed(6)}</td>
//                   <td className="py-2 px-3 whitespace-nowrap">
//                     {new Date(balance.timestamp).toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LastBalance;




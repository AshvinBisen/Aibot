import React, { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const TradeHistory = () => {
  // Default Dates
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const [trades] = useState([
    { id: 1, type: "Buy", tokenAmt: 50, usdtAmt: 100, price: 2, timestamp: "2025-09-10 12:34", txHash: "0xabc123..." },
    { id: 2, type: "Sell", tokenAmt: 20, usdtAmt: 40, price: 2, timestamp: "2025-09-11 14:20", txHash: "0xdef456..." },
    { id: 3, type: "Buy", tokenAmt: 30, usdtAmt: 60, price: 2, timestamp: "2025-09-12 09:10", txHash: "0xghi789..." },
  ]);

  const [filterType, setFilterType] = useState("All");
  const [filterTrend, setFilterTrend] = useState("All");
  const [startDate, setStartDate] = useState(sevenDaysAgo);
  const [endDate, setEndDate] = useState(today);

  const filteredTrades = trades.filter(trade => {
    const matchType = filterType === "All" || trade.type === filterType;
    const matchTrend = filterTrend === "All" || (filterTrend === "Up" ? trade.price > 0 : trade.price <= 0);
    const matchStart = startDate ? new Date(trade.timestamp) >= startDate : true;
    const matchEnd = endDate ? new Date(trade.timestamp) <= endDate : true;
    return matchType && matchTrend && matchStart && matchEnd;
  });

  // Summary totals
  const totalBuys = filteredTrades.filter(t => t.type === "Buy").reduce((a,b)=>a+b.tokenAmt,0);
  const totalSells = filteredTrades.filter(t => t.type === "Sell").reduce((a,b)=>a+b.tokenAmt,0);
  const avgPrice = filteredTrades.length ? (filteredTrades.reduce((a,b)=>a+b.price,0)/filteredTrades.length).toFixed(2) : 0;

  // Chart Data
  const lineChartData = {
    labels: filteredTrades.map(t => t.timestamp),
    datasets: [{ label: "Price (USDT)", data: filteredTrades.map(t => t.price), borderColor: "#7CFC00", backgroundColor: "rgba(124,252,0,0.2)" }]
  };

  const barChartData = {
    labels: filteredTrades.map(t => t.timestamp),
    datasets: [{
      label: "Volume (Token)",
      data: filteredTrades.map(t => t.tokenAmt),
      backgroundColor: filteredTrades.map(t => t.type==="Buy"?"rgba(34,197,94,0.7)":"rgba(239,68,68,0.7)")
    }]
  };

  return (
    <div className="p-4 sm:p-6 space-y-8 text-white">

      {/* Filters + Dates + Export */}
      <div className="bg-gradient-to-br from-gray-900 to-black p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between border border-gray-800 shadow-md gap-4">

        {/* Left: Date Pickers */}
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
          <div className="flex flex-col">
            <label className="text-gray-400 text-sm mb-1">Start Date</label>
            <DatePicker 
              selected={startDate} 
              onChange={setStartDate} 
              className="bg-gray-800 p-2 rounded-xl text-white w-full sm:w-auto"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-400 text-sm mb-1">End Date</label>
            <DatePicker 
              selected={endDate} 
              onChange={setEndDate} 
              className="bg-gray-800 p-2 rounded-xl text-white w-full sm:w-auto"
            />
          </div>
        </div>

        {/* Middle: Type & Trend Filters */}
        <div className="flex gap-3 items-center w-full sm:w-auto">
          <select 
            className="bg-gray-800 p-2 rounded-xl text-white"
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
          <select 
            className="bg-gray-800 p-2 rounded-xl text-white"
            value={filterTrend} 
            onChange={e => setFilterTrend(e.target.value)}
          >
            <option value="All">All Trends</option>
            <option value="Up">Up</option>
            <option value="Down">Down</option>
          </select>
        </div>

        {/* Right: Export CSV */}
        <div className="w-full sm:w-auto flex justify-end">
          <CSVLink 
            data={filteredTrades} 
            filename="trade-history.csv"
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl font-semibold shadow-md"
          >
            Export CSV
          </CSVLink>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-5 text-center shadow-md">
          <h3 className="text-gray-400 text-sm">Total Buys</h3>
          <p className="text-green-400 font-bold text-2xl">{totalBuys}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-5 text-center shadow-md">
          <h3 className="text-gray-400 text-sm">Total Sells</h3>
          <p className="text-red-400 font-bold text-2xl">{totalSells}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-5 text-center shadow-md">
          <h3 className="text-gray-400 text-sm">Avg Price</h3>
          <p className="text-indigo-400 font-bold text-2xl">{avgPrice} USDT</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-black p-5 rounded-2xl border border-gray-800 shadow-xl">
          <h2 className="text-white font-bold mb-3">Price Over Time</h2>
          <Line data={lineChartData} />
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-black p-5 rounded-2xl border border-gray-800 shadow-xl">
          <h2 className="text-white font-bold mb-3">Volume by Trend</h2>
          <Bar data={barChartData} />
        </div>
      </div>

      {/* Trades Table */}
      <div className="bg-gradient-to-br from-gray-900 to-black p-5 rounded-2xl border border-gray-800 shadow-xl overflow-x-auto">
        <h2 className="text-white font-bold mb-4">Recent Trades</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Token Amt</th>
              <th className="px-4 py-2">USDT Amt</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Tx Hash</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.length ? filteredTrades.map(t => (
              <tr key={t.id} className="border-t border-gray-800 text-center hover:bg-gray-800/70 transition">
                <td className="px-4 py-2">{t.id}</td>
                <td className="px-4 py-2 flex justify-center items-center gap-1">
                  {t.type==="Buy" ? <ArrowUp size={16} className="text-green-400"/> : <ArrowDown size={16} className="text-red-400"/>}
                  {t.type}
                </td>
                <td className="px-4 py-2">{t.tokenAmt}</td>
                <td className="px-4 py-2">{t.usdtAmt}</td>
                <td className="px-4 py-2">{t.price}</td>
                <td className="px-4 py-2">{t.timestamp}</td>
                <td className="px-4 py-2 text-indigo-400 truncate max-w-[150px]"><a href={`https://bscscan.com/tx/${t.txHash}`} target="_blank" rel="noopener noreferrer">{t.txHash}</a></td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">No trades found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TradeHistory;

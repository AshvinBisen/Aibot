import React, { useState } from "react";
import {
  FaUserCircle,
  FaChartLine,
  FaUsers,
  FaDollarSign,
  FaClipboardList,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaTelegramPlane,
  FaLinkedinIn,
} from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { FaCheckCircle } from "react-icons/fa";
import logo from '../../assets/logo.png'

import MyHistory from './SubComponets/MyHistory'


// Dummy Data
const weeklyData = [
  { date: "Mon", profits: 200, deposits: 100, withdrawals: 50 },
  { date: "Tue", profits: 400, deposits: 150, withdrawals: 100 },
  { date: "Wed", profits: 300, deposits: 120, withdrawals: 80 },
  { date: "Thu", profits: 500, deposits: 200, withdrawals: 120 },
  { date: "Fri", profits: 450, deposits: 180, withdrawals: 90 },
  { date: "Sat", profits: 600, deposits: 220, withdrawals: 110 },
  { date: "Sun", profits: 550, deposits: 210, withdrawals: 100 },
];

const monthlyData = [
  { date: "Jan", profits: 3200, deposits: 1500, withdrawals: 800 },
  { date: "Feb", profits: 4100, deposits: 1800, withdrawals: 1200 },
  { date: "Mar", profits: 3800, deposits: 1600, withdrawals: 900 },
  { date: "Apr", profits: 4500, deposits: 2000, withdrawals: 1400 },
  { date: "May", profits: 5000, deposits: 2200, withdrawals: 1500 },
  { date: "Jun", profits: 4700, deposits: 2100, withdrawals: 1300 },
  { date: "Jul", profits: 5200, deposits: 2300, withdrawals: 1600 },
];

const yearlyData = [
  { date: "2020", profits: 25000, deposits: 12000, withdrawals: 7000 },
  { date: "2021", profits: 32000, deposits: 15000, withdrawals: 9000 },
  { date: "2022", profits: 40000, deposits: 18000, withdrawals: 11000 },
  { date: "2023", profits: 45000, deposits: 20000, withdrawals: 13000 },
  { date: "2024", profits: 50000, deposits: 22000, withdrawals: 15000 },
];


const lastTrades = [
  {
    date: "2025-09-13 21:15:51",
    pnl: "-1.23%",
    tradingPortfolio: "$210.00",
    profitPortfolio: "$207.41",
  },
  {
    date: "2025-09-12 19:22:10",
    pnl: "+2.45%",
    tradingPortfolio: "$200.00",
    profitPortfolio: "$205.10",
  },
  {
    date: "2025-09-11 18:05:40",
    pnl: "+1.10%",
    tradingPortfolio: "$190.00",
    profitPortfolio: "$192.20",
  },
  {
    date: "2025-09-13 21:15:51",
    pnl: "-1.23%",
    tradingPortfolio: "$210.00",
    profitPortfolio: "$207.41",
  },
  {
    date: "2025-09-12 19:22:10",
    pnl: "+2.45%",
    tradingPortfolio: "$200.00",
    profitPortfolio: "$205.10",
  },
  {
    date: "2025-09-11 18:05:40",
    pnl: "+1.10%",
    tradingPortfolio: "$190.00",
    profitPortfolio: "$192.20",
  },
  {
    date: "2025-09-12 19:22:10",
    pnl: "+2.45%",
    tradingPortfolio: "$200.00",
    profitPortfolio: "$205.10",
  },

];

const trades = [
  { bot: "Demo User 18-09-25  04:06:09", pair: "VOXELUSDT +1.27%", profitlose: "+$2.63" },
  { bot: "Demo User 18-09-25  01:21:31", pair: "DUSDT -1.12%", profitlose: "-$2.37" },
  { bot: "Demo User 17-09-25  22:20:23", pair: "EIGENUSDT +0.14%", profitlose: "+$0.29" },
  { bot: "Demo User 17-09-25  19:31:05", pair: "ROSEUSDT +7.01%", profitlose: "+$13.76" },
  { bot: "Demo User 17-09-25  15:36:12", pair: "AUSDT -0.17%", profitlose: "-$0.36" },
  { bot: "Demo User 17-09-25  10:49:00", pair: "JAMUSDT +1.35%", profitlose: "+$2.79" },
  { bot: "Demo User 17-09-25  09:27:15", pair: "COMPUSDT -1.13%", profitlose: "-$2.39" },
  { bot: "Demo User 17-09-25  06:37:38", pair: "TRUMPUSDT -1.12%", profitlose: "-$2.37" },
  { bot: "Demo User 17-09-25  05:34:32", pair: "MEUSDT -1.31%", profitlose: "-$2.79" },
  { bot: "Demo User 17-09-25  05:10:35", pair: "POLYXUSDT +1.14%", profitlose: "+$2.37" },
];








const Dashboard = () => {
  const [chartType, setChartType] = useState("weekly");

  const getData = () => {
    if (chartType === "weekly") return weeklyData;
    if (chartType === "monthly") return monthlyData;
    return yearlyData;
  };

  // Calculate summary totals
  const totals = getData().reduce(
    (acc, item) => {
      acc.profits += item.profits;
      acc.deposits += item.deposits;
      acc.withdrawals += item.withdrawals;
      return acc;
    },
    { profits: 0, deposits: 0, withdrawals: 0 }
  );


  // const [filter, setFilter] = useState("all");

  // const filteredData =
  //   filter === "all"
  //     ? allHistory
  //     : allHistory.filter((item) => item.type === filter);








  return (
    <div className=" p-1 sm:p-2 md:p-4 lg:p-6 space-y-8 pt-4">
      {/* Top 5 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Account */}
        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-5 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-400 text-sm font-medium">Account</h3>
            <FaUserCircle className="text-green-400" size={22} />
          </div>
          <p className="text-2xl font-bold text-white">$200</p>
          <p className="text-sm text-green-400">0%</p>
        </div>

        {/* All Time PNL */}
        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-5 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-400 text-sm font-medium">All Time PNL</h3>
            <FaChartLine className="text-blue-400" size={22} />
          </div>
          <p className="text-2xl font-bold text-white">$400</p>
          <p className="text-sm text-green-400">+78.99%</p>
        </div>

         {/* Ai Bot */}
        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-5 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-400 text-sm font-medium">AI Bots</h3>
            <FaDollarSign className="text-yellow-400" size={22} />
          </div>
          <p className="text-2xl font-bold text-white">1</p>
          <p className="text-sm text-green-400">200 Trades</p>
        </div>


        {/* Direct Referrals */}
        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-5 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-400 text-sm font-medium">Direct Referrals</h3>
            <FaUsers className="text-purple-400" size={22} />
          </div>
          <p className="text-2xl font-bold text-white">10</p>
          <p className="text-sm text-green-400">Active</p>
        </div>

       
        
        {/* Active Plans */}
        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-5 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-400 text-sm font-medium">Total Members</h3>
            <FaClipboardList className="text-pink-400" size={22} />
          </div>
          <p className="text-2xl font-bold text-white">30</p>
          <p className="text-sm text-green-400">Running</p>
        </div>
      </div>

      {/* 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: AI Trading Overview */}
        <div className="lg:col-span-2 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-3 md:p-4 lg:p-6 shadow-lg">
          <div className="flex justify-between items-start  sm:items-center mb-4 flex-col sm:flex-row gap-3 ">
            <div>
              <h2 className="text-lg font-bold">AI Trading Overview</h2>
              <p className="text-sm text-gray-400">
                ({chartType === "weekly" ? "7 Day PNL" : chartType === "monthly" ? "Monthly PNL" : "Yearly PNL"})
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <button
                className={`hover:text-green-400 ${chartType === "weekly" && "text-green-400 font-bold"}`}
                onClick={() => setChartType("weekly")}
              >
                Weekly
              </button>
              <button
                className={`hover:text-green-400 ${chartType === "monthly" && "text-green-400 font-bold"}`}
                onClick={() => setChartType("monthly")}
              >
                Monthly
              </button>
              <button
                className={`hover:text-green-400 ${chartType === "yearly" && "text-green-400 font-bold"}`}
                onClick={() => setChartType("yearly")}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Totals Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 text-center">
            <div className="p-3 rounded-lg bg-black/60 border border-gray-700">
              <p className="text-gray-400 text-sm">Profits</p>
              <p className="text-green-400 font-bold">${totals.profits}</p>
            </div>
            <div className="p-3 rounded-lg bg-black/60 border border-gray-700">
              <p className="text-gray-400 text-sm">Deposits</p>
              <p className="text-blue-400 font-bold">${totals.deposits}</p>
            </div>
            <div className="p-3 rounded-lg bg-black/60 border border-gray-700">
              <p className="text-gray-400 text-sm">Withdrawals</p>
              <p className="text-red-400 font-bold">${totals.withdrawals}</p>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={getData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="profits" stroke="#7CFC00" strokeWidth={3} />
              <Line type="monotone" dataKey="deposits" stroke="#00CED1" strokeWidth={3} />
              <Line type="monotone" dataKey="withdrawals" stroke="#FF0000" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Time & Referral */}
        <div className="lg:col-span-1 space-y-6">
          {/* Time Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-black/70 border border-green-400 shadow-lg">
              <p className="font-semibold text-green-400 text-xs uppercase tracking-wide">
                Trading Server Time (UTC)
              </p>
              <p className="text-white text-sm mt-2">17-Sept-2025, 06:46 AM</p>
            </div>
            <div className="p-4 rounded-xl bg-black/70 border border-green-400 shadow-lg">
              <p className="font-semibold text-green-400 text-xs uppercase tracking-wide">
                Indian Time (IST)
              </p>
              <p className="text-white text-sm mt-2">17-Sept-2025, 12:16 PM</p>
            </div>
          </div>

          {/* Referral Section */}
          <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl shadow-xl border border-gray-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              🚀 <span className="text-green-400">Referred By:</span>
              <span className="text-gray-300">demoUser</span>
            </h2>

            <h2 className="mt-6 text-lg font-bold text-white">Your Referral Link</h2>
            <div className="mt-3 p-3 rounded-lg bg-black/60 border border-gray-700 text-green-400 font-mono text-xs break-all">
              https://dummydata.com/register?ref=demo123
            </div>

            <button
              className="mt-4 px-4 py-2 rounded-lg flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold hover:scale-105 transition-all"
              onClick={() => {
                navigator.clipboard.writeText("https://dummydata.com/register?ref=demo123");
                const msg = document.getElementById("copiedMessage");
                msg.classList.remove("hidden");
                setTimeout(() => msg.classList.add("hidden"), 2000);
              }}
            >
              <MdContentCopy /> Copy Link
            </button>
            <div id="copiedMessage" className="hidden text-xs text-green-400 mt-2">
              ✅ Link copied to clipboard!
            </div>

            {/* Social Share */}
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-3">Share with Friends:</h3>
              <div className="flex flex-wrap gap-2">
                <a
                  href="#"
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-lg transition-all"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-lg transition-all"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-500 hover:bg-green-600 text-white text-lg transition-all"
                >
                  <FaWhatsapp />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-400 hover:bg-sky-500 text-white text-lg transition-all"
                >
                  <FaTelegramPlane />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-lg transition-all"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Left Side - Last Trades */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl p-6 ">
          <h2 className="text-lg font-semibold text-white mb-4">
            Last 7 Trades by Bot
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl  text-white ">
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">PNL</th>
                  <th className="px-4 py-2 font-medium">Trading Portfolio</th>
                  <th className="px-4 py-2 font-medium">Profit Portfolio</th>
                </tr>
              </thead>
              <tbody>
                {lastTrades.map((trade, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-800 hover:bg-gray-800/70 transition"
                  >
                    <td className="px-4 py-2 text-gray-300">{trade.date}</td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        trade.pnl.includes("-")
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {trade.pnl}
                    </td>
                    <td className="px-4 py-2 text-gray-300">
                      {trade.tradingPortfolio}
                    </td>
                    <td className="px-4 py-2 text-gray-300">
                      {trade.profitPortfolio}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl p-6">
            {/* Header */}
            <div className="flex items-start sm:items-center justify-between mb-6 flex-col sm:flex-row gap-3 ">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                My Bots
              </h2>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-500/20 text-red-400 border border-red-500/40">
                Today Profit: -$5.00 (₹ -442.32)
              </span>
            </div>


          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl hover:shadow-green-500/10 hover:border-green-400/40 transition-all p-6">
              {/* Top Row */}
              <div className="flex items-center justify-between flex-col sm:flex-row gap-3">
                {/* Left: Image + Name/PNL */}
                <div className="flex items-center gap-4">
                  <img
                    src={logo}
                    alt="Bot"
                    className="w-16 h-16 rounded-full border border-gray-600 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">Demo User</h3>
                      <FaCheckCircle className="text-green-400" />
                    </div>
                    <p className="text-green-400 text-sm font-semibold mt-1">
                      PNL +75.71%
                    </p>
                  </div>
                </div>

                {/* Right: Profit Badge with Label */}
                <span className="px-5 py-2 rounded-xl bg-green-500/20 border border-green-500/40 text-green-400 font-bold text-lg shadow-sm flex items-center gap-2">
                  Bot Profit: <span className="text-white">+$158.99</span>
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-700 my-4"></div>

                {/* Bottom: Details */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm res ">
                  {/* Bot Amount */}
                  <div className="rounded-xl p-4 border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 hover:border-green-400/40 transition-all">
                    <p className="text-gray-400 text-xs mb-1">Bot Amount</p>
                    <p className="text-white font-semibold text-base">$210.00</p>
                  </div>

                  {/* Bot Amount INR */}
                  <div className="rounded-xl p-4 border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 hover:border-green-400/40 transition-all">
                    <p className="text-gray-400 text-xs mb-1">Bot Amount (INR)</p>
                    <p className="text-white font-semibold text-base">₹18,585</p>
                  </div>

                  {/* Total Balance */}
                  <div className="rounded-xl p-4 border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 hover:border-green-400/40 transition-all">
                    <p className="text-gray-400 text-xs mb-1">Total Balance</p>
                    <p className="text-white font-semibold text-base">$368.99</p>
                  </div>

                  {/* Total Balance INR */}
                  <div className="rounded-xl p-4 border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 hover:border-green-400/40 transition-all">
                    <p className="text-gray-400 text-xs mb-1">Total Balance (INR)</p>
                    <p className="text-white font-semibold text-base">₹32,655.70</p>
                  </div>

                  {/* Today Profit */}
                  <div className="rounded-xl p-4 border border-red-500/40 bg-gradient-to-br from-gray-900 to-gray-800 hover:border-red-400 transition-all">
                    <p className="text-gray-400 text-xs mb-1">Today Profit</p>
                    <p className="text-red-400 font-bold text-base">- $5.00</p>
                  </div>

                  {/* Today Profit INR */}
                  <div className="rounded-xl p-4 border border-red-500/40 bg-gradient-to-br from-gray-900 to-gray-800 hover:border-red-400 transition-all">
                    <p className="text-gray-400 text-xs mb-1">Today Profit (INR)</p>
                    <p className="text-red-400 font-bold text-base">- ₹437.18</p>
                  </div>
                </div>


          </div>
        </div>


      </div>

      {/* Section 4  */}

       <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl p-6 ">
      <h2 className="text-lg font-semibold text-white mb-4">
        My Recent trades
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl text-white">
              <th className="px-4 py-2 font-medium">AI Bots</th>
              <th className="px-4 py-2 font-medium">Trading Pairs</th>
              <th className="px-4 py-2 font-medium">Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr
                key={index}
                className="border-t border-gray-800 hover:bg-gray-800/70 transition"
              >
                <td className="px-4 py-2 text-gray-300">{trade.bot}</td>
                <td className="px-4 py-2 text-gray-300">{trade.pair}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    trade.profitlose.includes("-")
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {trade.profitlose}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>


      {/* SECTION-5  */}

   
<MyHistory />
    






    </div>
  );
};

export default Dashboard;

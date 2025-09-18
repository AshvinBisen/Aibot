// src/Pages/UserDashboardPages/TradeHistory.jsx
import React from "react";

const TradeHistory = () => {
  const trades = [
    { id: 1, pair: "BTC/USDT", type: "Buy", amount: "0.01 BTC", price: "$45,000", date: "2025-09-16" },
    { id: 2, pair: "ETH/USDT", type: "Sell", amount: "0.5 ETH", price: "$3,200", date: "2025-09-14" },
    { id: 3, pair: "BNB/USDT", type: "Buy", amount: "2 BNB", price: "$420", date: "2025-09-12" },
  ];

  return (
    <div className="bg-[#000] text-[#fff]">
      <h2 className=" text-2xl font-bold mb-4">📊 Trade History</h2>
      <p className="mb-4 text-gray-600">View all your past trades with details.</p>

     
    </div>
  );
};

export default TradeHistory;

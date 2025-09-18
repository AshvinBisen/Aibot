// src/Pages/UserDashboardPages/TrendSettings.jsx
import React, { useState } from "react";

const TrendSettings = () => {
  const [trend, setTrend] = useState("Bullish");
  const [threshold, setThreshold] = useState(5);

  return (
    <div className="bg-[#000] text-[#fff]">
      <h2 className="text-2xl font-bold mb-4">⚙️ Trend Settings</h2>
      <p className="mb-4 text-gray-600">
        Configure your AI bot’s trading trend preferences and thresholds.
      </p>

      
    </div>
  );
};

export default TrendSettings;

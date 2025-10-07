import React, { useEffect, useState, useCallback } from "react";
import { FaChartLine, FaArrowUp, FaArrowDown, FaCog, FaDollarSign } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";

const TrendSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = user?.token;

  const [config, setConfig] = useState(null);
  const [draft, setDraft] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get("https://volumebot.furfoori.com/api/config", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success && res.data.data) {
        setConfig(res.data.data);
        setDraft(res.data.data);
      } else {
        setMessage("⚠️ Failed to fetch settings.");
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setMessage("❌ Forbidden: Invalid token. Redirecting to login...");
        setTimeout(() => {
          localStorage.removeItem("user"); // clear token
          navigate("/login");
        }, 1500);
      } else {
        setMessage("❌ Error fetching settings: " + err.message);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const updateDraft = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.post("https://volumebot.furfoori.com/api/config", draft, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        setConfig(draft);
        setMessage("✅ Settings updated successfully!");
      } else {
        setMessage("⚠️ Failed to update settings.");
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setMessage("❌ Forbidden: Invalid token. Redirecting to login...");
        setTimeout(() => {
          localStorage.removeItem("user");
          navigate("/login");
        }, 1500);
      } else {
        setMessage("❌ Error saving settings: " + err.message);
      }
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading && !config) {
    return <div className="flex items-center justify-center min-h-screen bg-black text-white">Loading...</div>;
  }

  if (!config) {
    return <div className="flex items-center justify-center min-h-screen bg-black text-red-400">{message || "Error loading settings"}</div>;
  }

  return (
    <div className="p-4 lg:p-6 text-white w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT SIDE - CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: "Current Trend", value: config.trend, icon: <FaChartLine className="text-blue-400" /> },
            { title: "Min USDT", value: config.minUsdt, icon: <FaArrowUp className="text-green-400" /> },
            { title: "Max USDT", value: config.maxUsdt, icon: <FaArrowDown className="text-red-400" /> },
            { title: "Max Daily Spend", value: config.maxDailySpendUsdt + " USDT", icon: <FaCog className="text-yellow-400" /> },
            { title: "Trading Enabled", value: config.tradingEnabled ? "On" : "Off", icon: <FaCog className={config.tradingEnabled ? "text-green-400" : "text-red-400"} /> },
            { title: "Min USDT Threshold (%)", value: config.minUsdtThresholdPercent, icon: <FaDollarSign className="text-purple-400" /> },
          ].map((card, idx) => (
            <div key={idx} className="rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-5 shadow-md hover:shadow-green-500/20 transition-all">
              <div className="flex justify-between mb-2">
                <h3 className="text-gray-400 text-sm">{card.title}</h3>
                {card.icon}
              </div>
              <p className="text-2xl font-bold capitalize">{card.value}</p>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 shadow-lg space-y-4">
          <h2 className="text-xl font-bold mb-4">Configure Trend Settings</h2>

          <div className="space-y-4 text-sm">
            {/* Form Fields */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="text-gray-400 w-40">Select Trend:</label>
              <select value={draft.trend} onChange={(e) => updateDraft("trend", e.target.value)} className="flex-1 p-2 rounded-lg bg-black/60 border border-gray-700">
                <option value="up">Up</option>
                <option value="down">Down</option>
                <option value="stable">Stable</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="text-gray-400 w-40">Min USDT:</label>
              <input type="number" value={draft.minUsdt} onChange={(e) => updateDraft("minUsdt", Number(e.target.value))} className="flex-1 p-2 rounded-lg bg-black/60 border border-gray-700" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="text-gray-400 w-40">Max USDT:</label>
              <input type="number" value={draft.maxUsdt} onChange={(e) => updateDraft("maxUsdt", Number(e.target.value))} className="flex-1 p-2 rounded-lg bg-black/60 border border-gray-700" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="text-gray-400 w-40">Min USDT Threshold (%):</label>
              <input type="number" value={draft.minUsdtThresholdPercent} onChange={(e) => updateDraft("minUsdtThresholdPercent", Number(e.target.value))} className="flex-1 p-2 rounded-lg bg-black/60 border border-gray-700" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="text-gray-400 w-40">Max Daily Spend:</label>
              <input type="number" value={draft.maxDailySpendUsdt} onChange={(e) => updateDraft("maxDailySpendUsdt", Number(e.target.value))} className="flex-1 p-2 rounded-lg bg-black/60 border border-gray-700" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="text-gray-400 w-40">Trading Enabled:</label>
              <input type="checkbox" checked={draft.tradingEnabled} onChange={(e) => updateDraft("tradingEnabled", e.target.checked)} className="h-5 w-5 accent-green-500" />
            </div>

            <button onClick={handleSave} disabled={loading} className="mt-2 px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-semibold transition disabled:opacity-50">
              {loading ? "Saving..." : "Apply Changes"}
            </button>

            {message && <div className="mt-3 p-2 bg-green-600 rounded-lg text-center font-medium">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendSettings;


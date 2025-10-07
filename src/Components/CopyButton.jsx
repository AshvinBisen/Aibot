import { FaFileExcel, FaRegCopy } from "react-icons/fa";
import { useState } from "react";

// Copy button with icon
const CopyIconButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Copy failed", err));
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1 rounded hover:bg-green-700 transition-colors text-gray-200"
      title={copied ? "Copied!" : "Copy Wallet Address"}
    >
      <FaRegCopy size={14} />
    </button>
  );
};
export default CopyIconButton;

import React, { useState } from 'react';

const TransactionHistory = () => {
  const [filter, setFilter] = useState('All');

  const transactions = [
    {
      id: '0x74b9f5d8e9e941d37224b30b76a31c27fe',
      holdings: '$243.00 (145.607526 USDtBSC/bsc)',
      date: '17-09-25',
      time: '06:55:48 AM',
      type: 'Deposit',
      status: 'Approved',
    },
    {
      id: '0x74b9f5d8e9e941d37224b30b76a31c27fe',
      holdings: '$208.00 (124.738396 USDtBSC/bsc)',
      date: '14-09-25',
      time: '17:56:37 PM',
      type: 'Withdraw',
      status: 'Approved',
    },
    {
      id: '0x74b9f5d8e9e941d37224b30b76a31c27fe',
      holdings: '$149.00 (89.120781 USDtBSC/bsc)',
      date: '10-09-25',
      time: '07:34:35 AM',
      type: 'Deposit',
      status: 'Approved',
    },
    {
      id: '0xe86cb9cae602ef5ad52f62b06350a3572505b',
      holdings: '$210.00 (209.573102 USDtBSC/bsc)',
      date: '05-09-25',
      time: '08:04:51 AM',
      type: 'Withdraw',
      status: 'Finished',
    },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'All') return true;
    return transaction.type === filter;
  });

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl p-6 max-w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white mb-4 md:mb-0">My History</h2>
        <div className="flex flex-wrap gap-4 justify-end">
          <button
            className={`px-3 py-1 rounded ${
              filter === 'All' ? 'text-white bg-gray-700' : 'text-gray-400'
            } hover:text-white hover:bg-gray-700 transition-colors`}
            onClick={() => setFilter('All')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded ${
              filter === 'Withdraw' ? 'text-white bg-gray-700' : 'text-gray-400'
            } hover:text-white hover:bg-gray-700 transition-colors`}
            onClick={() => setFilter('Withdraw')}
          >
            Withdraws
          </button>
          <button
            className={`px-3 py-1 rounded ${
              filter === 'Deposit' ? 'text-white bg-gray-700' : 'text-gray-400'
            } hover:text-white hover:bg-gray-700 transition-colors`}
            onClick={() => setFilter('Deposit')}
          >
            Deposits
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse min-w-[40rem]">
          <thead className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl">
            <tr>
              <th className="px-4 py-2 font-medium text-white">AI Bots</th>
              <th className="px-4 py-2 font-medium text-white">Holdings</th>
              <th className="px-4 py-2 font-medium text-white hidden md:table-cell">Date</th>
              <th className="px-4 py-2 font-medium text-white hidden md:table-cell">Time</th>
              <th className="px-4 py-2 font-medium text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr
                key={index}
                className="border-t border-gray-800 hover:bg-gray-800/70 transition-colors"
              >
                <td className="px-4 py-2 text-gray-300">
                  <span className="inline-flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Tether-BSC {transaction.id}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-300">{transaction.holdings}</td>
                <td className="px-4 py-2 text-gray-300 hidden md:table-cell">{transaction.date}</td>
                <td className="px-4 py-2 text-gray-300 hidden md:table-cell">{transaction.time}</td>
                <td className="px-4 py-2 font-semibold">
                  <span className="inline-flex items-center">
                    <span
                      className={`w-3 h-3 rounded-full mr-2 ${
                        transaction.status === 'Approved' ? 'bg-green-400' : 'bg-yellow-400'
                      }`}
                    ></span>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
import React, { useState, useEffect } from 'react';
import { generateMockUsers } from '../utils/mockData';
import Modal from './Modal';

const Users = ({ balance, updateBalance }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const mockUsers = generateMockUsers(20);
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  const handleTransfer = async () => {
    const transferAmount = parseInt(amount);
    if (!transferAmount || transferAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (transferAmount > balance) {
      setError('Insufficient balance');
      return;
    }

    try {
      // Calculate new balance
      const newBalance = balance - transferAmount;
      
      // Update state and localStorage atomically
      updateBalance(newBalance);
      
      // Update localStorage with new balance
      const userData = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({
        ...userData,
        balance: newBalance
      }));

      // Update UI for success
      setSuccess('Payment Success!');
      setTimeout(() => {
        setShowModal(false);
        setSelectedUser(null);
        setAmount('');
        setError('');
        setSuccess('');
      }, 2000);
    } catch (error) {
      setError('Transfer failed. Please try again.');
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user.firstname[0]}{user.lastname[0]}
              </div>
              <span className="ml-3 font-medium">{user.firstname} {user.lastname}</span>
            </div>
            <button
              onClick={() => {
                setSelectedUser(user);
                setShowModal(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Send Money
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-2xl font-bold mb-4">Send Money</h2>
        {selectedUser && (
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
              {selectedUser.firstname[0]}{selectedUser.lastname[0]}
            </div>
            <span className="ml-3 text-xl">{selectedUser.firstname} {selectedUser.lastname}</span>
          </div>
        )}
        <div className="w-full mb-4">
          <label className="block text-sm mb-1">Amount (in RS)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <button
          onClick={handleTransfer}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Initiate Transfer
        </button>
      </Modal>
    </div>
  );
};

export default Users;

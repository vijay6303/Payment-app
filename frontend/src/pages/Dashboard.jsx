import React, { useEffect, useState } from "react";
import Appbar from "../components/Appbar";
import { useRecoilState } from "recoil";
import { userAtom } from "../store/atoms";
import Users from "../components/Users";
import { getBalance } from "../services/operations/transactionApi";

const Dashboard = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always initialize from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData?.balance !== undefined) {
      setUser(prev => ({
        ...prev,
        balance: userData.balance
      }));
    }
    setLoading(false);
  }, []);

  const updateBalance = (newBalance) => {
    // Update both Recoil state and localStorage
    setUser({
      ...user,
      balance: newBalance
    });
    
    const userData = JSON.parse(localStorage.getItem('user'));
    localStorage.setItem('user', JSON.stringify({
      ...userData,
      balance: newBalance
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Appbar user={user} />
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-gray-600 text-lg font-semibold mb-2">
            Available Balance
          </h2>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded w-48"></div>
          ) : (
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-gray-800">
                ₹{user.balance.toLocaleString()}
              </span>
              <span className="text-gray-500 ml-2">INR</span>
            </div>
          )}
        </div>
        <Users balance={user.balance} updateBalance={updateBalance} />
      </div>
    </div>
  );
};

export default Dashboard;
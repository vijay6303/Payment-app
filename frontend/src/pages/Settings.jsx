import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenAtom, userAtom } from "../store/atoms";
import { updateCredentials } from "../services/operations/userApi";
import { useNavigate } from "react-router-dom";
import Appbar from "../components/Appbar";

const Settings = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const token = useRecoilValue(tokenAtom);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateCredentials(token, formData);
      if (response.success) {
        setUser({
          ...user,
          firstname: formData.firstname,
          lastname: formData.lastname
        });
        setSuccess(true);
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="p-4">
        <Appbar user={user.firstname} />
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="bg-white p-8 rounded-lg w-96 shadow-md">
          <h1 className="text-3xl font-bold mb-2">Update credentials</h1>
          <p className="text-gray-500 mb-6">Enter the information that you want to update</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">First Name</label>
              <input
                type="text"
                value={formData.firstname}
                onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                placeholder="Enter first name"
                className="w-full p-2 border rounded-md focus:outline-none focus:border-gray-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastname}
                onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                placeholder="Enter last name"
                className="w-full p-2 border rounded-md focus:outline-none focus:border-gray-500"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter password"
                className="w-full p-2 border rounded-md focus:outline-none focus:border-gray-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Update
            </button>
          </form>

          {success && (
            <div className="mt-4 text-green-500 text-center">
              Data updated!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

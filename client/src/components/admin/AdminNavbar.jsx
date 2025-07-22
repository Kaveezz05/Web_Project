import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_loggedIn');
    setShowConfirm(false);
    navigate('/');
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30 bg-[#0B0F1A]">
        <Link to="/admin">
          <img src={assets.logo} alt="logo" className="w-44 h-auto" />
        </Link>

        <button
          onClick={() => setShowConfirm(true)}
          className="px-5 py-2 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] hover:opacity-90 transition rounded-full font-semibold text-black text-sm shadow-md"
        >
          Logout
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1C1F2E]/90 border border-[#4A9EDE]/20 px-8 py-6 rounded-xl text-center shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-white">Confirm Logout</h2>
            <p className="text-sm text-[#A3AED0] mb-6">Are you sure you want to log out of the admin panel?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-full bg-[#303D5A] hover:bg-[#4A9EDE] transition text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black font-semibold transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;

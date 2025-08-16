import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Menu as MenuIcon, X as XIcon, LogOut, Shield, BadgeDollarSign } from "lucide-react";
import Login from "./Login";
import useAuth from "../hooks/useAuth";

const API_BASE = "http://localhost/vistalite";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const onAdminDash = location.pathname.startsWith("/admin");
  const onCashierDash = location.pathname.startsWith("/cashier");

  // 🔒 Keep navbar hidden on admin/cashier dashboards only
  if (onAdminDash || onCashierDash) return null;

  const closeMenuAndTop = () => {
    window.scrollTo(0, 0);
    setIsOpen(false);
  };

  const isAdmin = user?.username?.toLowerCase() === "admin";
  const isCashier = user?.username?.toLowerCase() === "cashier";
  const isAuthed = !!user;

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/logout.php`, { method: "POST", credentials: "include" });
    } catch (_) {
      // ignore network hiccups; still clear client state
    } finally {
      logout();
      navigate("/"); // back to home
    }
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 bg-black/70 backdrop-blur-sm">
      <Link to="/" className="max-md:flex-1" onClick={closeMenuAndTop}>
        <img src={assets.logo} alt="Site Logo" className="w-46 h-auto" />
      </Link>

      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center
          max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
          border-gray-700 overflow-hidden transition-[width] duration-300 ${
            isOpen ? "max-md:w-full" : "max-md:w-0"
          }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer text-gray-300 hover:text-[#191970]"
          onClick={() => setIsOpen(false)}
        />

        <Link to="/" onClick={closeMenuAndTop} className="text-white hover:text-[#4682B4] transition">
          Home
        </Link>

        <Link to="/movies" onClick={closeMenuAndTop} className="text-white hover:text-[#4682B4] transition">
          Movies
        </Link>

        <Link to="/" onClick={closeMenuAndTop} className="text-white hover:text-[#4682B4] transition">
          Theaters
        </Link>

        {/* Only normal signed-in users see Favorites/Bookings in navbar */}
        {isAuthed && !isAdmin && !isCashier && (
          <>
            <Link to="/favorites" onClick={closeMenuAndTop} className="text-white hover:text-[#4682B4] transition">
              Favorites
            </Link>
            <Link to="/my-bookings" onClick={closeMenuAndTop} className="text-white hover:text-[#4682B4] transition">
              Bookings
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        
        {(
          // Guests and normal users use the existing Login widget
          <Login />
        )}

        <MenuIcon
          className="max-md:ml-2 md:hidden w-8 h-8 cursor-pointer text-gray-300 hover:text-[#191970] transition"
          onClick={() => setIsOpen(true)}
        />
      </div>
    </div>
  );
};

export default Navbar;

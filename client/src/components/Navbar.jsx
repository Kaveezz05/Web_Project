import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, XIcon, LogOut } from "lucide-react";
import Login from "./Login";

const API_BASE = "http://localhost/vistalite";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth.php`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data?.success && data?.user) {
          setIsAuthed(true);
          setUser(data.user);
        } else {
          setIsAuthed(false);
          setUser(null);
        }
      } catch {
        setIsAuthed(false);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE}/logout.php`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        localStorage.clear();
        sessionStorage.clear();
        setIsAuthed(false);
        setUser(null);
        navigate("/login");
      } else {
        console.error("Logout failed:", data.error);
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 bg-black/70 backdrop-blur-sm">
      <Link to="/" className="max-md:flex-1">
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
          onClick={() => setIsOpen(!isOpen)}
        />

        <Link
          to="/"
          onClick={() => {
            window.scrollTo(0, 0);
            setIsOpen(false);
          }}
          className="text-white hover:text-[#4682B4] transition"
        >
          Home
        </Link>
        <Link
          to="/movies"
          onClick={() => {
            window.scrollTo(0, 0);
            setIsOpen(false);
          }}
          className="text-white hover:text-[#4682B4] transition"
        >
          Movies
        </Link>
        <Link
          to="/"
          onClick={() => {
            window.scrollTo(0, 0);
            setIsOpen(false);
          }}
          className="text-white hover:text-[#4682B4] transition"
        >
          Theaters
        </Link>
        <Link
          to="/favorites"
          onClick={() => {
            window.scrollTo(0, 0);
            setIsOpen(false);
          }}
          className="text-white hover:text-[#4682B4] transition"
        >
          Favorites
        </Link>
        <Link
          to="/my-bookings"
          onClick={() => {
            window.scrollTo(0, 0);
            setIsOpen(false);
          }}
          className="text-white hover:text-[#4682B4] transition"
        >
          Bookings
        </Link>
      </div>

      <div className="flex items-center gap-8">
  <button className="px-4 py-1 sm:px-7 sm:py-2 bg-[#9CA3AF]/30 hover:bg-[#4682B4] transition rounded-full font-medium text-white cursor-pointer">
    <Login />
  </button>
</div>


      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer text-gray-300 hover:text-[#191970] transition"
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};

export default Navbar;

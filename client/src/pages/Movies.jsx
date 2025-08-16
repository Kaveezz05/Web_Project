import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";

const API_BASE = "http://localhost/vistalite"; // keep one host everywhere

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginBanner, setShowLoginBanner] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // your auth.php returns { success: true, user: {...} } when logged in
        const r = await fetch(`${API_BASE}/auth.php`, { credentials: "include" });
        const j = await r.json();
        setLoggedIn(Boolean(j.success && j.user));
      } catch {
        setLoggedIn(false);
      }
    };

    const fetchMovies = async () => {
      try {
        const res = await fetch(`${API_BASE}/getmovies.php`, { credentials: "include" });
        const text = await res.text(); // keep robust to debug bad responses
        const data = JSON.parse(text);
        if (data.success) setMovies(data.movies);
        else console.error("Failed to fetch movies:", data.error);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
    fetchMovies();
  }, []);

  // show/auto-hide login banner
  const requireLogin = () => {
    setShowLoginBanner(true);
    window.clearTimeout(requireLogin._t);
    requireLogin._t = window.setTimeout(() => setShowLoginBanner(false), 3500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-xl">
        Loading movies...
      </div>
    );
  }

  return movies.length > 0 ? (
    <div className="relative min-h-[85vh] bg-gradient-to-br from-black via-[#0F1A32] to-black text-[#E5E9F0] px-6 md:px-16 lg:px-40 xl:px-44 py-24 overflow-hidden">
      <BlurCircle top="0px" left="-120px" size="260px" color="rgba(74,144,226,0.25)" />
      <BlurCircle bottom="0px" right="-100px" size="240px" color="rgba(227,228,250,0.2)" />

      {/* Login-first banner for guests */}
      {showLoginBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 bg-[#1C2A4B]/90 border border-[#4A9EDE]/30 text-[#E5E9F0] px-4 py-2 rounded-xl shadow-lg">
            <span className="font-semibold">Please log in first</span>
            <button
              onClick={() => navigate("/login")}
              className="px-3 py-1 rounded-md bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black font-medium"
            >
              Log in
            </button>
            <button
              onClick={() => setShowLoginBanner(false)}
              className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/15"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <h1 className="text-xl font-extrabold mb-10 w-fit bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-transparent bg-clip-text">
        Now Showing
      </h1>

      <div className="flex flex-wrap justify-center gap-8 z-10 relative">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            loggedIn={loggedIn}                 // ← tells the card if user is signed in
            onRequireLogin={requireLogin}       // ← show banner for guests
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-[#E5E9F0]">
      <h1 className="text-3xl font-bold text-center">No Movies Available</h1>
    </div>
  );
}

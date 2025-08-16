// /src/pages/Favorites.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";

const API_BASE = "http://localhost/vistalite";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const ctrl = new AbortController();

    const run = async () => {
      try {
        // 1) Auth check – block guests
        const authRes = await fetch(`${API_BASE}/auth.php`, {
          credentials: "include",
          signal: ctrl.signal,
        });
        const authData = await authRes.json();
        if (!authData?.success || !authData?.user) {
          // Not logged in → send to login
          navigate("/login", { replace: true, state: { from: "/favorites" } });
          return;
        }

        // 2) Fetch favorites
        const res = await fetch(`${API_BASE}/getfavorites.php`, {
          credentials: "include",
          signal: ctrl.signal,
        });
        const data = await res.json();

        if (data?.success && Array.isArray(data.favorites)) {
          setFavorites(data.favorites);
        } else {
          setFavorites([]);
          console.error("Favorites API error:", data?.error, data?.details);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
          setFavorites([]);
        }
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => ctrl.abort();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-xl">
        Loading favorites...
      </div>
    );
  }

  return favorites.length > 0 ? (
    <div className="relative min-h-[85vh] bg-gradient-to-br from-black via-[#0F1A32] to-black text-[#E5E9F0] px-6 md:px-16 lg:px-40 xl:px-44 py-24 overflow-hidden">
      <BlurCircle top="150px" left="0px" color="rgba(41,120,181,0.3)" />
      <BlurCircle bottom="50px" right="50px" color="rgba(41,120,181,0.3)" />

      <h1 className="text-xl font-extrabold mb-10 w-fit bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-transparent bg-clip-text">
        Your Favorite Movies
      </h1>

      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {favorites.map((movie) => (
          <MovieCard key={movie.id ?? movie.movie_id} movie={movie} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen text-[#E5E9F0]">
      <h1 className="text-3xl font-bold mb-4">No Favorites Yet</h1>
      <p className="text-[#A3AED0] text-sm">Click the heart icon to favorite a movie!</p>
    </div>
  );
};

export default Favorites;

import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import BlurCircle from '../components/BlurCircle';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost/vistalite/getfavorites.php", {
          credentials: "include"
        });
        const data = await res.json();
        console.log("Favorites API response:", data);
        if (data.success && Array.isArray(data.favorites)) {
          setFavorites(data.favorites);
        } else {
          setFavorites([]);
        }
      } catch (err) {
        setFavorites([]);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    console.log("Favorites state:", favorites);
  }, [favorites]);

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
          <MovieCard key={movie.id} movie={movie} />
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

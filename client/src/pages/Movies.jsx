import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import BlurCircle from '../components/BlurCircle';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('http://127.0.0.1/vistalite/getmovies.php');
        const text = await res.text();
        console.log('RAW Response:', text);
        const data = JSON.parse(text);

        if (data.success) {
          setMovies(data.movies);
        } else {
          console.error('Failed to fetch movies:', data.error);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

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

      <h1 className="text-xl font-extrabold mb-10 w-fit bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-transparent bg-clip-text">
        Now Showing
      </h1>

      <div className="flex flex-wrap justify-center gap-8 z-10 relative">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-[#E5E9F0]">
      <h1 className="text-3xl font-bold text-center">No Movies Available</h1>
    </div>
  );
};

export default Movies;

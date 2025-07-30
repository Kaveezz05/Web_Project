import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import BlurCircle from './BlurCircle';

const FeaturedSection = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-[#E5E9F0]">
        <h1 className="text-3xl font-bold text-center">No Movies Available</h1>
      </div>
    );
  }

  return (
    <div className="relative px-6 md:px-16 lg:px-24 xl:px-44 py-20 bg-gradient-to-b from-black via-[#0F1A32] to-black text-[#E5E9F0] overflow-hidden">
       <BlurCircle top="-100px" right="-100px" size="220px" color="rgba(74,144,226,0.25)" />
      <BlurCircle bottom="-120px" left="-120px" size="240px" color="rgba(227,228,250,0.2)" />

      <h1 className="text-xl font-extrabold mb-10 w-fit bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-transparent bg-clip-text">
        Now Showing
      </h1>

      <div className="flex flex-wrap justify-center gap-8 z-10 relative">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Show More Button */}
      <div className="flex justify-center mt-16">
        <button
          onClick={() => {
            navigate('/movies');
            scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-10 py-3 text-sm bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black hover:opacity-90 transition rounded-full font-semibold shadow-md"
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default FeaturedSection;

import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';


const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/movies')
      .then((res) => setMovies(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-20 text-white">Loading...</div>;

  return movies.length > 0 ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 min-h-[80vh] bg-black text-[#E5E9F0]">
      <h1 className="text-lg font-medium my-4 text-[#9CA3AF] z-10 relative">Now Showing</h1>
      <div className="flex flex-wrap max-sm:justify-center gap-8 z-10 relative">
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie._id || movie.id} />
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

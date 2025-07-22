import React from 'react';
import { dummyShowsData } from '../assets/assets';
import MovieCard from '../components/MovieCard';
import BlurCircle from '../components/BlurCircle';

const Favorites = () => {
  return dummyShowsData.length > 0 ? (
    <div className="relative min-h-[85vh] bg-gradient-to-br from-black via-[#0F1A32] to-black text-[#E5E9F0] px-6 md:px-16 lg:px-40 xl:px-44 py-24 overflow-hidden">
      {/* Blur Circles */}
      <BlurCircle top="150px" left="0px" color="rgba(41,120,181,0.3)" />
      <BlurCircle bottom="50px" right="50px" color="rgba(41,120,181,0.3)" />

      {/* Gradient Title */}
      <h1 className="text-xl  font-extrabold mb-10 w-fit bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-transparent bg-clip-text">
        Your Favorite Movies
      </h1>

      {/* Movie List */}
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {dummyShowsData.map((movie) => (
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

export default Favorites;

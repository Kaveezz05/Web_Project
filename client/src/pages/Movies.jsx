import React from 'react';
import { dummyShowsData } from '../assets/assets';
import MovieCard from '../components/MovieCard';
import BlurCircle from '../components/BlurCircle';

const Movies = () => {
  return dummyShowsData.length > 0 ? (
    <div className="relative min-h-[85vh] bg-gradient-to-br from-black via-[#0F1A32] to-black text-[#E5E9F0] px-6 md:px-16 lg:px-40 xl:px-44 py-24 overflow-hidden">
      {/* Decorative Blur Circles */}
      <BlurCircle top="0px" left="-120px" size="260px" color="rgba(74,144,226,0.25)" />
      <BlurCircle bottom="0px" right="-100px" size="240px" color="rgba(227,228,250,0.2)" />

      {/* Gradient Title */}
    <h1 className="text-xl font-extrabold mb-10 w-fit bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-transparent bg-clip-text">
        Now Showing
    </h1>


      {/* Movie Cards */}
      <div className="flex flex-wrap justify-center gap-8 z-10 relative">
        {dummyShowsData.map((movie) => (
          <MovieCard movie={movie} key={movie.id || movie._id} />
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

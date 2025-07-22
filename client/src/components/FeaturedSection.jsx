import { ArrowRight } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyShowsData } from '../assets/assets';
import MovieCard from './MovieCard';
import BlurCircle from './BlurCircle';

const FeaturedSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative px-6 md:px-16 lg:px-24 xl:px-44 py-20 bg-gradient-to-b from-black via-[#0F1A32] to-black text-[#E5E9F0] overflow-hidden">

      {/* Decorative Blurs */}
      <BlurCircle top="-120px" left="-100px" size="260px" color="rgba(74,144,226,0.2)" />
      <BlurCircle bottom="-100px" right="-120px" size="240px" color="rgba(227,228,250,0.25)" />

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA]">
          Now Showing
        </h2>

        <button
          onClick={() => {
            navigate('/movies');
            scrollTo(0, 0);
          }}
          className="group flex items-center gap-2 text-sm text-[#E3E4FA] hover:text-[#4A90E2] transition"
        >
          View All
          <ArrowRight className="group-hover:translate-x-0.5 transition-transform w-4 h-4" />
        </button>
      </div>

      {/* Movie Cards */}
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {dummyShowsData.slice(0, 4).map((show) => (
          <MovieCard key={show._id} movie={show} />
        ))}
      </div>

      {/* Show More Button */}
      <div className="flex justify-center mt-16">
        <button
          onClick={() => {
            navigate('/movies');
            scrollTo(0, 0);
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

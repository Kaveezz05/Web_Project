import React, { useState } from 'react';
import { dummyTrailers } from '../assets/assets';
import ReactPlayer from 'react-player';
import BlurCircle from './BlurCircle';
import { PlayCircleIcon } from 'lucide-react';

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  return (
    <div className="relative px-6 md:px-16 lg:px-24 xl:px-44 py-20 bg-gradient-to-b from-black via-[#0F1A32] to-black text-[#E5E9F0] overflow-hidden">
      {/* Decorative Blurs */}
      <BlurCircle top="-100px" right="-100px" size="220px" color="rgba(74,144,226,0.25)" />
      <BlurCircle bottom="-120px" left="-120px" size="240px" color="rgba(227,228,250,0.2)" />

      {/* Section Heading */}
      <h2 className="text-xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA]">
        Watch the Latest Trailers
      </h2>

      {/* Trailer Player */}
      <div className="relative mt-10 mx-auto aspect-video max-w-4xl w-full rounded-xl overflow-hidden shadow-2xl">
        <ReactPlayer
          key={currentTrailer.videoUrl}
          url={currentTrailer.videoUrl}
          controls
          width="100%"
          height="100%"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mt-10 max-w-3xl mx-auto">
        {dummyTrailers.map((trailer) => (
          <div
            key={trailer.image}
            title={trailer.title || 'Trailer'}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 border ${
              currentTrailer.videoUrl === trailer.videoUrl
                ? 'ring-2 ring-[#4A90E2] scale-105 shadow-lg'
                : 'hover:scale-105 hover:ring-1 hover:ring-[#E3E4FA]/30'
            }`}
            onClick={() => setCurrentTrailer(trailer)}
          >
            <img
              src={trailer.image}
              alt={trailer.title}
              className="w-full h-full object-cover brightness-75"
            />
            <PlayCircleIcon
              strokeWidth={1.8}
              className="absolute top-1/2 left-1/2 w-6 md:w-10 h-6 md:h-10 transform -translate-x-1/2 -translate-y-1/2 text-[#E3E4FA]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailerSection;

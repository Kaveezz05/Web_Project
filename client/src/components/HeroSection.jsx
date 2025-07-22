import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react';
import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex flex-col items-start justify-center gap-6 px-6 md:px-16 lg:px-36 h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(15,23,42,0.8)), url("/backgroundImage.png")`,
      }}
    >
      <img src={assets.marvelLogo} alt="Marvel Logo" className="max-h-12 lg:h-12 mt-20" />
<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA]">
  Guardians <br /> of the Galaxy
</h1>


      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
        <span>Action | Adventure | Sci-Fi</span>
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4 h-4" />
          <span>2018</span>
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4 h-4" />
          <span>2h 8m</span>
        </div>
      </div>

      <p className="max-w-xl text-gray-300 leading-relaxed text-sm md:text-base">
        In Marvel Studios’ Guardians of the Galaxy Vol. 3, our beloved band of misfits are looking a little different. Peter Quill,
        still reeling from the loss of Gamora, must rally his team around him to defend the universe and protect one of their own.
      </p>

      <button
        onClick={() => {
          navigate('/movies');
          window.scrollTo(0, 0);
        }}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-white rounded-full text-sm font-semibold transition-all shadow-lg"
      >
        Explore Movies
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default HeroSection;

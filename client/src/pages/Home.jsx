import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedSection from '../components/FeaturedSection';
import TrailerSection from '../components/TrailerSection';

const Home = () => {
  const [showBrandIntro, setShowBrandIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowBrandIntro(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-[#0B0F1A] text-[#E5E9F0]">
      {/* Animated Brand Intro */}
      {showBrandIntro && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <h1 className="flex flex-wrap justify-center gap-1 text-2xl sm:text-4xl font-extrabold tracking-wide animate-fade-out">
            {'Welcome to Vistalite'.split('').map((char, index) => (
              <span
                key={index}
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA]"
                style={{
                  animation: `letterFadeIn 0.5s ease ${index * 0.06}s forwards`,
                  opacity: 0,
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
        </div>
      )}

      {/* Actual Page Content */}
      <HeroSection />
      <FeaturedSection />
      <TrailerSection />
    </div>
  );
};

export default Home;

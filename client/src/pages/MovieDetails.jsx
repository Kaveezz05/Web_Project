import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyDateTimeData, dummyShowsData } from '../assets/assets';
import { ArrowRightIcon, Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import timeFormat from '../lib/timeFormat';
import DateSelect from '../components/DateSelect';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import BlurCircle from '../components/BlurCircle';

const getLanguageName = (code) => {
  const map = {
    en: 'English', ja: 'Japanese', te: 'Telugu', hi: 'Hindi',
    fr: 'French', ko: 'Korean', fil: 'Filipino', es: 'Spanish'
  };
  return map[code] || code.toUpperCase();
};

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const movie = dummyShowsData.find((s) => s._id === id || s.id?.toString() === id);
    if (movie) {
      setShow({ movie, dateTime: dummyDateTimeData });
    } else {
      setShow(null);
    }
  }, [id]);

  const toggleFavorite = () => setIsFavorite(!isFavorite);
  if (!show) return <Loading />;
  const { movie } = show;

  return (
    <div className="relative min-h-[85vh] bg-gradient-to-br from-black via-[#0F1A32] to-black text-[#E5E9F0] px-6 md:px-16 lg:px-40 xl:px-44 py-24 overflow-hidden">
      <BlurCircle top="0px" left="-120px" size="260px" color="rgba(74,144,226,0.25)" />
      <BlurCircle bottom="0px" right="-100px" size="240px" color="rgba(74,144,226,0.25)" />

      <section className="relative w-full max-w-6xl mx-auto bg-black/60 backdrop-blur-md border border-[#4A90E2]/20 rounded-2xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-8 z-10">
        <div className="flex justify-center md:block">
          <img
            src={movie.poster_path}
            alt={movie.title}
            className="w-56 md:w-64 rounded-xl shadow-xl object-cover border-2 border-[#4A90E2]"
          />
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-wrap gap-4 items-center">
            <p className="px-3 py-1 bg-[#4A90E2]/30 text-[#4A90E2] rounded-full text-sm font-semibold">
              {getLanguageName(movie.original_language)}
            </p>
            <div className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
              <StarIcon className="w-4 h-4 fill-yellow-400" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA]">
            {movie.title}
          </h1>

          {movie.tagline && <p className="italic text-[#9CA3AF] mt-1">{movie.tagline}</p>}

          <div className="flex flex-wrap gap-2 mt-2">
            {movie.genres.map((g, idx) => (
              <span key={idx} className="px-3 py-1 bg-[#303D5A] rounded-full text-xs">
                {g.name}
              </span>
            ))}
          </div>

          <div className="text-sm text-[#9CA3AF] mt-3">
            {movie.runtime && <span>{timeFormat(movie.runtime)} • </span>}
            {movie.release_date.split('-')[0]}
          </div>

          <p className="text-[#D1D5DB] mt-4 leading-relaxed">{movie.overview}</p>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <button className="flex items-center gap-2 px-6 py-2.5 text-sm bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black rounded-full shadow-md hover:opacity-90 transition">
              <PlayCircleIcon className="w-4 h-4" />
              Watch Trailer
            </button>

            <a
              href="#dateSelect"
              className="px-8 py-2.5 text-sm bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black rounded-full shadow-md hover:opacity-90 transition"
            >
              Buy Tickets
            </a>

            <button
              onClick={toggleFavorite}
              className={`p-2.5 rounded-full shadow-md transition ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-[#303D5A] hover:bg-[#4A90E2]'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      <section
        id="dateSelect"
        className="w-full max-w-6xl mt-12 mx-auto bg-gradient-to-br from-[#0F1A32]/80 to-[#000000]/80 border border-[#303D5A]/40 rounded-xl shadow-xl p-6 backdrop-blur-md"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA]">
            Select Your Preferred Date
          </h2>
          <div className="text-xs sm:text-sm text-[#A3AED0]">
            {movie.title} • {movie.runtime ? timeFormat(movie.runtime) : 'N/A'}
          </div>
        </div>

        <div className="relative z-10">
          <DateSelect dateTime={show.dateTime} id={movie.id} compact={true} />
        </div>
      </section>

      <section className="w-full max-w-6xl mt-12 mx-auto z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA]">
            You May Also Like
          </h2>
          <button
            onClick={() => navigate('/movies')}
            className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] group flex items-center gap-1"
          >
            View All
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {dummyShowsData.filter(m => m.id !== movie.id).slice(0, 4).map((m, idx) => (
            <MovieCard key={idx} movie={m} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieDetails;

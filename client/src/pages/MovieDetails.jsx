import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { dummyDateTimeData, dummyShowsData } from '../assets/assets';
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import timeFormat from '../lib/timeFormat';
import DateSelect from '../components/DateSelect';

const getLanguageName = (code) => {
  const map = {
    en: 'English',
    ja: 'Japanese',
    te: 'Telugu',
    hi: 'Hindi',
    fr: 'French',
    ko: 'Korean',
    fil: 'Filipino',
    es: 'Spanish',
  };
  return map[code] || code.toUpperCase();
};

const MovieDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);

  useEffect(() => {
    const getShow = () => {
      const movie = dummyShowsData.find(
        show => show._id === id || show.id?.toString() === id
      );
      if (movie) {
        setShow({
          movie,
          dateTime: dummyDateTimeData,
        });
      }
    };
    getShow();
  }, [id]);

  if (!show) return <div className="text-center py-20 text-gray-300">Loading...</div>;

  const { movie } = show;

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${movie.backdrop_path})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 z-0" />

      <div className="relative z-10 px-6 md:px-16 lg:px-36 py-24 flex flex-col md:flex-row gap-10 items-start max-w-7xl mx-auto">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="w-64 md:w-72 rounded-xl shadow-lg object-cover"
        />

        <div className="flex flex-col gap-5">
          <p className="text-sm text-primary uppercase font-semibold tracking-wide">
            {getLanguageName(movie.original_language)}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{movie.title}</h1>

          <p className="italic text-lg text-gray-300">{movie.tagline}</p>

          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <StarIcon className="w-5 h-5 fill-yellow-400" />
            {movie.vote_average.toFixed(1)} User Rating
          </div>

          <p className="text-sm text-gray-300">
            {movie.runtime ? timeFormat(movie.runtime) + ' · ' : ''}
            {movie.genres.map((g) => g.name).join(', ')} · {movie.release_date.split('-')[0]}
          </p>

          <p className="text-gray-200 text-base max-w-2xl leading-relaxed">{movie.overview}</p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95">
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>
            <a
               href="#dateSelect"
               onClick={(e) => {
                e.preventDefault();
               document.getElementById('dateSelect')?.scrollIntoView({ behavior: 'smooth' });
         }}
         className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95">
         Buy Tickets
            </a>

            <button className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-16 lg:px-36 mt-20">
        <p className="text-lg font-medium text-white mb-6">Your Favorite Cast</p>
        <div className="overflow-x-auto no-scrollbar pb-4">
          <div className="flex items-center gap-6 w-max">
            {movie.casts.map((cast, index) => (
              <div
                key={`${cast.name}-${index}`}
                className="flex flex-col items-center text-center min-w-[80px] group"
              >
                <img
                  src={cast.profile_path || 'https://via.placeholder.com/150'}
                  alt={cast.name}
                  className="rounded-full h-20 aspect-square object-cover opacity-50 group-hover:opacity-100 hover:opacity-100 transition-opacity duration-300"
                />
                <p className="font-medium text-xs mt-3 text-white leading-tight max-w-[80px] truncate">
                  {cast.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DateSelect dateTime={show.dateTime} id={movie.id} />
    </div>
  );
};

export default MovieDetails;

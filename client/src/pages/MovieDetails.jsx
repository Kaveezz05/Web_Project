import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRightIcon, Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import timeFormat from '../lib/timeFormat';
import DateSelect from '../components/DateSelect';
import Loading from '../components/Loading';

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
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [dateTime, setDateTime] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/movies/${id}`)
      .then((res) => {
        setMovie(res.data.movie);
        setDateTime(res.data.dateTime || {});
      })
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  if (loading) return <Loading />;
  if (!movie) return <div className="text-white text-center mt-20">Movie not found.</div>;

  return (
    <div className="min-h-screen bg-[#121212] text-[#E5E9F0] flex flex-col items-center pt-20 pb-8 px-4 md:px-8 lg:px-16">
      {/* Movie Info */}
      <section className="w-full max-w-6xl bg-black bg-opacity-60 rounded-2xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-8">
        <div className="flex justify-center md:block">
          <img
            src={movie.poster_path}
            alt={movie.title}
            className="w-56 md:w-64 rounded-xl shadow-lg object-cover border-2 border-[#2978B5]"
          />
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-wrap gap-4 items-center">
            <p className="px-3 py-1 bg-[#2978B5]/30 text-[#2978B5] rounded-full text-sm font-semibold">
              {getLanguageName(movie.original_language)}
            </p>
            <div className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
              <StarIcon className="w-4 h-4 fill-yellow-400" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mt-2">{movie.title}</h1>

          {movie.tagline && <p className="italic text-[#9CA3AF] mt-1">{movie.tagline}</p>}

          <div className="flex flex-wrap gap-2 mt-2">
            {movie.genres.map((g, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-[#303D5A] rounded-full text-xs">
                {g.name}
              </span>
            ))}
          </div>

          <div className="text-sm text-[#9CA3AF] font-medium mt-3">
            {movie.runtime && <span>{timeFormat(movie.runtime)} • </span>}
            {movie.release_date.split('-')[0]}
          </div>

          <p className="text-[#D1D5DB] mt-4 leading-relaxed">{movie.overview}</p>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <button className="flex items-center gap-2 px-6 py-2.5 text-sm bg-[#2978B5] hover:bg-[#4A9EDE] transition rounded-lg font-semibold">
              <PlayCircleIcon className="w-4 h-4" />
              Watch Trailer
            </button>

            <a
              href="#dateSelect"
              className="px-8 py-2.5 text-sm bg-[#2978B5] hover:bg-[#4A9EDE] transition rounded-lg font-semibold text-center"
            >
              Buy Tickets
            </a>

            <button
              onClick={toggleFavorite}
              className={`p-2.5 rounded-full transition ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-[#303D5A] hover:bg-[#4A9EDE]'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Cast Section */}
      <section className="w-full max-w-6xl mt-12 bg-black bg-opacity-60 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Cast</h2>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 sm:gap-6 w-max">
            {movie.casts.map((cast, index) => {
              const [firstName, ...lastNameParts] = cast.name.split(' ');
              const lastName = lastNameParts.join(' ');
              return (
                <div
                  key={`${cast.name}-${index}`}
                  className="flex flex-col items-center text-center min-w-[70px] sm:min-w-[80px] group"
                >
                  <div className="rounded-full h-16 w-16 sm:h-20 sm:w-20 overflow-hidden border-2 border-[#2978B5]">
                    <img
                      src={cast.profile_path || 'https://via.placeholder.com/80?text=No+Image'}
                      alt={cast.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="mt-2 max-w-[70px] sm:max-w-[80px]">
                    <p className="font-medium text-xs sm:text-sm leading-tight">{firstName}</p>
                    <p className="font-medium text-xs sm:text-sm leading-tight">{lastName}</p>
                  </div>
                  {cast.character && (
                    <p
                      className="text-xs text-[#9CA3AF] mt-1 max-w-[70px] sm:max-w-[80px] truncate"
                      title={cast.character}
                    >
                      {cast.character}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Date Select Section */}
      <section
        id="dateSelect"
        className="w-full max-w-6xl mt-12 bg-black bg-opacity-40 rounded-xl shadow-inner p-4"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
          <h2 className="text-lg font-semibold">Select Date</h2>
          <div className="text-xs sm:text-sm text-[#9CA3AF]">
            {movie.title} • {movie.runtime ? timeFormat(movie.runtime) : 'N/A'}
          </div>
        </div>
        <DateSelect dateTime={dateTime} id={movie._id} />
      </section>
    </div>
  );
};

export default MovieDetails;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  // Robust genres handling for all backend cases
  let genres = 'Genre';
  try {
    if (Array.isArray(movie.genres)) {
      genres = movie.genres.join(' • ');
    } else if (typeof movie.genres === 'string') {
      const arr = JSON.parse(movie.genres);
      genres = Array.isArray(arr) ? arr.join(' • ') : movie.genres;
    }
  } catch {
    genres = movie.genres;
  }

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : '1h 30m';
  const releaseYear = movie.release_date?.split('-')[0] || '2025';

  const handleBuyTicket = (e) => {
    e.preventDefault();
    navigate(`/movies/${movie.id}#date-select`);
    setTimeout(() => {
      const dateSection = document.getElementById('date-select');
      if (dateSection) {
        dateSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <Link to={`/movies/${movie.id}`}>
      <div className="w-[230px] rounded-2xl overflow-hidden shadow-lg bg-[#0D0F1C]/90 border border-[#2F3E5C]/30 backdrop-blur-md transition-transform hover:scale-105 hover:shadow-2xl">
        <img
          src={`http://localhost/vistalite/${movie.backdrop_path.replace(/^\/?/, '')}`}
          alt={movie.title}
          className="w-full h-[320px] object-cover object-center"
        />
        <div className="px-4 py-3 text-white bg-gradient-to-t from-black via-black/70 to-transparent">
          <h3 className="text-base font-semibold truncate">{movie.title}</h3>
          <p className="text-xs text-[#A3AED0] mt-1">
            {releaseYear} • {genres} • {runtime}
          </p>
          <div className="flex justify-between items-center mt-3">
            <button
              onClick={handleBuyTicket}
              className="text-sm text-[#4A90E2] font-medium hover:underline"
            >
              Buy Ticket
            </button>
            <span className="text-yellow-400 font-semibold text-sm">
              ⭐ {parseFloat(movie.vote_average)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;

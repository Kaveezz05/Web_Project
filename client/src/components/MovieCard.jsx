import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  // Optional fallback if fields are undefined
  const genres = Array.isArray(movie.genres)
    ? movie.genres.join(' • ')
    : typeof movie.genres === 'string'
    ? movie.genres
    : 'Genre';

  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '1h 30m';
  const releaseYear = movie.release_date?.split('-')[0] || '2025';

  return (
    <Link to={`/movies/${movie.id || movie._id}`}>
      <div className="w-[230px] rounded-2xl overflow-hidden shadow-lg bg-[#0D0F1C]/90 border border-[#2F3E5C]/30 backdrop-blur-md transition-transform hover:scale-105 hover:shadow-2xl">
        <img
          src={`http://localhost/vistalite/${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-[320px] object-cover object-center"
        />

        <div className="px-4 py-3 text-white bg-gradient-to-t from-black via-black/70 to-transparent">
          <h3 className="text-base font-semibold truncate">{movie.title}</h3>
          <p className="text-xs text-[#A3AED0] mt-1">{releaseYear} • {genres} • {runtime}</p>

          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-[#4A90E2] font-medium hover:underline cursor-pointer">
              Buy Ticket
            </span>
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

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, PlayCircle } from 'lucide-react';
import DateSelect from '../components/DateSelect';
import BlurCircle from '../components/BlurCircle';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [dateTime, setDateTime] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Favorite logic
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(true);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch movie details
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const res = await fetch(`http://localhost/vistalite/getmoviebyid.php?id=${id}&_=${Date.now()}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
          const m = data.movie;
          m.genres = Array.isArray(m.genres) ? m.genres : JSON.parse(m.genres || '[]');
          setMovie(m);
        } else {
          console.error('Movie not found:', data.error);
        }
      } catch (err) {
        console.error('Movie fetch error:', err);
      }
    };

    const fetchDates = async () => {
      try {
        const res = await fetch(`http://localhost/vistalite/getshowtimes.php?movie_id=${id}&_=${Date.now()}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success && data.dateTime) {
          const now = new Date();
          const filtered = {};
          Object.entries(data.dateTime).forEach(([dateStr, times]) => {
            const validTimes = times.filter((timeStr) => {
              const full = new Date(`${dateStr}T${timeStr}`);
              return full > now;
            });
            if (validTimes.length > 0) {
              filtered[dateStr] = validTimes;
            }
          });
          setDateTime(filtered);
        }
      } catch (err) {
        console.error('Showtime fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
    fetchDates();
  }, [id]);

  // Fetch and check favorite from backend
  useEffect(() => {
    const checkFavorite = async () => {
      setCheckingFavorite(true);
      try {
        const res = await fetch('http://localhost/vistalite/getfavorites.php', {
          credentials: 'include',
        });
        const data = await res.json();
        if (
          data.success &&
          data.favorites &&
          data.favorites.some(fav => String(fav.id) === String(id))
        ) {
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
        }
      } catch {
        setIsFavorite(false);
      }
      setCheckingFavorite(false);
    };
    checkFavorite();
  }, [id]);

  // Optimistic Favorite Handler
  const handleFavorite = async () => {
    if (favLoading || checkingFavorite || !movie) return;
    setFavLoading(true);
    if (!isFavorite) {
      setIsFavorite(true); // Optimistically set red
      await fetch('http://localhost/vistalite/addfavorite.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `movie_id=${movie.id}`,
      });
    } else {
      setIsFavorite(false); // Optimistically remove red
      await fetch('http://localhost/vistalite/removefavorite.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `movie_id=${movie.id}`,
      });
    }
    setFavLoading(false);
  };

  const handleBookNow = () => {
    if (!selectedDate) return alert('Please select a date');
    navigate(`/seats/${id}/${selectedDate}`);
  };

  if (loading) return <div className="text-white text-center py-20">Loading...</div>;
  if (!movie) return <div className="text-red-500 text-center py-20">Movie not found</div>;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-[#0F1A32] to-black text-[#E5E9F0] px-6 pt-32 pb-20">
      <BlurCircle top="40px" left="-100px" />
      <BlurCircle bottom="60px" right="-100px" />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <img
            src={`http://localhost/vistalite/${movie.backdrop_path.replace(/^\/?/, '')}`}
            alt={movie.title}
            className="w-[280px] h-[420px] rounded-xl border border-[#4A9EDE]/30 shadow-lg object-cover"
          />

          <div className="flex-1 space-y-5">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#1C1F2E]/60 border border-[#4A9EDE]/40 text-sm text-white">
                {movie.original_language?.toUpperCase()}
              </span>
              <span className="text-yellow-400 font-bold text-sm flex items-center gap-1">
                ⭐ {movie.vote_average}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-white">{movie.title}</h1>
            <p className="italic text-[#A3AED0]">{movie.tagline || 'No tagline available'}</p>

            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm border border-[#4A9EDE]/30 bg-[#1C1F2E]/60 text-[#E3E4FA] tracking-wide"
                >
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-400">
              {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m • {movie.release_date?.split('-')[0]}
            </p>

            <p className="text-[#D1D5DB] leading-relaxed">{movie.overview || 'No description available'}</p>

            <div className="flex flex-wrap gap-4 pt-6">
              <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-black/30 border border-[#4A90E2]/40 text-white hover:bg-[#4A90E2]/20 transition">
                <PlayCircle size={20} />
                Watch Trailer
              </button>

              <button
                onClick={() => document.getElementById('date-select')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-5 py-2 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black rounded-full shadow hover:opacity-90 transition"
              >
                Buy Tickets
              </button>

              <button
                onClick={handleFavorite}
                disabled={favLoading || checkingFavorite}
                className="p-2 rounded-full bg-black/30 border border-[#4A9EDE]/30 hover:bg-[#4A90E2]/20 transition"
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Heart
                  fill={isFavorite ? "#E94E77" : "none"}
                  className={isFavorite ? "text-[#E94E77]" : "text-white"}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div id="date-select" className="mt-20 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-6">
            <span className="text-[#4A90E2] tracking-wide">Select</span>{' '}
            <span className="text-[#E3E4FA]">Your Preferred Date</span>
          </h2>

          <div className="bg-[#1C1F2E]/60 p-6 rounded-xl border border-[#4A9EDE]/20 shadow-md">
            <DateSelect
              dateTime={dateTime}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            <div className="text-right pt-6">
              <button
                onClick={handleBookNow}
                className="px-8 py-3 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black font-semibold rounded-full shadow-md hover:opacity-90 transition"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

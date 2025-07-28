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
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieAndShows = async () => {
      try {
        const movieRes = await fetch(`http://localhost/vistalite/getmoviebyid.php?id=${id}`);
        const movieData = await movieRes.json();
        if (movieData.success) setMovie(movieData.movie);

        const showRes = await fetch(`http://localhost/vistalite/getmovies.php?movie_id=${id}`);
        const showData = await showRes.json();
        if (showData.success) setDateTime(showData.dateTime || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndShows();
  }, [id]);

  const handleBookNow = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time!');
      return;
    }
    const datetime = `${selectedDate} ${selectedTime}`;
    navigate(`/seats/${id}?datetime=${encodeURIComponent(datetime)}`);
  };

  if (loading) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  if (!movie) {
    return <div className="text-red-500 text-center py-20">Movie not found</div>;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-[#0F1A32] to-black text-[#E5E9F0] overflow-x-hidden px-4 sm:px-8 md:px-16 py-16">
      <BlurCircle top="40px" left="-100px" />
      <BlurCircle bottom="60px" right="-100px" />

      <div className="max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-10">
          {/* Poster */}
          <img
            src={`http://localhost/vistalite/${movie.backdrop_path}`}
            alt={movie.title}
            className="w-[280px] h-[420px] rounded-xl border border-[#4A9EDE]/30 shadow-lg object-cover"
          />

          {/* Movie Info */}
          <div className="flex-1 space-y-5">
            {/* Language & Rating */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#1C1F2E]/60 border border-[#4A9EDE]/40 text-sm text-white">
                {movie.original_language?.toUpperCase()}
              </span>
              <span className="text-yellow-400 font-bold text-sm flex items-center gap-1">
                ⭐ {movie.vote_average}
              </span>
            </div>

            {/* Title + Tagline */}
            <h1 className="text-4xl font-bold text-white">{movie.title}</h1>
            <p className="italic text-[#A3AED0]">{movie.tagline}</p>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre, i) => (
                <span
                  key={i}
                  className="bg-[#1C1F2E]/60 px-3 py-1 rounded-full border border-[#4A9EDE]/20 text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Duration & Year */}
            <p className="text-sm text-gray-400">
              {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m •{' '}
              {movie.release_date?.split('-')[0]}
            </p>

            {/* Overview */}
            <p className="text-[#D1D5DB] leading-relaxed">{movie.overview}</p>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-black/30 border border-[#4A90E2]/40 text-white hover:bg-[#4A90E2]/20 transition">
                <PlayCircle size={20} />
                Watch Trailer
              </button>
              <button
                onClick={() => {
                  const dateSelectSection = document.getElementById('date-select');
                  if (dateSelectSection) dateSelectSection.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black rounded-full shadow hover:opacity-90 transition"
              >
                Buy Tickets
              </button>
              <button className="p-2 rounded-full bg-black/30 border border-[#4A9EDE]/30 text-white hover:bg-[#4A90E2]/20 transition">
                <Heart size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div id="date-select" className="mt-20">
          <h2 className="text-xl font-bold mb-6">
            <span className="text-[#4A90E2]">Select</span> Your Preferred Date
          </h2>

          <div className="bg-[#1C1F2E]/60 p-6 rounded-xl border border-[#4A9EDE]/20 shadow-md">
            <DateSelect
              dateTime={dateTime}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              setSelectedDate={setSelectedDate}
              setSelectedTime={setSelectedTime}
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

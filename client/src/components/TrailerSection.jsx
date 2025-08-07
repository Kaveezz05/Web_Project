import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import BlurCircle from './BlurCircle';
import { PlayCircleIcon } from 'lucide-react';

const getYouTubeThumb = (url = "") => {
  let id = "";
  // Extract video id for thumbnail (supports watch?v= and youtu.be/)
  if (url.includes("youtube.com/watch?v=")) {
    id = url.split("v=")[1]?.split("&")[0];
  } else if (url.includes("youtu.be/")) {
    id = url.split("youtu.be/")[1]?.split(/[?&]/)[0];
  }
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "/placeholder_trailer.jpg";
};

const TrailerSection = () => {
  const [trailers, setTrailers] = useState([]);
  const [currentTrailer, setCurrentTrailer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost/vistalite/gettrailers.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.trailers.length) {
          // Always trim the URL to avoid spaces
          const cleanTrailers = data.trailers.map(tr => ({
            ...tr,
            url: tr.url ? tr.url.trim() : "",
          }));
          setTrailers(cleanTrailers);
          setCurrentTrailer(cleanTrailers[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Bulletproof: Only show if valid YouTube URL
  const isPlayable = url => ReactPlayer.canPlay(url) && /youtube\.com|youtu\.be/.test(url);

  // Debug logging: Remove/comment-out for production
  if (!loading && currentTrailer) {
    console.log('currentTrailer:', currentTrailer);
    console.log('ReactPlayer canPlay:', ReactPlayer.canPlay(currentTrailer.url));
    console.log('URL:', currentTrailer.url);
  }

  return (
    <div className="relative px-6 md:px-16 lg:px-24 xl:px-44 py-20 bg-gradient-to-b from-black via-[#0F1A32] to-black text-[#E5E9F0] overflow-hidden">
      {/* Decorative Blurs */}
      <BlurCircle top="-100px" right="-100px" size="220px" color="rgba(74,144,226,0.25)" />
      <BlurCircle bottom="-120px" left="-120px" size="240px" color="rgba(227,228,250,0.2)" />

      <h2 className="text-xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA]">
        Watch the Latest Trailers
      </h2>

      <div className="relative mt-10 mx-auto aspect-video max-w-4xl w-full rounded-xl overflow-hidden shadow-2xl bg-black/60">
        {loading && (
          <div className="flex items-center justify-center h-full w-full text-lg text-[#4A90E2]">
            Loading trailers...
          </div>
        )}
        {!loading && currentTrailer && currentTrailer.url && isPlayable(currentTrailer.url) && (
          <ReactPlayer
            key={currentTrailer.url}
            url={currentTrailer.url}
            controls
            width="100%"
            height="100%"
          />
        )}
        {!loading && (!currentTrailer || !currentTrailer.url || !isPlayable(currentTrailer.url)) && (
          <div className="flex items-center justify-center h-full w-full text-lg text-[#4A90E2]">
            {trailers.length === 0
              ? "No trailers yet."
              : "Trailer link is invalid or unsupported."}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {!loading && trailers.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mt-10 max-w-3xl mx-auto">
          {trailers.map((trailer, i) => (
            <div
              key={trailer.id}
              title={trailer.title || 'Trailer'}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 border ${
                currentTrailer && currentTrailer.url === trailer.url
                  ? 'ring-2 ring-[#4A90E2] scale-105 shadow-lg'
                  : 'hover:scale-105 hover:ring-1 hover:ring-[#E3E4FA]/30'
              }`}
              onClick={() => setCurrentTrailer(trailer)}
            >
              <img
                src={getYouTubeThumb(trailer.url)}
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
      )}
    </div>
  );
};

export default TrailerSection;

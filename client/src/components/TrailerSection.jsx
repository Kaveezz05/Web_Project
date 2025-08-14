import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import BlurCircle from './BlurCircle';
import { PlayCircleIcon, X } from 'lucide-react';

const normaliseYouTubeUrl = (url = '') => {
  if (!url) return '';
  const trimmed = url.trim();
  return trimmed.replace(/^http:\/\//i, 'https://'); // avoid mixed content
};

const getYouTubeThumb = (url = '') => {
  const u = normaliseYouTubeUrl(url);
  let id = '';
  if (u.includes('youtube.com/watch?v=')) {
    id = u.split('v=')[1]?.split('&')[0];
  } else if (u.includes('youtu.be/')) {
    id = u.split('youtu.be/')[1]?.split(/[?&]/)[0];
  }
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '/placeholder_trailer.jpg';
};

const TrailerSection = () => {
  const [trailers, setTrailers] = useState([]);
  const [currentTrailer, setCurrentTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost/vistalite/gettrailers.php', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.trailers)) {
          const clean = data.trailers
            .map((t) => ({ ...t, url: normaliseYouTubeUrl(t.url || '') }))
            .filter((t) => t.url);
          setTrailers(clean);
          if (clean.length) setCurrentTrailer(clean[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const isPlayable = (url) =>
    !!url && ReactPlayer.canPlay(url) && /youtube\.com|youtu\.be/.test(url);

  return (
    <div className="relative px-6 md:px-16 lg:px-24 xl:px-44 py-20 bg-gradient-to-b from-black via-[#0F1A32] to-black text-[#E5E9F0] overflow-hidden">
      <BlurCircle top="-100px" right="-100px" size="220px" color="rgba(74,144,226,0.25)" />
      <BlurCircle bottom="-120px" left="-120px" size="240px" color="rgba(227,228,250,0.2)" />

      <h2 className="text-xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA]">
        Watch the Latest Trailers
      </h2>

      {!loading && trailers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 max-w-6xl mx-auto">
          {trailers.map((tr) => (
            <div
              key={tr.id}
              title={tr.title || 'Trailer'}
              className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 border ${
                currentTrailer && currentTrailer.url === tr.url
                  ? 'ring-2 ring-[#4A90E2] scale-105 shadow-lg'
                  : 'hover:scale-105 hover:ring-1 hover:ring-[#E3E4FA]/30'
              }`}
              style={{ height: '260px' }} // ⬆️ bigger thumbnails (adjust to taste)
              onClick={() => {
                setCurrentTrailer(tr);
                setShowModal(true);
              }}
            >
              <img
                src={getYouTubeThumb(tr.url)}
                alt={tr.title || 'Trailer'}
                className="w-full h-full object-cover brightness-75"
                loading="lazy"
              />
              <PlayCircleIcon
                strokeWidth={1.8}
                className="absolute top-1/2 left-1/2 w-14 h-14 -translate-x-1/2 -translate-y-1/2 text-[#E3E4FA]"
              />
              {tr.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-sm">
                  {tr.title}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="flex items-center justify-center h-40 text-lg text-[#4A90E2]">
            No trailers yet.
          </div>
        )
      )}

      {/* Modal */}
      {showModal && currentTrailer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video bg-[#0B1220] border border-[#4A90E2]/30 rounded-2xl overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-6 right-0 flex items-center justify-center w-9 h-9 rounded-full bg-[#101826] border border-white/10 hover:border-[#4A90E2]/60 text-[#E5E9F0]"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {isPlayable(currentTrailer.url) ? (
              <ReactPlayer
                key={currentTrailer.url}
                url={currentTrailer.url}
                playing
                controls
                width="100%"
                height="100%"
                config={{
                  youtube: {
                    playerVars: {
                      origin: window.location.origin,
                      modestbranding: 1,
                      rel: 0,
                    },
                  },
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full text-sm text-[#4A90E2]">
                Trailer link is invalid or unsupported.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrailerSection;

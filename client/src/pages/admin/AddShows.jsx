import React, { useState } from 'react';
import { DeleteIcon } from 'lucide-react';
import BlurCircle from '../../components/BlurCircle';
import Title from '../../components/admin/Title'; // ✅ Import fixed
import formatLKR from '../../lib/formatLKR';

const genreOptions = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'
];

const languageOptions = ['en', 'hi', 'te', 'ta', 'fr', 'es', 'ja', 'ko'];

const AddShows = () => {
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    genres: [],
    language: 'en',
    runtime: '',
    releaseDate: '',
    overview: '',
    price: '',
  });

  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [dateTimeInput, setDateTimeInput] = useState('');
  const [dateTimeSelection, setDateTimeSelection] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreToggle = (genre) => {
    setFormData((prev) => {
      const updated = prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre];
      return { ...prev, genres: updated };
    });
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split('T');
    if (!date || !time) return;
    setDateTimeSelection((prev) => {
      const existing = prev[date] || [];
      if (!existing.includes(time)) {
        return { ...prev, [date]: [...existing, time] };
      }
      return prev;
    });
    setDateTimeInput('');
  };

  const handleRemoveTime = (prev, date, time) => {
    const updated = prev[date].filter((t) => t !== time);
    if (updated.length === 0) {
      const { [date]: _, ...rest } = prev;
      return rest;
    }
    return { ...prev, [date]: updated };
  };

  const handleSubmit = () => {
    const movieData = {
      ...formData,
      genres: formData.genres.map((g) => ({ name: g })),
      showDateTime: dateTimeSelection,
    };
    console.log('🎬 Movie Data:', movieData);
    alert('Movie and show details captured. Backend submission coming next.');
  };

  return (
    <>
      <Title text1="Add" text2="Shows" /> {/* ✅ Corrected Title */}
      <div className="relative min-h-screen px-6 md:px-12 py-20 bg-gradient-to-b from-black via-[#0F1A32] to-black text-[#E5E9F0]">
        <BlurCircle top="50px" left="-100px" />
        <BlurCircle bottom="0" right="-100px" />

        <div className="bg-[#1C1F2E]/60 border border-[#4A9EDE]/20 backdrop-blur-md rounded-xl shadow-xl p-8 max-w-3xl mx-auto space-y-8">

          {/* Movie Title */}
          <div>
            <label className="block text-sm mb-1 text-[#A3AED0]">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Movie title"
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#4A90E2] outline-none"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm mb-1 text-[#A3AED0]">Tagline</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleInputChange}
              placeholder="Movie tagline"
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white"
            />
          </div>

          {/* Genres */}
          <div>
            <label className="block text-sm mb-1 text-[#A3AED0]">Genres</label>
            <div className="flex flex-wrap gap-2">
              {genreOptions.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-3 py-1 rounded-full border ${
                    formData.genres.includes(genre)
                      ? 'bg-[#4A90E2]/80 border-[#4A90E2] text-white'
                      : 'bg-black/50 border-[#4A9EDE] text-[#A3AED0]'
                  } text-sm hover:opacity-80 transition`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm mb-1 text-[#A3AED0]">Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white"
            >
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Runtime */}
          <div>
            <label className="block text-sm mb-1 text-[#A3AED0]">Runtime (in minutes)</label>
            <input
              type="number"
              name="runtime"
              value={formData.runtime}
              onChange={handleInputChange}
              placeholder="e.g. 102"
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white"
            />
          </div>

          {/* Release Date */}
          <div>
            <label className="block text-sm mb-1 text-[#A3AED0]">Release Date</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white"
            />
          </div>

          {/* Overview */}
          <div>
            <label className="block text-sm mb-1 text-[#A3AED0]">Overview</label>
            <textarea
              name="overview"
              value={formData.overview}
              onChange={handleInputChange}
              rows={4}
              placeholder="Movie description"
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white resize-none"
            />
          </div>

          {/* Poster Upload */}
          <div>
            <label className="block text-sm mb-1 text-[#A3AED0]">Poster</label>
            <input type="file" accept="image/*" onChange={handlePosterChange} />
            {posterPreview && (
              <img
                src={posterPreview}
                alt="Preview"
                className="mt-4 max-h-64 rounded-lg shadow-md object-contain border border-[#4A90E2]/40"
              />
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm mb-1 text-[#A3AED0]">Show Price</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/50 border border-[#4A9EDE]">
              <p className="text-sm text-gray-400">{formData.price ? formatLKR(Number(formData.price)) : 'LKR'}</p>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="bg-transparent w-full text-white outline-none placeholder-[#9CA3AF]"
                placeholder="Enter price"
              />
            </div>
          </div>

          {/* DateTime Selection */}
          <div>
            <label className="block text-sm mb-1 text-[#A3AED0]">Add Show Date & Time</label>
            <div className="flex gap-4">
              <input
                type="datetime-local"
                value={dateTimeInput}
                onChange={(e) => setDateTimeInput(e.target.value)}
                className="px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white"
              />
              <button
                onClick={handleDateTimeAdd}
                className="px-4 py-2 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black font-semibold rounded-full shadow-md hover:opacity-90 transition"
              >
                Add Time
              </button>
            </div>
          </div>

          {/* DateTime List */}
          {Object.keys(dateTimeSelection).length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Selected Show Times</h2>
              <ul className="space-y-3">
                {Object.entries(dateTimeSelection).map(([date, times]) => (
                  <li key={date}>
                    <div className="font-medium text-[#9CA3AF]">{date}</div>
                    <div className="flex flex-wrap gap-2 mt-1 text-sm">
                      {times.map((time) => (
                        <div
                          key={time}
                          className="flex items-center px-3 py-1 rounded-full border border-[#4A90E2] text-white bg-black/40"
                        >
                          {time}
                          <DeleteIcon
                            width={16}
                            className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                            onClick={() =>
                              setDateTimeSelection((prev) =>
                                handleRemoveTime(prev, date, time)
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit */}
          <div className="text-right pt-4">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black font-semibold rounded-full shadow-md hover:opacity-90 transition"
            >
              Add Show
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddShows;

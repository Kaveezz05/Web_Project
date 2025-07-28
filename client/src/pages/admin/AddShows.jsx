import React, { useState } from 'react';
import { DeleteIcon } from 'lucide-react';
import BlurCircle from '../../components/BlurCircle';
import Title from '../../components/admin/Title';

const genreOptions = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'];
const languageOptions = ['en', 'hi', 'ta', 'te', 'ko', 'ja'];

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
      const genres = prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre];
      return { ...prev, genres };
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

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('Please enter the movie title.');
      return;
    }

    if (!posterFile) {
      alert('Please select a poster image.');
      return;
    }

    const form = new FormData();
    form.append('title', formData.title);
    form.append('tagline', formData.tagline);
    form.append('genres', JSON.stringify(formData.genres));
    form.append('language', formData.language);
    form.append('runtime', formData.runtime);
    form.append('release_date', formData.releaseDate);
    form.append('overview', formData.overview);
    form.append('price', formData.price);
    form.append('poster', posterFile);
    form.append('showDateTime', JSON.stringify(dateTimeSelection));

    try {
      await fetch('http://localhost/vistalite/addshows.php', {
        method: 'POST',
        body: form,
      });

      alert(`✅ Movie "${formData.title}" was successfully added!`);
      window.location.reload();
    } catch (err) {
      alert('❌ Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Title text1="Add" text2="Shows" />
      <div className="relative min-h-screen px-6 md:px-12 py-20 bg-gradient-to-b from-black via-[#0F1A32] to-black text-[#E5E9F0]">
        <BlurCircle top="50px" left="-100px" />
        <BlurCircle bottom="0" right="-100px" />

        <div className="bg-[#1C1F2E]/60 border border-[#4A9EDE]/20 backdrop-blur-md rounded-xl shadow-xl p-8 max-w-3xl mx-auto space-y-8">

          <input type="text" name="title" value={formData.title} onChange={handleInputChange}
            placeholder="Movie Title" className="w-full px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white" />

          <input type="text" name="tagline" value={formData.tagline} onChange={handleInputChange}
            placeholder="Tagline" className="w-full px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white" />

          <div className="flex flex-wrap gap-2">
            {genreOptions.map((genre) => (
              <button key={genre} type="button" onClick={() => handleGenreToggle(genre)}
                className={`px-3 py-1 rounded-full border text-sm transition ${
                  formData.genres.includes(genre)
                    ? 'bg-[#4A90E2]/80 border-[#4A90E2] text-white'
                    : 'bg-black/50 border-[#4A9EDE] text-[#A3AED0]'
                }`}>
                {genre}
              </button>
            ))}
          </div>

          <select name="language" value={formData.language} onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white">
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>{lang.toUpperCase()}</option>
            ))}
          </select>

          <input type="number" name="runtime" value={formData.runtime} onChange={handleInputChange}
            placeholder="Runtime in minutes" className="w-full px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white" />

          <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white" />

          <textarea name="overview" value={formData.overview} onChange={handleInputChange}
            placeholder="Movie Overview" rows="4"
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white resize-none" />

          <input type="file" accept="image/*" onChange={handlePosterChange} />
          {posterPreview && (
            <img src={posterPreview} alt="Preview"
              className="mt-4 max-h-64 rounded-lg shadow-md object-contain border border-[#4A90E2]/40" />
          )}

          <input type="number" name="price" value={formData.price} onChange={handleInputChange}
            placeholder="Ticket Price (LKR)" className="w-full px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white" />

          <div className="flex items-center gap-4">
            <input type="datetime-local" value={dateTimeInput} onChange={(e) => setDateTimeInput(e.target.value)}
              className="px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white" />
            <button onClick={handleDateTimeAdd}
              className="px-4 py-2 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black font-semibold rounded-full shadow-md hover:opacity-90 transition">
              Add Time
            </button>
          </div>

          {Object.keys(dateTimeSelection).length > 0 && (
            <div className="space-y-4">
              {Object.entries(dateTimeSelection).map(([date, times]) => (
                <div key={date}>
                  <p className="font-semibold text-[#A3AED0]">{date}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {times.map((time) => (
                      <div key={time} className="flex items-center px-3 py-1 rounded-full border border-[#4A90E2] text-white bg-black/40">
                        {time}
                        <DeleteIcon width={16} className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                          onClick={() => setDateTimeSelection((prev) => handleRemoveTime(prev, date, time))} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-right">
            <button onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black font-semibold rounded-full shadow-md hover:opacity-90 transition">
              Add Show
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddShows; 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteIcon } from 'lucide-react';
import BlurCircle from '../../components/BlurCircle';
import Title from '../../components/admin/Title';

const genreOptions = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'];
const languageOptions = ['en', 'hi', 'ta', 'te', 'ko', 'ja'];
const defaultTimeSlots = ['10:00', '13:00', '16:00', '19:00', '22:00'];

const AddShows = () => {
  const navigate = useNavigate();

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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ Admin session check
  useEffect(() => {
    const checkAdminAuth = async () => {
      const res = await fetch("http://localhost/vistalite/admin-auth.php", {
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) navigate("/login");
    };

    checkAdminAuth();
  }, [navigate]);

  const toggleTimeSlot = (slot) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(slot) ? prev.filter((t) => t !== slot) : [...prev, slot]
    );
  };

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

  const generateShowSchedule = () => {
    const schedule = {};
    if (!startDate || !endDate || selectedTimeSlots.length === 0) return schedule;

    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      schedule[dateStr] = [...selectedTimeSlots];
      current.setDate(current.getDate() + 1);
    }

    return schedule;
  };

  const handleSubmit = async () => {
    if (
      !formData.title.trim() ||
      !posterFile ||
      !startDate ||
      !endDate ||
      selectedTimeSlots.length === 0
    ) {
      alert('⚠️ Please fill all required fields including poster, dates, and times.');
      return;
    }

    const showSchedule = generateShowSchedule();
    const form = new FormData();

    form.append('title', formData.title.trim());
    form.append('tagline', formData.tagline.trim());
    form.append('genres', JSON.stringify(formData.genres));
    form.append('language', formData.language);
    form.append('runtime', formData.runtime.trim());
    form.append('release_date', formData.releaseDate);
    form.append('overview', formData.overview.trim());
    form.append('price', formData.price);
    form.append('poster', posterFile);
    form.append('showDateTime', JSON.stringify(showSchedule));

    try {
      const res = await fetch('http://localhost/vistalite/addshows.php', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();

      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        alert(`❌ Failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Network error. Please try again.');
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
                className={`px-3 py-1 rounded-full border text-sm transition ${formData.genres.includes(genre)
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

          <div className="flex gap-4">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white" placeholder="Start Date" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white" placeholder="End Date" />
          </div>

          <div className="flex flex-wrap gap-2">
            {defaultTimeSlots.map((slot) => (
              <button key={slot} type="button" onClick={() => toggleTimeSlot(slot)}
                className={`px-4 py-2 rounded-full border ${selectedTimeSlots.includes(slot)
                    ? 'bg-[#4A90E2]/80 border-[#4A90E2] text-white'
                    : 'bg-black/50 border-[#4A9EDE] text-[#A3AED0]'
                  }`}>
                {slot}
              </button>
            ))}
          </div>

          <div className="text-right">
            <button onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black font-semibold rounded-full shadow-md hover:opacity-90 transition">
              Add Show
            </button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black px-6 py-2 rounded-full shadow-lg text-sm font-medium animate-drop-fade">
            ✅ "{formData.title}" was successfully added!
          </div>
        </div>
      )}
    </>
  );
};

export default AddShows;

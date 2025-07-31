import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurCircle from '../../components/BlurCircle';
import Title from '../../components/admin/Title';

const AddTrailer = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    url: '',
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Admin session check
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('http://localhost/vistalite/admin-auth.php', {
        credentials: 'include',
      });
      const data = await res.json();
      if (!data.success) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isYouTubeUrl = (url) => {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.url.trim()) {
      alert('❌ Please fill all fields.');
      return;
    }

    if (!isYouTubeUrl(formData.url)) {
      alert('❌ Please enter a valid YouTube URL.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost/vistalite/addtrailer.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormData({ title: '', url: '' });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(data.error || 'Upload failed.');
      }
    } catch (err) {
      alert('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title text1="Add Upcoming" text2="Movie Trailers" />
      <div className="relative min-h-screen px-6 md:px-12 py-20 bg-gradient-to-b from-black via-[#0F1A32] to-black text-[#E5E9F0]">
        <BlurCircle top="50px" left="-100px" />
        <BlurCircle bottom="0" right="-100px" />

        <div className="bg-[#1C1F2E]/60 border border-[#4A9EDE]/20 backdrop-blur-md rounded-xl shadow-xl p-8 max-w-3xl mx-auto space-y-8">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Trailer Title"
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white"
          />

          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="YouTube Trailer URL"
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-[#4A9EDE] text-white"
          />

          <div className="text-right">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black font-semibold rounded-full shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload Trailer'}
            </button>
          </div>
        </div>
      </div>

      {success && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black px-6 py-2 rounded-full shadow-lg text-sm font-medium animate-drop-fade">
            ✅ Trailer successfully uploaded!
          </div>
        </div>
      )}
    </>
  );
};

export default AddTrailer;

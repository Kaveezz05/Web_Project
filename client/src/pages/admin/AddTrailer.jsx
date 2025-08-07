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
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Admin session check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost/vistalite/admin-auth.php', {
          credentials: 'include',
        });
        const data = await res.json();
        if (!data.success) {
          navigate('/login');
        }
      } catch {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = formData.title.trim();
    const url = formData.url.trim();
    const newErrors = {};
    if (!title) newErrors.title = "Required";
    if (!url) newErrors.url = "Required";
    else if (!isYouTubeUrl(url)) newErrors.url = "Must be a valid YouTube URL";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    const form = new FormData();
    form.append('title', title);
    form.append('url', url);

    setLoading(true);
    try {
      const res = await fetch('http://localhost/vistalite/addtrailer.php', {
        method: 'POST',
        credentials: 'include',
        body: form,
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormData({ title: '', url: '' });
        setErrors({});
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(data.error || '❌ Upload failed.');
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

        <form
          onSubmit={handleSubmit}
          className="bg-[#1C1F2E]/60 border border-[#4A9EDE]/20 backdrop-blur-md rounded-xl shadow-xl p-8 max-w-3xl mx-auto space-y-8"
        >
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="trailer-title">
              Trailer Title <span className="text-red-400"></span>
            </label>
            <input
              id="trailer-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Trailer Title"
              className={`w-full px-4 py-2 rounded-lg bg-black/50 border ${
                errors.title ? "border-red-400" : "border-[#4A9EDE]"
              } text-white`}
              disabled={loading}
            />
            {errors.title && <span className="text-red-400 text-xs">{errors.title}</span>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="trailer-url">
              YouTube Trailer URL <span className="text-red-400"></span>
            </label>
            <input
              id="trailer-url"
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="YouTube Trailer URL"
              className={`w-full px-4 py-2 rounded-lg bg-black/50 border ${
                errors.url ? "border-red-400" : "border-[#4A9EDE]"
              } text-white`}
              disabled={loading}
            />
            {errors.url && <span className="text-red-400 text-xs">{errors.url}</span>}
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black font-semibold rounded-full shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload Trailer'}
            </button>
          </div>
        </form>
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

import React, { useState } from 'react';
import Title from '../../components/admin/Title';
import { DeleteIcon } from 'lucide-react';
import formatLKR from '../../lib/formatLKR';

const AddShows = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [releaseDate, setReleaseDate] = useState('');
  const [showPrice, setShowPrice] = useState('');
  const [dateTimeInput, setDateTimeInput] = useState('');
  const [dateTimeSelection, setDateTimeSelection] = useState({});

  // Handle poster file upload and show preview
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

    setDateTimeSelection(prev => {
      const existingTimes = prev[date] || [];
      if (!existingTimes.includes(time)) {
        return { ...prev, [date]: [...existingTimes, time] };
      }
      return prev;
    });
    setDateTimeInput('');
  };

  const handleRemoveTime = (prev, date, time) => {
    const filteredTimes = prev[date].filter(t => t !== time);
    if (filteredTimes.length === 0) {
      const { [date]: _, ...rest } = prev;
      return rest;
    }
    return {
      ...prev,
      [date]: filteredTimes,
    };
  };

  const handleAddShow = () => {
    if (!movieTitle.trim() || !posterFile || !releaseDate || !showPrice || Object.keys(dateTimeSelection).length === 0) {
      alert('Please fill in all fields and add at least one date & time.');
      return;
    }

    const formData = new FormData();
    formData.append('movieTitle', movieTitle.trim());
    formData.append('poster', posterFile);
    formData.append('releaseDate', releaseDate);
    formData.append('showPrice', showPrice);
    formData.append('dateTimeSelection', JSON.stringify(dateTimeSelection));

    // Replace this URL with your backend endpoint
    fetch('http://localhost/vistalite/addshows.php', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Show added successfully!');
          // Reset form
          setMovieTitle('');
          setPosterFile(null);
          setPosterPreview(null);
          setReleaseDate('');
          setShowPrice('');
          setDateTimeSelection({});
        } else {
          alert('Failed to add show: ' + (data.error || 'Unknown error'));
        }
      })
      .catch(err => {
        console.error(err);
        alert('An error occurred while adding the show.');
      });
  };

  return (
    <>
      <Title text1="Add" text2="Shows" />
      

      <div className="mt-10 max-w-2xl mx-auto grid gap-6">
        {/* Movie Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Movie Title</label>
          <input
            type="text"
            value={movieTitle}
            onChange={e => setMovieTitle(e.target.value)}
            className="bg-black border border-gray-600 rounded-md px-3 py-2 w-full outline-none text-white"
            placeholder="Enter movie title"
          />
        </div>

        {/* Poster Upload */}
        <div>
          
          <label className="block text-sm font-medium mb-2">Poster Image (Upload)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePosterChange}
            className="w-full text-gray-300"
          />
          {posterPreview && (
            <img
              src={posterPreview}
              alt="Poster Preview"
              className="mt-3 max-h-64 rounded shadow-md object-contain"
            />
          )}
        </div>

        {/* Release Date */}
        <div>
          <label className="block text-sm font-medium mb-2">Release Date</label>
          <input
            type="date"
            value={releaseDate}
            onChange={e => setReleaseDate(e.target.value)}
            className="bg-black border border-gray-600 rounded-md px-3 py-2 w-full outline-none text-white"
          />
        </div>

        {/* Show Price */}
        <div>
          <label className="block text-sm font-medium mb-2">Show Price</label>
          <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
            <p className="text-gray-400 text-sm">{showPrice ? formatLKR(Number(showPrice)) : 'LKR'}</p>
            <input
              min={0}
              type="number"
              value={showPrice}
              onChange={e => setShowPrice(e.target.value)}
              placeholder="Enter show price"
              className="outline-none bg-transparent w-32 text-white"
            />
          </div>
        </div>

        {/* Date & Time Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Date & Time</label>
          <div className="inline-flex items-center gap-2 border border-gray-600 p-1 pl-3 rounded-lg">
            <input
              type="datetime-local"
              value={dateTimeInput}
              onChange={e => setDateTimeInput(e.target.value)}
              className="outline-none rounded-md bg-black text-white"
            />
            <button
              onClick={handleDateTimeAdd}
              className="bg-[#2978B5]/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-[#2978B5] cursor-pointer"
            >
              Add Time
            </button>
          </div>
        </div>

        {/* Display Selected Date & Times */}
        {Object.keys(dateTimeSelection).length > 0 && (
          <div>
            <h2 className="mb-2 text-lg font-semibold text-white">Selected Date-Time</h2>
            <ul className="space-y-3 text-white">
              {Object.entries(dateTimeSelection).map(([date, times]) => (
                <li key={date}>
                  <div className="font-medium">{date}</div>
                  <div className="flex flex-wrap gap-2 mt-1 text-sm">
                    {times.map(time => (
                      <div
                        key={time}
                        className="border border-[#2978B5] px-2 py-1 flex items-center rounded"
                      >
                        <span>{time}</span>
                        <DeleteIcon
                          onClick={() =>
                            setDateTimeSelection(prev =>
                              handleRemoveTime(prev, date, time)
                            )
                          }
                          width={15}
                          className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleAddShow}
          className="bg-[#2978B5] text-white px-8 py-2 rounded hover:bg-[#2978B5]/90 transition-all cursor-pointer"
        >
          Add Show
        </button>
      </div>
    </>
  );
};

export default AddShows;

import React from 'react';

const DateSelect = ({ dateTime, selectedDate, setSelectedDate }) => {
  const dates = Object.keys(dateTime || {});

  return (
    <div className="flex flex-wrap gap-3">
      {dates.length === 0 ? (
        <p className="text-white">No dates available.</p>
      ) : (
        dates.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              selectedDate === date
                ? 'bg-[#4A90E2] text-white border-[#4A90E2]'
                : 'bg-black/30 border-[#4A9EDE] text-[#A3AED0] hover:bg-[#4A9EDE]/20'
            }`}
          >
            {new Date(date).toDateString()}
          </button>
        ))
      )}
    </div>
  );
};

export default DateSelect;

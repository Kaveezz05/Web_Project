import React from 'react';

const FilterBar = ({ selectedDate, setSelectedDate }) => (
  <div>
    <label className="block text-sm mb-2 text-[#A3AED0]">Filter by Date</label>
    <input
      type="date"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      className="w-full px-4 py-2 rounded-md bg-black/50 border border-[#4A9EDE] text-white placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#2978B5] transition"
    />
  </div>
);

export default FilterBar;

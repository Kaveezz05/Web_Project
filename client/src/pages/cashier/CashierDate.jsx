import React, { useState } from 'react';
import isoTimeFormat from '../../lib/isoTimeFormat';
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';
import Loading from '../../components/Loading';
import { CalendarDays } from 'lucide-react';

const CashierDate = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredBookings, setFilteredBookings] = useState([]);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    setLoading(true);
    // Simulate backend filtering (replace with actual API)
    setTimeout(() => {
      // Sample filtered result (empty or mock data)
      setFilteredBookings([
     
      ]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="relative px-6 md:px-10 pb-20 text-[#E5E9F0] min-h-[80vh]">
      <BlurCircle top="60px" left="-60px" />
      <BlurCircle bottom="0" right="-60px" />
      <Title text1="Filter" text2="by Date" />

      <div className="mt-6 bg-[#1C1F2E]/70 rounded-xl border border-[#4A9EDE]/20 p-6 shadow-xl max-w-xl">
        <label htmlFor="date" className="block text-sm text-[#A3AED0] mb-2 font-medium">
          Filter by Date
        </label>
<div className="relative">
  <input
    id="date"
    type="date"
    value={selectedDate}
    onChange={handleDateChange}
    className="w-full p-3 bg-[#1C1F2E] border border-[#4A9EDE]/30 text-[#E5E9F0] rounded-lg placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#2978B5] transition"
  />
  <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3AED0] pointer-events-none" />
</div>


        {loading ? (
          <div className="mt-6">
            <Loading />
          </div>
        ) : (
          <div className="mt-6 text-sm">
            {filteredBookings.length === 0 ? (
              <p className="text-gray-400">No bookings found for this date.</p>
            ) : (
              <ul className="space-y-4">
                {filteredBookings.map((booking) => (
                  <li
                    key={booking.id}
                    className="bg-[#1C1F2E]/70 border border-[#2978B5]/20 p-4 rounded-lg shadow"
                  >
                    <p>
                      <span className="font-semibold text-[#4A9EDE]">User:</span>{' '}
                      {booking.user.name}
                    </p>
                    <p>
                      <span className="font-semibold text-[#4A9EDE]">Movie:</span>{' '}
                      {booking.movie.title}
                    </p>
                    <p>
                      <span className="font-semibold text-[#4A9EDE]">Show Time:</span>{' '}
                      {isoTimeFormat(booking.showTime)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CashierDate;

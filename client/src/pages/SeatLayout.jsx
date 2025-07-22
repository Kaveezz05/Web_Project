import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyDateTimeData, dummyShowsData } from '../assets/assets';
import Loading from '../components/Loading';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import isoTimeFormat from '../lib/isoTimeFormat';
import BlurCircle from '../components/BlurCircle';
import toast from 'react-hot-toast';

const SeatLayout = () => {
  const groupRows = [
    ['A', 'B'],
    ['C', 'D'],
    ['E', 'F'],
    ['G', 'H'],
    ['I', 'J'],
  ];
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const navigate = useNavigate();

  const handleSeatClick = (seatId) => {
    if (!selectedTime) return toast('Please select time first');
    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4)
      return toast('You can only select 5 seats');

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      {Array.from({ length: count }, (_, i) => {
        const seatId = `${row}${i + 1}`;
        return (
          <button
            key={seatId}
            onClick={() => handleSeatClick(seatId)}
            className={`h-8 w-8 rounded border transition text-sm ${
              selectedSeats.includes(seatId)
                ? 'bg-[#2978B5] text-white border-[#2978B5]'
                : 'border-[#4A9EDE] text-[#A3AED0] hover:bg-[#4A9EDE] hover:text-white'
            }`}
          >
            {seatId}
          </button>
        );
      })}
    </div>
  );

  useEffect(() => {
    const getShow = async () => {
      const foundShow = dummyShowsData.find((s) => s._id === id);
      if (foundShow) {
        setShow({ movie: foundShow, dateTime: dummyDateTimeData });
      }
    };
    getShow();
  }, [id]);

  if (!show) return <Loading />;

  return (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-20 min-h-screen bg-gradient-to-b from-black via-[#0F1A32] to-black text-[#E5E9F0] relative">
      {/* Blur Decorations */}
      <BlurCircle top="-120px" left="-80px" size="220px" color="rgba(74,144,226,0.3)" />
      <BlurCircle bottom="-60px" right="-60px" size="180px" color="rgba(227,228,250,0.2)" />

      {/* Timing Section */}
      <div className="w-full md:w-64 mb-10 md:mb-0 md:mr-10 mt-24 z-10">
        <div className="bg-[#303D5A]/30 rounded-xl p-6 shadow-xl backdrop-blur-md ring-1 ring-[#4A9EDE]/40">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-base font-semibold mb-4 border-b border-[#4A9EDE] pb-2">
            Available Timings
          </p>
          <div className="space-y-2">
            {show.dateTime[date]?.map((item) => (
              <div
                key={item.time}
                onClick={() => setSelectedTime(item)}
                className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer transition ${
                  selectedTime?.time === item.time
                    ? 'bg-[#2978B5] text-white'
                    : 'hover:bg-[#4A9EDE]/30 text-[#A3AED0]'
                }`}
              >
                <ClockIcon className="w-4 h-4" />
                <p className="text-sm">{isoTimeFormat(item.time)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seat Layout Section */}
      <div className="relative flex-1 flex flex-col items-center mt-24 z-10">
        <h1 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA]">
          Select your seat
        </h1>

        {/* Glowing Screen */}
        <div
          className="w-64 h-2 mx-auto mb-3 rounded-full"
          style={{
            background: 'rgba(41,120,181,0.6)',
            boxShadow: '0 0 10px rgba(41,120,181,0.8)',
          }}
        />
        <p className="text-[#A3AED0] text-sm mb-6 tracking-widest">SCREEN SIDE</p>

        {/* Rows */}
        <div className="flex flex-col items-center mt-10 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>
          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>
                {group.map((row) => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>

        {/* Proceed Button */}
        <div className="mt-12 flex justify-center w-full">
          <button
            onClick={() => navigate('/my-bookings')}
            className="flex items-center gap-2 px-10 py-3 text-sm bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] transition rounded-full font-medium cursor-pointer active:scale-95 text-black"
          >
            Proceed to Checkout
            <ArrowRightIcon strokeWidth={2.5} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import isoTimeFormat from '../lib/isoTimeFormat';
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

  useEffect(() => {
    api.get(`/movies/${id}`)
      .then((res) => {
        setShow({
          movie: res.data.movie,
          dateTime: res.data.dateTime,
        });
      })
      .catch(() => setShow(null));
  }, [id]);

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      toast.error('Please select time first');
      return;
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      toast.error('You can only select 5 seats');
      return;
    }
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((seat) => seat !== seatId) : [...prev, seatId]
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
            className={`h-8 w-8 rounded border cursor-pointer ${
              selectedSeats.includes(seatId)
                ? 'bg-[#2978B5] text-[#E5E9F0] border-[#2978B5]'
                : 'border-[#4A9EDE] text-[#A3AED0] hover:bg-[#4A9EDE] hover:text-[#E5E9F0]'
            }`}
          >
            {seatId}
          </button>
        );
      })}
    </div>
  );

  if (!show) return <Loading />;

  return (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-20 min-h-screen bg-black text-[#E5E9F0] relative">
      {/* Timing Section */}
      <div className="w-full md:w-64 mb-10 md:mb-0 md:mr-10 mt-24">
        <div className="bg-[#303D5A]/30 rounded-xl p-6 shadow-xl w-full max-w-xs backdrop-blur-sm ring-1 ring-[#4A9EDE]/40 relative z-10">
          <p className="text-[#2978B5] text-base font-semibold mb-4 border-b border-[#4A9EDE] pb-2">
            Available Timings
          </p>
          <div className="space-y-2">
            {show.dateTime?.[date]?.map((item) => (
              <div
                key={item.time}
                onClick={() => setSelectedTime(item)}
                className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer transition-all ${
                  selectedTime?.time === item.time
                    ? 'bg-[#2978B5] text-[#E5E9F0]'
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
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16 mt-24 z-10">
        <h1 className="text-2xl font-semibold mb-4 text-[#E5E9F0]">Select your seat</h1>

        <div
          className="w-64 h-2 mx-auto mb-3"
          style={{
            background: 'rgba(41,120,181,0.6)',
            borderRadius: '9999px',
            boxShadow: '0 0 10px rgba(41,120,181,0.8)',
          }}
        />
        <p className="text-[#A3AED0] text-sm mb-6 text-center tracking-widest">SCREEN SIDE</p>

        <div className="flex flex-col items-center mt-10 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>
          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>{group.map((row) => renderSeats(row))}</div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center w-full">
          <button
            onClick={() => {
              if (selectedSeats.length === 0) {
                toast.error('Please select at least one seat');
                return;
              }
              if (!selectedTime) {
                toast.error('Please select a show time');
                return;
              }
              navigate('/my-bookings', {
                state: { selectedSeats, showDateTime: selectedTime, movieId: id },
              });
            }}
            className="flex items-center gap-2 px-10 py-3 text-sm bg-[#2978B5] hover:bg-[#4A9EDE] transition rounded-full font-medium cursor-pointer active:scale-95 text-[#E5E9F0]"
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

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import isoTimeFormat from '../lib/isoTimeFormat';
import BlurCircle from '../components/BlurCircle';
import toast from 'react-hot-toast';

const SeatLayout = () => {
  const groupRows = [['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H'], ['I', 'J']];
  const { id, date } = useParams();
  const navigate = useNavigate();

  const selectedDate = date;
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSeatClick = (seatId) => {
    if (!selectedTime) return toast('Please select time first');
    if (bookedSeats.includes(seatId)) return;

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
        const isBooked = bookedSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);

        return (
          <button
            key={seatId}
            onClick={() => handleSeatClick(seatId)}
            disabled={isBooked}
            className={`h-8 w-8 rounded border transition text-sm ${
              isBooked
                ? 'bg-gray-600 text-white cursor-not-allowed'
                : isSelected
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

  // ✅ Fetch available future show times for this movie and date
  useEffect(() => {
    const fetchShowTimes = async () => {
      try {
        const res = await fetch(`http://localhost/vistalite/getshowtimes.php?movie_id=${id}`);
        const data = await res.json();

        if (data.success && data.dateTime[selectedDate]) {
          const now = new Date();
          const filtered = data.dateTime[selectedDate].filter((time) => {
            const fullTime = new Date(`${selectedDate}T${time}`);
            return fullTime > now;
          });

          if (filtered.length === 0) {
            toast.error('All showtimes for this date have expired.');
          }

          setAvailableTimes(filtered.map((time) => ({ time })));
        } else {
          toast.error('No timings available for this date.');
        }
      } catch (err) {
        toast.error('Failed to load show timings.');
      } finally {
        setLoading(false);
      }
    };

    fetchShowTimes();
  }, [id, selectedDate]);

  // ✅ Fetch already booked seats for selected time
  useEffect(() => {
    if (!selectedTime) return;

    const fetchBookedSeats = async () => {
      try {
        const datetime = `${selectedDate} ${selectedTime.time}`;
        const res = await fetch(
          `http://localhost/vistalite/getbookedseats.php?movie_id=${id}&datetime=${encodeURIComponent(datetime)}`
        );
        const data = await res.json();
        if (data.success) {
          setBookedSeats(data.seats || []);
        }
      } catch (err) {
        toast.error('Failed to load booked seats');
      }
    };

    fetchBookedSeats();
  }, [selectedTime, id, selectedDate]);

  // ✅ Create booking (form-encoded) then navigate to My Bookings
  const handleProceedToCheckout = async () => {
    if (!selectedTime || selectedSeats.length === 0) {
      toast.error('Please select time and seats!');
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append('movie_id', id);
      params.append('date', selectedDate);
      params.append('time', selectedTime.time);
      selectedSeats.forEach(s => params.append('seats[]', s));

      const res = await fetch('http://localhost/vistalite/createbooking.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || 'Failed to create booking');
        return;
      }

      toast.success('Seats reserved! Proceeding to payment…');
      navigate('/my-bookings');
    } catch (err) {
      toast.error('Network error creating booking');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-20 min-h-screen bg-gradient-to-b from-black via-[#0F1A32] to-black text-[#E5E9F0] relative">
      <BlurCircle top="-120px" left="-80px" size="220px" color="rgba(74,144,226,0.3)" />
      <BlurCircle bottom="-60px" right="-60px" size="180px" color="rgba(227,228,250,0.2)" />

      {/* Timing Selection */}
      <div className="w-full md:w-64 mb-10 md:mb-0 md:mr-10 mt-24 z-10">
        <div className="bg-[#303D5A]/30 rounded-xl p-6 shadow-xl backdrop-blur-md ring-1 ring-[#4A9EDE]/40">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-base font-semibold mb-4 border-b border-[#4A9EDE] pb-2">
            Available Timings
          </p>
          <div className="space-y-2">
            {availableTimes.map((item) => (
              <div
                key={item.time}
                onClick={() => {
                  setSelectedTime(item);
                  setSelectedSeats([]);
                }}
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

      {/* Seat Layout */}
      <div className="relative flex-1 flex flex-col items-center mt-24 z-10">
        <h1 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA]">
          Select your seat
        </h1>

        <div
          className="w-64 h-2 mx-auto mb-3 rounded-full"
          style={{ background: 'rgba(41,120,181,0.6)', boxShadow: '0 0 10px rgba(41,120,181,0.8)' }}
        />
        <p className="text-[#A3AED0] text-sm mb-6 tracking-widest">SCREEN SIDE</p>

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

        {/* Checkout */}
        <div className="mt-12 flex justify-center w-full">
          <button
            onClick={handleProceedToCheckout}
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

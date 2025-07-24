import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';
import Loading from '../../components/Loading';
import formatLKR from '../../lib/formatLKR';
import { dateFormat } from '../../lib/dateFormat';

const CashierBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Simulated fetch (replace with real API)
      setTimeout(() => {
        setBookings([]); // ← Empty data for now
        setLoading(false);
      }, 600);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookings([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="relative px-6 md:px-10 pb-10 text-[#E5E9F0] min-h-[85vh]">
      <Title text1="Cashier" text2="Bookings" />
      <BlurCircle top="60px" left="-80px" />
      <BlurCircle bottom="-20px" right="-80px" />

      {bookings.length === 0 ? (
        <p className="text-center text-gray-400 py-10 text-sm">No bookings available.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl backdrop-blur-md border border-[#4A9EDE]/20 shadow-xl mt-8">
          <table className="min-w-full table-auto text-sm bg-[#1C1F2E]/60">
            <thead>
              <tr className="text-left bg-[#2978B5]/20 text-white">
                <th className="py-4 px-6 font-medium">Customer</th>
                <th className="py-4 px-6 font-medium">Movie</th>
                <th className="py-4 px-6 font-medium">Show Time</th>
                <th className="py-4 px-6 font-medium">Seats</th>
                <th className="py-4 px-6 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? 'bg-[#4A9EDE]/5' : 'bg-[#4A9EDE]/10'
                  } border-b border-[#4A9EDE]/10 hover:bg-[#2978B5]/10 transition`}
                >
                  <td className="px-6 py-4 min-w-[180px]">{b.user?.name || 'Anonymous'}</td>
                  <td className="px-6 py-4 min-w-[180px]">{b.show?.movie?.title || 'N/A'}</td>
                  <td className="px-6 py-4 min-w-[160px]">{dateFormat(b.show?.showDateTime)}</td>
                  <td className="px-6 py-4 min-w-[100px]">{b.bookedSeats?.join(', ') || '-'}</td>
                  <td className="px-6 py-4 min-w-[100px] text-[#4A9EDE] font-medium">
                    {formatLKR(b.amount || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CashierBookings;

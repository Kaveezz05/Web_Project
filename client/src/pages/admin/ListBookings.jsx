import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import formatLKR from '../../lib/formatLKR';
import { dateFormat } from '../../lib/dateFormat';
import BlurCircle from '../../components/BlurCircle';

const ListBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      setLoading(true);
      // Replace with real API call
      setBookings([]); // Empty for now
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="List" text2="Bookings" />

      <div className="relative mt-8 px-6 md:px-12 lg:px-20 text-[#E5E9F0]">
        <BlurCircle top="60px" left="-80px" />
        <BlurCircle bottom="0" right="-80px" />

        {bookings.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">No bookings available.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl backdrop-blur-md border border-[#4A9EDE]/20 shadow-xl">
            <table className="min-w-full table-auto text-sm bg-[#1C1F2E]/60">
              <thead>
                <tr className="text-left bg-[#2978B5]/20 text-white">
                  <th className="py-4 px-6 font-medium">User Name</th>
                  <th className="py-4 px-6 font-medium">Movie Name</th>
                  <th className="py-4 px-6 font-medium">Show Time</th>
                  <th className="py-4 px-6 font-medium">Seats</th>
                  <th className="py-4 px-6 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? 'bg-[#4A9EDE]/5' : 'bg-[#4A9EDE]/10'
                    } border-b border-[#4A9EDE]/10 hover:bg-[#2978B5]/10 transition`}
                  >
                    <td className="px-6 py-4 min-w-[180px]">{item.user.name}</td>
                    <td className="px-6 py-4 min-w-[180px]">{item.show.movie.title}</td>
                    <td className="px-6 py-4 min-w-[160px]">{dateFormat(item.show.showDateTime)}</td>
                    <td className="px-6 py-4 min-w-[100px]">{item.bookedSeats.join(', ')}</td>
                    <td className="px-6 py-4 min-w-[100px] text-[#4A9EDE] font-medium">{formatLKR(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ListBookings;

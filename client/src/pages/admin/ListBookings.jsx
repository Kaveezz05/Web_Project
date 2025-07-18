import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import formatLKR from '../../lib/formatLKR';
import { dateFormat } from '../../lib/dateFormat';

const ListBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace this function with real API call to fetch bookings
  const getAllBookings = async () => {
    try {
      setLoading(true);
      // Example: const response = await fetch('your-api-endpoint');
      // const data = await response.json();
      // setBookings(data);

      setBookings([]); // No dummy data, empty array by default
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

  if (bookings.length === 0) {
    return (
      <>
        <Title text1="List" text2="Bookings" />
        <p className="text-white text-center mt-10">No bookings available.</p>
      </>
    );
  }

  return (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden whitespace-nowrap bg-[#121212] text-white">
          <thead>
            <tr className="bg-[#2978B5]/20 text-left">
              <th className="p-2 pl-5 font-medium">User Name</th>
              <th className="p-2 pl-5 font-medium">Movie Name</th>
              <th className="p-2 pl-5 font-medium">Show Time</th>
              <th className="p-2 pl-5 font-medium">Seats</th>
              <th className="p-2 pl-5 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {bookings.map((item, index) => (
              <tr
                key={index}
                className="border-b border-[#2978B5]/10 bg-[#2978B5]/5 even:bg-[#2978B5]/10"
              >
                <td className="p-2 min-w-[180px] pl-5">{item.user.name}</td>
                <td className="p-2 min-w-[180px]">{item.show.movie.title}</td>
                <td className="p-2 min-w-[160px]">{dateFormat(item.show.showDateTime)}</td>
                <td className="p-2 min-w-[100px]">{Object.keys(item.bookedSeats).join(', ')}</td>
                <td className="p-2 min-w-[100px]">{formatLKR(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListBookings;

import React, { useEffect, useState } from 'react';
import { dummyBookingData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import formatLKR from '../../lib/formatLKR';
import { dateFormat } from '../../lib/dateFormat';

const ListBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllBookings = async () => {
    console.log(dummyBookingData);
    setBookings(dummyBookingData);
    setLoading(false);
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden whitespace-nowrap">
          <thead>
            <tr className="bg-[#2978B5]/20 text-white text-left">
              <th className="p-2 pl-5 font-medium">User Name</th>
              <th className="p-2 pl-5 font-medium">Movie Name</th>
              <th className="p-2 pl-5 font-medium">Show Time</th>
              <th className="p-2 pl-5 font-medium">Seats</th>
              <th className="p-2 pl-5 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light'>
  {bookings.map((item, index) => (
    <tr key={index} className='border-b border-[#2978B5]/10 bg-[#2978B5]/5 even:bg-[#2978B5]/10'>
      <td className='p-2 min-w-45 pl-5'>{item.user.name}</td>
      <td className='p-2'>{item.show.movie.title}</td>
      <td className='p-2'>{dateFormat(item.show.showDateTime)}</td>
      <td className='p-2'>
        {Object.keys(item.bookedSeats).join(", ")}
      </td>
      <td className='p-2'>{formatLKR(item.amount)}</td>
    </tr>
  ))}
</tbody>


         
        </table>
      </div>
    </>
  );
};

export default ListBookings;
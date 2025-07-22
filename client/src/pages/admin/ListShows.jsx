import React, { useEffect, useState } from 'react';
import formatLKR from '../../lib/formatLKR';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import BlurCircle from '../../components/BlurCircle';

const ListShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      // Replace this with actual API call
      setShows([]); // No dummy data yet
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllShows();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="List" text2="Shows" />

      <div className="relative mt-8 px-6 md:px-12 lg:px-20 text-[#E5E9F0]">
        <BlurCircle top="100px" left="0" />
        <BlurCircle bottom="0" right="0" />

        {shows.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">No shows available.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl backdrop-blur-md border border-[#4A9EDE]/20 shadow-xl">
            <table className="min-w-full table-auto text-sm bg-[#1C1F2E]/60">
              <thead>
                <tr className="text-left bg-[#2978B5]/20 text-white">
                  <th className="py-4 px-6 font-medium">Movie Name</th>
                  <th className="py-4 px-6 font-medium">Show Time</th>
                  <th className="py-4 px-6 font-medium">Total Bookings</th>
                  <th className="py-4 px-6 font-medium">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((show, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? 'bg-[#4A9EDE]/5' : 'bg-[#4A9EDE]/10'
                    } border-b border-[#4A9EDE]/10 hover:bg-[#2978B5]/10 transition`}
                  >
                    <td className="px-6 py-4">{show.movie.title}</td>
                    <td className="px-6 py-4">{dateFormat(show.showDateTime)}</td>
                    <td className="px-6 py-4">{Object.keys(show.occupiedSeats).length}</td>
                    <td className="px-6 py-4 font-medium text-[#4A9EDE]">
                      {formatLKR(Object.keys(show.occupiedSeats).length * show.showPrice)}
                    </td>
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

export default ListShows;

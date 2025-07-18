import React, { useEffect, useState } from 'react';
import formatLKR from '../../lib/formatLKR';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';

const ListShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const currency = "LKR";

  const getAllShows = async () => {
    try {
      // TODO: Replace this with actual API call, e.g.:
      // const res = await fetch('http://localhost/vistalite/listshows.php');
      // const data = await res.json();
      // setShows(data.shows);

      setShows([]); // empty for now, no dummy data
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
      <div className="max-w-4xl mt-6 overflow-x-auto">
        {shows.length === 0 ? (
          <p className="text-white text-center py-10">No shows available.</p>
        ) : (
          <table className="w-full border-collapse rounded-md overflow-hidden whitespace-nowrap">
            <thead>
              <tr className="bg-[#2978B5]/20 text-white text-left">
                <th className="p-2 pl-5 font-medium">Movie Name</th>
                <th className="p-2 pl-5 font-medium">Show Time</th>
                <th className="p-2 pl-5 font-medium">Total Bookings</th>
                <th className="p-2 pl-5 font-medium">Earnings</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light">
              {shows.map((show, index) => (
                <tr
                  key={index}
                  className="border-b border-[#2978B5]/10 bg-[#2978B5]/5 even:bg-[#2978B5]/10"
                >
                  <td className="p-2 min-4-w-45 pl-5">{show.movie.title}</td>
                  <td className="p-2">{dateFormat(show.showDateTime)}</td>
                  <td className="p-2">{Object.keys(show.occupiedSeats).length}</td>
                  <td className="p-2">
                    {formatLKR(
                      Object.keys(show.occupiedSeats).length * show.showPrice
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ListShows;

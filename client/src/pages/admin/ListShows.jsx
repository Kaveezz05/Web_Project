import React, { useEffect, useState } from "react";
import formatLKR from "../../lib/formatLKR";
import { dateFormat } from "../../lib/dateFormat";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";
import BlurCircle from "../../components/BlurCircle";

const ListShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/vistalite/getshows.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setShows(data.shows);
        } else {
          console.error(data.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch failed:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative px-6 md:px-10 pb-10 text-[#E5E9F0] min-h-[80vh]">
      <BlurCircle top="60px" left="-60px" />
      <BlurCircle bottom="-40px" right="-60px" />

      <Title text1="List" text2="Shows" />

      {loading ? (
        <Loading />
      ) : shows.length === 0 ? (
        <p className="text-white mt-6">No shows found.</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-sm text-left text-gray-200 bg-[#111827] border border-[#2f3542] rounded-lg overflow-hidden">
            <thead className="text-xs uppercase bg-[#1f2937] text-gray-400">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Movie</th>
                <th className="px-6 py-4">Show Date</th>
                <th className="px-6 py-4">Price (LKR)</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((show, index) => (
                <tr
                  key={show.id}
                  className="border-t border-[#2f3542] hover:bg-[#1e293b] transition"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{show.movie_title}</td>
                  <td className="px-6 py-4">
                    {new Date(show.show_datetime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{formatLKR(show.show_price)}</td>
                  <td className="px-6 py-4">{dateFormat(show.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListShows;

import React, { useEffect, useState } from 'react';
import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  UsersIcon,
  StarIcon,
} from 'lucide-react';
import formatLKR from '../../lib/formatLKR';
import Loading from '../../components/Loading';
import BlurCircle from '../../components/BlurCircle';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetch (replace with real API call)
    setTimeout(() => {
      setDashboardData({
        totalBookings: 0,
        totalRevenue: 0,
        activeShows: [],
        totalUser: 0,
      });
      setLoading(false);
    }, 500);
  }, []);

  const dashboardCards = [
    {
      title: 'Total Bookings',
      value: dashboardData.totalBookings ?? 0,
      icon: ChartLineIcon,
    },
    {
      title: 'Total Revenue',
      value: formatLKR(dashboardData.totalRevenue ?? 0),
      icon: CircleDollarSignIcon,
    },
    {
      title: 'Active Shows',
      value: dashboardData.activeShows?.length ?? 0,
      icon: PlayCircleIcon,
    },
    {
      title: 'Total Users',
      value: dashboardData.totalUser ?? 0,
      icon: UsersIcon,
    },
  ];

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="Admin" text2="Dashboard" />

      <div className="relative px-6 md:px-10 pb-10 text-[#E5E9F0] min-h-[80vh]">
        <BlurCircle top="60px" left="-60px" />
        <BlurCircle bottom="-40px" right="-60px" />

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 w-full">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-5 py-4 rounded-lg bg-[#1C1F2E]/70 border border-[#4A9EDE]/20 shadow-lg backdrop-blur"
            >
              <div>
                <p className="text-sm text-[#9CA3AF]">{card.title}</p>
                <p className="text-xl font-semibold mt-1">{card.value}</p>
              </div>
              <card.icon className="w-6 h-6 text-[#4A9EDE]" />
            </div>
          ))}
        </div>

        {/* Active Shows Section */}
        <p className="mt-12 text-lg font-semibold text-[#E5E9F0] border-b border-[#4A9EDE] pb-2">
          Active Shows
        </p>

        <div className="relative flex flex-wrap gap-6 mt-6 max-w-6xl">
          <BlurCircle top="0" left="50%" />
          {dashboardData.activeShows.length === 0 ? (
            <p className="text-gray-400 text-sm mt-4">No active shows currently.</p>
          ) : (
            dashboardData.activeShows.map((show) => (
              <div
                key={show._id}
                className="w-[220px] rounded-xl overflow-hidden bg-[#1C1F2E]/70 border border-[#2978B5]/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition"
              >
                <img
                  src={show.movie.poster_path}
                  alt={show.movie.title}
                  className="h-60 w-full object-cover"
                />
                <div className="p-3">
                  <p className="font-semibold truncate text-[#E5E9F0]">
                    {show.movie.title}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <p className="text-[#4A9EDE]">{formatLKR(show.showPrice)}</p>
                    <div className="flex items-center gap-1 text-gray-400">
                      <StarIcon className="w-4 h-4 text-[#2978B5] fill-[#2978B5]" />
                      <span>{show.movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {dateFormat(show.showDateTime)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;

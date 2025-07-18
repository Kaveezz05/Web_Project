import React, { useEffect, useState } from 'react';
import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  StarIcon,
  UsersIcon,
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
    // Simulate fetching real data here
    // Replace with actual fetch call to your API
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

  const currency = 'LKR';

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="Admin" text2="Dashboard" />

      <div className="relative px-6 md:px-10 pb-10 text-[#E5E9F0] min-h-[80vh]">
        <BlurCircle top="100px" left="0" />

        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 w-full">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 bg-[#2978B5]/10 border border-[#2978B5]/20 rounded-md"
            >
              <div>
                <h1 className="text-sm">{card.title}</h1>
                <p className="text-xl font-medium mt-1">{card.value}</p>
              </div>
              <card.icon className="w-6 h-6 text-[#2978B5]" />
            </div>
          ))}
        </div>

        {/* Active Shows Section */}
        <p className="mt-12 text-lg font-medium">Active Shows</p>
        <div className="relative flex flex-wrap gap-6 mt-4 max-w-6xl">
          <BlurCircle top="100px" left="-10%" />
          {dashboardData.activeShows.length === 0 ? (
            <p className="text-gray-400">No active shows currently.</p>
          ) : (
            dashboardData.activeShows.map((show) => (
              <div
                key={show._id}
                className="w-[220px] rounded-lg overflow-hidden h-full pb-3 bg-[#2978B5]/10 border border-[#2978B5]/20 hover:-translate-y-1 transition duration-300"
              >
                <img
                  src={show.movie.poster_path}
                  alt={show.movie.title}
                  className="h-60 w-full object-cover"
                />
                <p className="font-medium p-2 truncate">{show.movie.title}</p>
                <div className="flex items-center justify-between px-2">
                  <p className="text-lg font-medium">
                    {currency} {show.showPrice}
                  </p>
                  <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                    <StarIcon className="w-4 h-4 text-[#2978B5] fill-[#2978B5]" />
                    {show.movie.vote_average.toFixed(1)}
                  </p>
                </div>
                <p className="px-2 pt-2 text-sm text-gray-500">
                  {dateFormat(show.showDateTime)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;

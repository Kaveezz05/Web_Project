import React, { useEffect, useState } from 'react';
import {
  ClipboardListIcon,
  CircleDollarSignIcon,
  CalendarDaysIcon,
  TicketIcon,
} from 'lucide-react';
import formatLKR from '../../lib/formatLKR';
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';
import Loading from '../../components/Loading';
import { dateFormat } from '../../lib/dateFormat';

const CashierDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    todayBookings: 0,
    totalRevenue: 0,
    todayDate: new Date().toISOString(),
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call or real fetch
    setTimeout(() => {
      setDashboardData({
        totalBookings: 0,
        todayBookings: 0,
        totalRevenue: 0,
        todayDate: new Date().toISOString(),
      });
      setLoading(false);
    }, 500);
  }, []);

  const dashboardCards = [
    {
      title: 'Total Bookings',
      value: dashboardData.totalBookings,
      icon: ClipboardListIcon,
    },
    {
      title: 'Today’s Bookings',
      value: dashboardData.todayBookings,
      icon: TicketIcon,
    },
    {
      title: 'Total Revenue',
      value: formatLKR(dashboardData.totalRevenue),
      icon: CircleDollarSignIcon,
    },
    {
      title: 'Date',
      value: dateFormat(dashboardData.todayDate),
      icon: CalendarDaysIcon,
    },
  ];

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="Cashier" text2="Dashboard" />

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

        {/* Bottom Section (optional placeholder like Admin) */}
        <p className="mt-12 text-lg font-semibold text-[#E5E9F0] border-b border-[#4A9EDE] pb-2">
          Shift Summary
        </p>

        <p className="text-sm text-gray-400 mt-6">
          No summary available for today.
        </p>
      </div>
    </>
  );
};

export default CashierDashboard;

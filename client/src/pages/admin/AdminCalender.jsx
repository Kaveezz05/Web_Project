import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurCircle from '../../components/BlurCircle';
import Title from '../../components/admin/Title';

const AdminCalendar = () => {
  const navigate = useNavigate();

  const now = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));

  // ✅ Admin session check
  useEffect(() => {
    const checkAdminAuth = async () => {
      const res = await fetch("http://localhost/vistalite/admin-auth.php", {
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) navigate("/login");
    };

    checkAdminAuth();
  }, [navigate]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getStartDay = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDay(year, month);

  const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Build calendar matrix
  const weeks = [];
  let day = 1 - startDay;
  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      week.push(day > 0 && day <= daysInMonth ? day : null);
      day++;
    }
    weeks.push(week);
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-[#0F1A32] to-black text-white px-6 md:px-12 py-20">
      <BlurCircle top="40px" left="-120px" />
      <BlurCircle bottom="40px" right="-100px" />
      <Title text1="Admin" text2="Calendar" />

      {/* Header Controls */}
      <div className="flex justify-between items-center max-w-5xl mx-auto mt-10">
        <button onClick={prevMonth} className="px-4 py-2 rounded-md bg-[#1C1F2E] border border-[#4A9EDE]/30 hover:bg-[#4A9EDE]/20 transition">
          ←
        </button>
        <h2 className="text-2xl font-bold text-[#E5E9F0]">
          {monthNames[month]} {year}
        </h2>
        <button onClick={nextMonth} className="px-4 py-2 rounded-md bg-[#1C1F2E] border border-[#4A9EDE]/30 hover:bg-[#4A9EDE]/20 transition">
          →
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mt-6 max-w-5xl mx-auto text-sm text-[#4A90E2] font-semibold">
        {daysShort.map((day) => (
          <div key={day} className="text-center">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 max-w-5xl mx-auto mt-2">
        {weeks.flat().map((day, idx) => (
          <div
            key={idx}
            className="min-h-[100px] rounded-lg bg-[#1C1F2E]/80 border border-[#4A9EDE]/10 shadow-sm p-2 relative transition hover:shadow-md"
          >
            <span className="absolute top-2 left-2 text-xs text-[#A3AED0]">
              {day || ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCalendar;

import React, { useEffect, useState } from 'react';
import BlurCircle from '../../components/BlurCircle';
import Title from '../../components/admin/Title';

const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const AdminCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modal, setModal] = useState({ show: false, date: '', title: '' });
  const [reminders, setReminders] = useState({});
  const [adding, setAdding] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Fetch reminders from backend on mount and after adding
  const fetchReminders = async () => {
    try {
      const res = await fetch('http://localhost/vistalite/getreminders.php', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        const grouped = {};
        data.reminders.forEach(r => {
          if (!grouped[r.date]) grouped[r.date] = [];
          grouped[r.date].push({ id: r.id, title: r.title });
        });
        setReminders(grouped);
      }
    } catch {
      alert('Failed to fetch reminders');
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getStartDay = (y, m) => new Date(y, m, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDay(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

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

  const handleCellClick = (d) => {
    if (!d) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    setModal({ show: true, date: dateStr, title: '' });
  };

  // Add reminder: POST, then refresh reminders for accuracy
  const handleAddReminder = async () => {
    if (adding) return;
    if (!modal.title.trim() || !modal.date.trim()) {
      alert('Please enter both title and date.');
      return;
    }
    setAdding(true);
    try {
      const res = await fetch('http://localhost/vistalite/addreminder.php', {
        method: 'POST',
        credentials: 'include',
        body: new URLSearchParams({ title: modal.title, date: modal.date }),
      });
      const data = await res.json();
      if (data.success) {
        setModal({ show: false, date: '', title: '' });
        await fetchReminders(); // ensure we show real backend data
      } else {
        alert(data.error || 'Failed to add reminder');
      }
    } catch {
      alert('Server error');
    }
    setAdding(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-[#0F1A32] to-black text-white px-6 md:px-12 py-20">
      <BlurCircle top="40px" left="-120px" />
      <BlurCircle bottom="40px" right="-100px" />
      <Title text1="Admin" text2="Calendar" />

      <div className="flex justify-between items-center max-w-5xl mx-auto mt-10">
        <button onClick={prevMonth} className="px-4 py-2 rounded-md bg-[#1C1F2E] border border-[#4A9EDE]/30 hover:bg-[#4A9EDE]/20 transition">←</button>
        <h2 className="text-2xl font-bold text-[#E5E9F0]">{monthNames[month]} {year}</h2>
        <button onClick={nextMonth} className="px-4 py-2 rounded-md bg-[#1C1F2E] border border-[#4A9EDE]/30 hover:bg-[#4A9EDE]/20 transition">→</button>
      </div>

      <div className="grid grid-cols-7 gap-2 mt-6 max-w-5xl mx-auto text-sm text-[#4A90E2] font-semibold">
        {daysShort.map((d) => <div key={d} className="text-center">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-2 max-w-5xl mx-auto mt-2">
        {weeks.flat().map((d, idx) => {
          const fullDate = d ? `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` : null;
          return (
            <div
              key={idx}
              onClick={() => handleCellClick(d)}
              className="min-h-[100px] rounded-lg bg-[#1C1F2E]/80 border border-[#4A9EDE]/10 shadow-sm p-2 relative transition hover:shadow-md cursor-pointer"
            >
              <span className="absolute top-2 left-2 text-xs text-[#A3AED0]">{d || ''}</span>
              {reminders[fullDate]?.map((reminder, i) => (
                <div key={i} className="text-xs text-[#E3E4FA] mt-6 ml-1 truncate bg-[#4A90E2]/20 rounded px-2 py-1">
                  • {reminder.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Add Reminder Modal */}
      {modal.show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1C1F2E] px-8 py-6 rounded-xl border border-[#4A9EDE]/30 shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-bold text-white mb-4">Add Reminder</h2>
            <input
              type="date"
              value={modal.date}
              onChange={e => setModal({ ...modal, date: e.target.value })}
              className="w-full mb-4 px-4 py-2 rounded bg-black/30 border border-[#4A9EDE] text-white"
              disabled={adding}
            />
            <input
              type="text"
              placeholder="Reminder title"
              value={modal.title}
              onChange={e => setModal({ ...modal, title: e.target.value })}
              className="w-full mb-4 px-4 py-2 rounded bg-black/30 border border-[#4A9EDE] text-white"
              disabled={adding}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModal({ show: false, title: '', date: '' })}
                className="bg-gray-600 px-4 py-2 rounded text-white"
                disabled={adding}
              >Cancel</button>
              <button
                onClick={handleAddReminder}
                className="bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black px-6 py-2 rounded font-semibold shadow-md"
                disabled={adding}
              >
                {adding ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setModal({ show: true, date: new Date().toISOString().split('T')[0], title: '' })}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black px-5 py-3 rounded-full shadow-lg font-semibold text-sm hover:scale-105 transition"
      >
        + Add Reminder
      </button>
    </div>
  );
};

export default AdminCalendar;

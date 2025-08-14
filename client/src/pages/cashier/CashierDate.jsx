// /src/pages/cashier/CashierDate.jsx
import React, { useMemo, useState } from "react";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import Loading from "../../components/Loading";
import { CalendarDays, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_BASE = "http://localhost/vistalite";

/** Normalize seats from comma string or array -> array */
function normalizeSeats(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === "string")
    return v.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

/** Robust datetime formatter that accepts:
 *  - "YYYY-MM-DD HH:MM[:SS]" (MySQL DATETIME)
 *  - "YYYY-MM-DDTHH:MM[:SS]" (ISO, with or without timezone)
 */
function formatShowTime(input) {
  if (!input) return "-";
  let d;

  if (input instanceof Date) {
    d = input;
  } else if (typeof input === "string") {
    let s = input.trim();

    // If it's MySQL-style with a space, turn it into ISO-ish
    if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(:\d{2})?$/.test(s)) {
      const [date, time] = s.split(/\s+/);
      s = `${date}T${time}`;
    }

    d = new Date(s);

    // Some environments (Safari) can still fail; last‑chance manual parse
    if (Number.isNaN(d.getTime())) {
      const m = s.match(
        /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/
      );
      if (m) {
        d = new Date(
          Number(m[1]),
          Number(m[2]) - 1,
          Number(m[3]),
          Number(m[4]),
          Number(m[5]),
          Number(m[6] || 0)
        );
      }
    }
  }

  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return "-";

  // Clean, compact, locale-friendly line
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const CashierDate = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);

  const fetchByDate = async (date) => {
    if (!date) return;
    try {
      setLoading(true);
      setError("");
      setBookings([]);

      const res = await fetch(
        `${API_BASE}/cashier-get-bookings-by-date.php?date=${encodeURIComponent(
          date
        )}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data?.success) {
        const normalized = (data.bookings || []).map((b) => ({
          ...b,
          seats: normalizeSeats(b.seats),
        }));
        setBookings(normalized);
      } else {
        setError(data?.error || "Failed to load bookings");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value; // YYYY-MM-DD
    setSelectedDate(date);
    fetchByDate(date);
  };

  // Flatten to rows for UI/PDF
  const rows = useMemo(() => {
    const list = bookings.map((b) => ({
      movie: b.movie_title || "",
      showTime: b.show_datetime || "",
      user: b.username || "",
      userId: b.user_id ?? "",
      seats: Array.isArray(b.seats) ? b.seats : [],
    }));
    // sort by time asc, then movie, then user
    return list.sort((a, b) => {
      const t = new Date(a.showTime) - new Date(b.showTime);
      if (t !== 0) return t;
      const m = a.movie.localeCompare(b.movie);
      if (m !== 0) return m;
      return String(a.user).localeCompare(String(b.user));
    });
  }, [bookings]);

  const totals = useMemo(() => {
    const seatCount = rows.reduce((acc, r) => acc + r.seats.length, 0);
    return { bookings: rows.length, seats: seatCount };
  }, [rows]);

  const exportPDF = () => {
    if (!rows.length) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });

    // Header (spaced so it never overlaps)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Bookings by Date", 40, 40);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const headerY = 62;
    doc.text(`Date: ${selectedDate || "-"}`, 40, headerY);
    doc.text(
      `Total Bookings: ${totals.bookings}  |  Total Seats: ${totals.seats}`,
      40,
      headerY + 18
    );

    // Table
    const body = rows.map((r, i) => [
      i + 1,
      r.movie,
      formatShowTime(r.showTime),
      r.user,
      String(r.userId),
      r.seats.join(", "),
      r.seats.length,
    ]);

    autoTable(doc, {
      startY: headerY + 36,
      head: [["#", "Movie", "Show Time", "User", "User ID", "Seats", "Count"]],
      body,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 6,
        overflow: "linebreak", // wrap long seat strings
      },
      headStyles: { fillColor: [41, 120, 181], textColor: 255 },
      // sensible widths; Seats column flexes to fill remaining space
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 60 },
        2: { cellWidth: 110 },
        3: { cellWidth: 50},
        4: { cellWidth: 90 },
        6: { cellWidth: 45 },
      },
      margin: { left: 40, right: 40 },
    });

    doc.save(`bookings-${selectedDate || "date"}.pdf`);
  };

  return (
    <div className="relative px-6 md:px-10 pb-20 text-[#E5E9F0] min-h-[80vh]">
      <BlurCircle top="60px" left="-60px" />
      <BlurCircle bottom="0" right="-60px" />
      <Title text1="Filter" text2="by Date" />

      <div className="mt-6 bg-[#1C1F2E]/70 rounded-xl border border-[#4A9EDE]/20 p-6 shadow-xl">
        <div className="grid gap-4 sm:grid-cols-3 items-end">
          <div className="sm:col-span-1">
            <label htmlFor="date" className="block text-sm text-[#A3AED0] mb-2 font-medium">
              Filter by Date
            </label>
            <div className="relative">
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full p-3 bg-[#1C1F2E] border border-[#4A9EDE]/30 text-[#E5E9F0] rounded-lg placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#2978B5] transition"
              />
              <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3AED0] pointer-events-none" />
            </div>
          </div>

          <div className="sm:col-span-2 flex items-end justify-start sm:justify-end gap-3">
            <div className="text-xs sm:text-sm text-[#A3AED0] bg-black/20 rounded-lg px-3 py-2 border border-[#4A9EDE]/20">
              <span className="mr-3">
                Bookings: <span className="text-[#4A9EDE] font-semibold">{totals.bookings}</span>
              </span>
              <span>
                Seats: <span className="text-[#4A9EDE] font-semibold">{totals.seats}</span>
              </span>
            </div>

            <button
              disabled={!rows.length}
              onClick={exportPDF}
              className="h-10 px-4 rounded-lg bg-[#2978B5] hover:bg-[#246a9f] text-white text-sm font-medium shadow-md transition"
             
            >
              Export PDF
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-6">
            <Loading />
          </div>
        )}

        {!loading && error && <p className="mt-6 text-sm text-red-400">{error}</p>}

        {!loading && !error && (
          <>
            {rows.length === 0 ? (
              <p className="mt-6 text-sm text-gray-400">No bookings found for this date.</p>
            ) : (
              <div className="overflow-x-auto mt-6 rounded-xl border border-[#4A9EDE]/10">
                <table className="min-w-full text-sm bg-[#0f172a]/60">
                  <thead className="bg-[#12203a] text-[#E5E9F0]">
                    <tr>
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Movie</th>
                      <th className="px-4 py-3 text-left">Show Time</th>
                      <th className="px-4 py-3 text-left">User</th>
                      <th className="px-4 py-3 text-left">User ID</th>
                      <th className="px-4 py-3 text-left">Seats</th>
                      <th className="px-4 py-3 text-left">Seats Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={`${r.userId}-${i}`} className="border-t border-[#4A9EDE]/10">
                        <td className="px-4 py-3">{i + 1}</td>
                        <td className="px-4 py-3">{r.movie}</td>
                        <td className="px-4 py-3">{formatShowTime(r.showTime)}</td>
                        <td className="px-4 py-3">{r.user}</td>
                        <td className="px-4 py-3">{r.userId}</td>
                        <td className="px-4 py-3">{r.seats.join(", ") || "-"}</td>
                        <td className="px-4 py-3">{r.seats.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CashierDate;

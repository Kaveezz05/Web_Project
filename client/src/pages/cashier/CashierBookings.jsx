// /src/pages/cashier/CashierBookings.jsx
import React, { useEffect, useMemo, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import BlurCircle from "../../components/BlurCircle";

// PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_BASE = "http://localhost/vistalite";

const CashierBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllBookings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/cashier-get-bookings.php`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data?.success && Array.isArray(data.bookings)) {
          const normalized = data.bookings.map((b) => ({
            // normalize for safety (depends on your PHP SELECT aliases)
            booking_id: b.booking_id ?? b.id ?? "",
            user_name: b.user_name ?? b.username ?? "",
            user_id: b.user_id ?? b.userid ?? "",
            movie_title: b.movie_title ?? b.movie ?? "",
            show_datetime: b.show_datetime ?? b.showtime ?? "",
            seats: Array.isArray(b.seats)
              ? b.seats
              : typeof b.seats === "string"
              ? b.seats.split(",").map((s) => s.trim()).filter(Boolean)
              : [],
          }));

          // ✅ sort by date/time ASC (earliest first)
          normalized.sort((a, b) => {
            const da = new Date(a.show_datetime).getTime() || 0;
            const db = new Date(b.show_datetime).getTime() || 0;
            return da - db;
          });

          setBookings(normalized);
        } else {
          console.error("API error:", data?.error, data?.details);
          setBookings([]);
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    getAllBookings();
  }, []);

  // These rows are already in date order because we sorted `bookings` above
  const rowsForPdf = useMemo(
    () =>
      bookings.map((b) => [
        b.user_name || "-",
        b.user_id || "-",
        b.movie_title || "-",
        b.show_datetime ? dateFormat(b.show_datetime) : "-",
        b.seats?.join(", ") || "-",
      ]),
    [bookings]
  );

  const handleExportPdf = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "A4" });

    // Title
    doc.setFontSize(16);
    doc.text("Total Bookings", 40, 40);

    // Table
    autoTable(doc, {
      startY: 60,
      head: [["User", "User ID", "Movie", "Show Time", "Seats"]],
      body: rowsForPdf,
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [41, 120, 181] },
      didDrawPage: (data) => {
        const pageCount = doc.getNumberOfPages();
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.getWidth();
        doc.setFontSize(9);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          pageWidth - 80,
          pageSize.getHeight() - 20
        );
      },
      columnStyles: {
        0: { cellWidth: 150 }, // User
        1: { cellWidth: 80 },  // User ID
        2: { cellWidth: 180 }, // Movie
        3: { cellWidth: 140 }, // Show Time
        4: { cellWidth: "auto" }, // Seats (fills remaining)
      },
    });

    doc.save("bookings report.pdf");
  };

  if (loading) return <Loading />;

  return (
    <>
      {/* Header row with Title (left) and Export button (right) */}
      <div className="flex items-center justify-between pr-6 md:pr-12 lg:pr-20">
        <Title text1="List" text2="Bookings" />
        <button
          onClick={handleExportPdf}
          className="h-10 px-4 rounded-lg bg-[#2978B5] hover:bg-[#246a9f] text-white text-sm font-medium shadow-md transition"
        >
          Export PDF
        </button>
      </div>

      <div className="relative mt-2 px-6 md:px-12 lg:px-20 text-[#E5E9F0]">
        <BlurCircle top="60px" left="-80px" />
        <BlurCircle bottom="0" right="-80px" />

        {bookings.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">
            No bookings available.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl backdrop-blur-md border border-[#4A9EDE]/20 shadow-xl">
            <table className="min-w-full table-auto text-sm bg-[#1C1F2E]/60">
              <thead>
                <tr className="text-left bg-[#2978B5]/20 text-white">
                  <th className="py-4 px-6 font-medium">User</th>
                  <th className="py-4 px-6 font-medium">User ID</th>
                  <th className="py-4 px-6 font-medium">Movie</th>
                  <th className="py-4 px-6 font-medium">Show Time</th>
                  <th className="py-4 px-6 font-medium">Seats</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, index) => (
                  <tr
                    key={b.booking_id ?? index}
                    className={`${
                      index % 2 === 0 ? "bg-[#4A9EDE]/5" : "bg-[#4A9EDE]/10"
                    } border-b border-[#4A9EDE]/10 hover:bg-[#2978B5]/10 transition`}
                  >
                    <td className="px-6 py-4 min-w-[160px]">{b.user_name || "-"}</td>
                    <td className="px-6 py-4 min-w-[100px]">{b.user_id || "-"}</td>
                    <td className="px-6 py-4 min-w-[200px]">{b.movie_title || "-"}</td>
                    <td className="px-6 py-4 min-w-[180px]">
                      {b.show_datetime ? dateFormat(b.show_datetime) : "-"}
                    </td>
                    <td className="px-6 py-4 min-w-[180px]">
                      {b.seats?.join(", ") || "-"}
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

export default CashierBookings;

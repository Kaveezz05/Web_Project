import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeFormat";
import { dateFormat } from "../lib/dateFormat";
import formatLKR from "../lib/formatLKR";
import { CheckCircle } from "lucide-react";

const API_BASE = "http://localhost/vistalite";

// How close to the showtime users are no longer allowed to cancel (hours)
const MIN_CANCEL_HOURS = 24;

/* -------- small helper: safely parse JSON even if PHP prints warnings ------- */
async function safeFetchJson(input, init) {
  const res = await fetch(input, init);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    // bubble up whatever the server printed so you can see the real problem
    throw new Error(text || "Invalid server response");
  }
  return { ok: res.ok, data };
}

/* -------- determine if a booking is cancelable and why/why not ------------- */
function getCancelStatus(booking) {
  // if backend already flags it paid
  if (booking?.isPaid) {
    return { allowed: false, reason: "Paid bookings cannot be cancelled." };
  }

  // check how soon the show is
  const when = booking?.show?.showDateTime
    ? new Date(booking.show.showDateTime)
    : null;

  if (!when || isNaN(when.getTime())) {
    // If we don't know the time, play it safe and disallow from UI; backend should also guard.
    return { allowed: false, reason: "Showtime unavailable — cannot cancel." };
  }

  const msDiff = when.getTime() - Date.now();
  const hours = msDiff / (1000 * 60 * 60);

  if (hours < MIN_CANCEL_HOURS) {
    return {
      allowed: false,
      reason: `Too close to showtime (less than ${MIN_CANCEL_HOURS} hours).`,
    };
  }

  return { allowed: true, reason: "" };
}

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ===== Payment modal =====
  const [payingIndex, setPayingIndex] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    address: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [isPaying, setIsPaying] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // ===== Cancel modal =====
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null); // { booking, status }
  const [isCancelling, setIsCancelling] = useState(false);

  // ===== Fetch bookings =====
  useEffect(() => {
    (async () => {
      try {
        const { data } = await safeFetchJson(`${API_BASE}/getbookings.php`, {
          credentials: "include",
        });
        if (data.success) {
          setBookings(Array.isArray(data.bookings) ? data.bookings : []);
        } else {
          console.error(data.error || "Failed to load bookings");
          setBookings([]);
          alert(data.error || "Failed to load bookings");
        }
      } catch (err) {
        console.error("getbookings error:", err);
        setBookings([]);
        alert("Server error while loading bookings:\n\n" + err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ===== Form helpers (payment) =====
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let v = value;

    if (name === "cardNumber") {
      v = v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    } else if (name === "expiry") {
      v = v.replace(/[^\d/]/g, "").slice(0, 5);
      if (v.length === 2 && !v.includes("/")) v = v + "/";
    } else if (name === "cvv") {
      v = v.replace(/\D/g, "").slice(0, 3);
    }

    setFormData((prev) => ({ ...prev, [name]: v }));
  };

  const validateForm = () => {
    const next = {};
    if (!formData.fullName.trim()) next.fullName = "Full Name is required.";
    if (!formData.idNumber.trim()) next.idNumber = "ID Number is required.";
    if (!formData.address.trim()) next.address = "Address is required.";
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, "")))
      next.cardNumber = "Card number must be 16 digits.";
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiry))
      next.expiry = "Expiry must be in MM/YY format.";
    if (!/^\d{3}$/.test(formData.cvv)) next.cvv = "CVV must be 3 digits.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsPaying(true);
    try {
      const bookingId = bookings[payingIndex].id;
      const bookingAmount = bookings[payingIndex].amount || 0;

      // NB: your PHP file name is `markpaid.php` (all-lowercase) — keep it consistent.
      const { ok, data } = await safeFetchJson(`${API_BASE}/markpaid.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: bookingId,
          payment_ref: "CARD-" + Date.now(),
          amount: bookingAmount,
        }),
      });

      if (!ok || !data.success) {
        throw new Error(data.error || data.message || "Payment failed");
      }

      setBookings((prev) => {
        const next = [...prev];
        next[payingIndex] = { ...next[payingIndex], isPaid: true };
        return next;
      });
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment error:\n\n" + err.message);
    } finally {
      setIsPaying(false);
      setPayingIndex(null);
      setErrors({});
      setFormData({
        fullName: "",
        idNumber: "",
        address: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
      });
    }
  };

  // ===== Cancel booking flow =====
  const openCancelModal = (booking) => {
    const status = getCancelStatus(booking);
    setCancelTarget({ booking, status });
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    if (isCancelling) return;
    setShowCancelModal(false);
    setCancelTarget(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget?.booking?.id) return;

    // Guard in case of manual enabling
    if (!cancelTarget.status.allowed) {
      alert(cancelTarget.status.reason || "This booking cannot be cancelled.");
      return;
    }

    setIsCancelling(true);

    try {
      const { ok, data } = await safeFetchJson(`${API_BASE}/cancelbooking.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: cancelTarget.booking.id }),
      });

      if (!ok || !data.success) {
        throw new Error(data.error || data.message || "Server error");
      }

      setBookings((prev) => prev.filter((b) => b.id !== cancelTarget.booking.id));
      closeCancelModal();
      alert("Booking cancelled successfully");
    } catch (err) {
      console.error("Cancel booking error:", err);
      alert("Could not cancel booking:\n\n" + err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  // ===== Payment overlay click-to-close =====
  const handlePaymentOverlayClick = (e) => {
    if (e.target.id === "payment-overlay" && !isPaying) {
      setPayingIndex(null);
      setErrors({});
      setFormData({
        fullName: "",
        idNumber: "",
        address: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
      });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="relative min-h-[85vh] bg-gradient-to-br from-black via-[#0F1A32] to-black text-[#E5E9F0] px-6 md:px-16 lg:px-40 xl:px-44 py-24 overflow-hidden">
      <BlurCircle top="0px" left="-120px" size="260px" color="rgba(74,144,226,0.25)" />
      <BlurCircle bottom="0px" right="-100px" size="240px" color="rgba(74,144,226,0.25)" />

      <h1 className="text-xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] w-fit">
        My Bookings
      </h1>

      {bookings.length === 0 && (
        <p className="text-[#A3AED0]">You have no bookings yet.</p>
      )}

      {bookings.map((item, index) => {
        const cancelStatus = getCancelStatus(item);
        return (
          <div
            key={item.id}
            className="group bg-[#0F1A32]/60 hover:bg-[#1C2A4B]/60 transition-colors rounded-xl border border-[#4A9EDE]/20 shadow-md p-5 mb-4 max-w-3xl"
          >
            {/* Top Row: status + amount + actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 text-xs rounded-full bg-[#122A57] border border-[#4A9EDE]/30 text-[#A3C5EE]">
                  {timeFormat(item.show.movie.runtime)}
                </span>
                {item.isPaid ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-amber-500/10 text-amber-300 border border-amber-400/30">
                    <span className="w-2 h-2 rounded-full bg-amber-300" /> Pending
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <p className="text-2xl font-semibold tracking-tight">
                  {formatLKR(item.amount || 0)}
                </p>

                {!item.isPaid && (
                  <>
                    <button
                      className="shrink-0 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black px-4 py-1.5 text-sm rounded-full font-medium hover:opacity-90"
                      onClick={() => {
                        setPayingIndex(index);
                        setErrors({});
                        setFormData({
                          fullName: "",
                          idNumber: "",
                          address: "",
                          cardNumber: "",
                          expiry: "",
                          cvv: "",
                        });
                      }}
                    >
                      Pay Now
                    </button>

                    <button
                      className={`shrink-0 px-4 py-1.5 text-sm rounded-full font-medium ${
                        cancelStatus.allowed
                          ? "bg-gradient-to-r from-red-500 to-red-300 text-white hover:opacity-90"
                          : "bg-red-500/20 text-red-300 cursor-not-allowed"
                      }`}
                      title={
                        cancelStatus.allowed ? "Cancel this booking" : cancelStatus.reason
                      }
                      onClick={() => openCancelModal(item)}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Middle: Movie + Date/Time */}
            <div className="mt-3 grid md:grid-cols-2 gap-2">
              <div>
                <p className="text-lg font-semibold leading-tight">
                  {item.show.movie.title}
                </p>
                <p className="text-[#A3AED0] text-sm">
                  {dateFormat(item.show.showDateTime)}
                </p>
              </div>

              <div className="md:text-right">
                <p className="text-sm">
                  <span className="text-[#7FA9DC]">Total Tickets:</span>{" "}
                  <span className="font-semibold">{item.bookedSeats.length}</span>
                </p>
                <p className="text-sm">
                  <span className="text-[#7FA9DC]">Seat Numbers:</span>{" "}
                  <span className="font-semibold">
                    {item.bookedSeats.join(", ")}
                  </span>
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* ===== Payment Modal ===== */}
      {payingIndex !== null && (
        <div
          id="payment-overlay"
          onClick={handlePaymentOverlayClick}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <form
            onSubmit={handlePaymentSubmit}
            className="relative bg-[#0F1A32]/90 backdrop-blur-md border border-[#2978B5] rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
            noValidate
          >
            <div className="relative z-10 space-y-5">
              <h2 className="text-2xl font-bold mb-2">Complete Your Payment</h2>
              <p className="text-sm text-[#A3AED0]">
                Booking:{" "}
                <span className="font-semibold">
                  {bookings[payingIndex]?.show?.movie?.title}
                </span>{" "}
                · Amount:{" "}
                <span className="font-semibold">
                  {formatLKR(bookings[payingIndex]?.amount || 0)}
                </span>
              </p>

              {["fullName", "idNumber", "address", "cardNumber", "expiry", "cvv"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 text-sm font-semibold text-[#7AA7D9] capitalize">
                    {field === "cvv" ? "CVV" : field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    placeholder={`Enter ${field}`}
                    className={`w-full px-4 py-2 rounded-lg bg-[#122A57] border ${
                      errors[field] ? "border-red-500" : "border-[#4A9EDE]"
                    } text-white placeholder-[#5D7DB3] focus:outline-none focus:ring-2 focus:ring-[#4A9EDE]`}
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPayingIndex(null)}
                  className="px-6 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/15"
                  disabled={isPaying}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPaying}
                  className={`px-8 py-2 rounded-full font-semibold text-black bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] ${
                    isPaying ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
                  }`}
                >
                  {isPaying ? "Processing..." : "Pay"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ===== Cancel Booking Modal ===== */}
   {showCancelModal && cancelTarget && (
  <div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    onClick={(e) => {
      if (e.target === e.currentTarget) closeCancelModal();
    }}
  >
    <div className="relative bg-[#0F1A32]/90 backdrop-blur-md border border-red-400/30 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl text-white">
      <h3 className="text-xl font-bold mb-2 text-red-300">Cancel Booking</h3>

      {/* Always show the general restriction note */}
      <div className="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 text-red-200 px-4 py-2 text-xs leading-relaxed">
        <strong className="block text-sm text-red-300 mb-1">Important:</strong>
        Paid bookings and bookings within the next 24 hours cannot be cancelled.
      </div>

      <p className="text-sm text-[#A3AED0] mb-4">
        You’re about to cancel{" "}
        <span className="font-semibold text-white">
          {cancelTarget.booking.show?.movie?.title || "this booking"}
        </span>.
      </p>

      <div className="text-sm space-y-1 mb-4">
        <div>
          <span className="text-[#7FA9DC]">Amount:</span>{" "}
          {formatLKR(cancelTarget.booking.amount || 0)}
        </div>
        <div>
          <span className="text-[#7FA9DC]">Seats:</span>{" "}
          {(cancelTarget.booking.bookedSeats || []).join(", ") || "-"}
        </div>
        <div>
          <span className="text-[#7FA9DC]">Showtime:</span>{" "}
          {dateFormat(cancelTarget.booking.show?.showDateTime)}
        </div>
      </div>

      {/* Show restriction reason if cancellation not allowed */}
      {!cancelTarget.status.allowed && (
        <div className="mb-5 rounded-lg border border-red-400/50 bg-red-500/15 text-red-200 px-3 py-2 text-xs">
          <strong className="block mb-1">Cancellation not allowed</strong>
          {cancelTarget.status.reason}
        </div>
      )}

      {cancelTarget.status.allowed && (
        <p className="text-xs text-red-200/80 mb-5">
          This action will permanently remove the booking and free the seats.
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button
          className="px-5 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/15"
          onClick={closeCancelModal}
          disabled={isCancelling}
        >
          Keep Booking
        </button>

        <button
          className={`px-6 py-2 rounded-full font-semibold text-white ${
            cancelTarget.status.allowed
              ? "bg-gradient-to-r from-red-500 to-red-300 hover:opacity-90"
              : "bg-red-500/20 cursor-not-allowed"
          }`}
          onClick={handleConfirmCancel}
          disabled={isCancelling || !cancelTarget.status.allowed}
          title={!cancelTarget.status.allowed ? cancelTarget.status.reason : "Confirm cancel"}
        >
          {isCancelling ? "Cancelling..." : "Confirm Cancel"}
        </button>
      </div>
    </div>
  </div>
)}


      {/* ===== Success Popup (payment) ===== */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1C1F2E]/90 border border-[#4A9EDE]/20 px-8 py-6 rounded-xl text-center shadow-xl max-w-sm w-full">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-green-400 mb-2">
              Payment Successful
            </h2>
            <p className="text-sm text-[#A3AED0] mb-4">
              Thank you! Your booking is confirmed.
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;

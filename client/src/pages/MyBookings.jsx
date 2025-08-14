import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeFormat";
import { dateFormat } from "../lib/dateFormat";
import formatLKR from "../lib/formatLKR";
import { CheckCircle } from "lucide-react";

const API_BASE = "http://localhost/vistalite";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API_BASE}/getbookings.php`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setBookings(Array.isArray(data.bookings) ? data.bookings : []);
        } else {
          setBookings([]);
          console.error(data.error);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === "cardNumber") {
      val = val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    } else if (name === "expiry") {
      val = val.length === 2 && !val.includes("/") ? val + "/" : val;
    } else if (name === "cvv") {
      val = val.replace(/\D/g, "").slice(0, 3);
    }
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!formData.idNumber.trim()) newErrors.idNumber = "ID Number is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, "")))
      newErrors.cardNumber = "Card number must be 16 digits.";
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.expiry))
      newErrors.expiry = "Expiry must be in MM/YY format.";
    if (!/^\d{3}$/.test(formData.cvv)) newErrors.cvv = "CVV must be 3 digits.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsPaying(true);
    try {
      const bookingId = bookings[payingIndex].id;
      const bookingAmount = bookings[payingIndex].amount || 0;
      const res = await fetch(`${API_BASE}/markPaid.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: bookingId,
          payment_ref: "CARD-" + Date.now(),
          amount: bookingAmount,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookings((prev) => {
          const next = [...prev];
          next[payingIndex].isPaid = true;
          return next;
        });
        setShowSuccessPopup(true);
      } else {
        alert("Payment failed: " + data.error);
      }
    } catch (err) {
      console.error("Payment error:", err);
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

  const handleModalClick = (e) => {
    if (e.target.id === "modal-overlay" && !isPaying) {
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

      {bookings.map((item, index) => (
        <div
          key={item.id}
          className="group bg-[#0F1A32]/60 hover:bg-[#1C2A4B]/60 transition-colors rounded-xl border border-[#4A9EDE]/20 shadow-md p-5 mb-4 max-w-3xl"
        >
          {/* Top Row: Title + status + amount */}
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

            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold tracking-tight">
                {formatLKR(item.amount || 0)}
              </p>
              {!item.isPaid && (
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
                <span className="font-semibold">{item.bookedSeats.join(", ")}</span>
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Payment Modal */}
      {payingIndex !== null && (
        <div
          id="modal-overlay"
          onClick={handleModalClick}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <form
            onSubmit={handlePaymentSubmit}
            className="relative bg-[#0F1A32]/90 backdrop-blur-md border border-[#2978B5] rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
            noValidate
          >
            <div className="relative z-10 space-y-5">
              <h2 className="text-2xl font-bold mb-2">
                Complete Your Payment
              </h2>
              <p className="text-sm text-[#A3AED0]">
                Booking: <span className="font-semibold">{bookings[payingIndex]?.show?.movie?.title}</span> ·{" "}
                Amount: <span className="font-semibold">{formatLKR(bookings[payingIndex]?.amount || 0)}</span>
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
                  {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
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

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1C1F2E]/90 border border-[#4A9EDE]/20 px-8 py-6 rounded-xl text-center shadow-xl max-w-sm w-full">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-green-400 mb-2">Payment Successful</h2>
            <p className="text-sm text-[#A3AED0] mb-4">Thank you! Your booking is confirmed.</p>
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

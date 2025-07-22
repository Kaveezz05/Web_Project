import React, { useEffect, useState } from "react";
import { dummyBookingData } from "../assets/assets";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeFormat";
import { dateFormat } from "../lib/dateFormat";
import formatLKR from "../lib/formatLKR";
import { CheckCircle } from "lucide-react";

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

  useEffect(() => {
    setBookings(dummyBookingData);
    setIsLoading(false);
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
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) newErrors.cardNumber = "Card number must be 16 digits.";
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.expiry)) newErrors.expiry = "Expiry must be in MM/YY format.";
    if (!/^\d{3}$/.test(formData.cvv)) newErrors.cvv = "CVV must be 3 digits.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsPaying(true);
    setTimeout(() => {
      setBookings((prev) => {
        const updated = [...prev];
        updated[payingIndex].isPaid = true;
        return updated;
      });
      setIsPaying(false);
      setShowSuccessPopup(true);
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
    }, 2000);
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

      {bookings.map((item, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row justify-between bg-[#2978B5]/8 hover:bg-[#4A9EDE]/20 rounded-lg mt-4 p-2 max-w-3xl"
        >
          <div className="flex flex-col md:flex-row">
            <img
              src={item.show.movie.poster_path}
              alt={item.show.movie.title}
              className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded"
            />
            <div className="flex flex-col p-4">
              <p className="text-lg font-semibold">{item.show.movie.title}</p>
              <p className="text-gray-400 text-sm">{timeFormat(item.show.movie.runtime)}</p>
              <p className="text-gray-400 text-sm mt-auto">{dateFormat(item.show.showDateTime)}</p>
            </div>
          </div>

          <div className="flex flex-col md:items-end md:text-right justify-between p-4">
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold mb-3">{formatLKR(item.amount)}</p>
              {!item.isPaid ? (
                <button
                  className="bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black px-4 py-1.5 mb-3 text-sm rounded-full font-medium"
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
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A1FFC3] to-[#4A90E2] font-semibold">
                  Paid
                </span>
              )}
            </div>
            <div className="text-sm">
              <p>
                <span className="text-gray-400">Total Tickets: </span>
                {item.bookedSeats.length}
              </p>
              <p>
                <span className="text-gray-400">Seat Numbers: </span>
                {item.bookedSeats.join(", ")}
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
            className="relative bg-[#2978B5]/10 backdrop-blur-md border border-[#2978B5] rounded-xl p-8 max-w-md w-full mx-4 shadow-xl text-white"
            onClick={(e) => e.stopPropagation()}
            noValidate
          >
            <div className="relative z-10 space-y-5">
              <h2 className="text-2xl font-bold mb-4 border-b border-[#4A9EDE] pb-2">
                Complete Your Payment
              </h2>

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

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setPayingIndex(null)}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black font-semibold"
                  disabled={isPaying}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPaying}
                  className={`px-8 py-2 rounded-full font-semibold text-white ${
                    isPaying ? "opacity-60 cursor-not-allowed" : "bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA]"
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

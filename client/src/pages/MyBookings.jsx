import React, { useEffect, useState } from "react";
import { dummyBookingData } from "../assets/assets";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeFormat";
import { dateFormat } from "../lib/dateFormat";
import formatLKR from "../lib/formatLKR";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Index of booking currently paying, or null if none
  const [payingIndex, setPayingIndex] = useState(null);

  // Payment form data
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    address: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Payment process status
  const [isPaying, setIsPaying] = useState(false);

  // Success message shown after payment
  const [successMessage, setSuccessMessage] = useState("");

  const getMyBookings = async () => {
    setBookings(dummyBookingData);
    setIsLoading(false);
  };

  useEffect(() => {
    getMyBookings();
  }, []);

  // Handle form input changes with formatting
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      let val = value.replace(/\D/g, "").slice(0, 16);
      val = val.replace(/(.{4})/g, "$1 ").trim();
      setFormData((prev) => ({ ...prev, [name]: val }));
    } else if (name === "expiry") {
      let val = value;
      if (val.length === 2 && formData.expiry.length === 1 && !val.includes("/")) {
        val = val + "/";
      }
      setFormData((prev) => ({ ...prev, [name]: val }));
    } else if (name === "cvv") {
      const val = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prev) => ({ ...prev, [name]: val }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate form fields
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

  // Handle payment submit
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsPaying(true);
    setSuccessMessage("");

    // Simulate payment processing delay
    setTimeout(() => {
      setBookings((prev) => {
        const updated = [...prev];
        updated[payingIndex].isPaid = true;
        return updated;
      });
      setIsPaying(false);
      setSuccessMessage("Payment successful! Thank you.");
      setFormData({
        fullName: "",
        idNumber: "",
        address: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
      });
      setErrors({});
      setPayingIndex(null);
    }, 2000);
  };

  // Close modal when clicking outside the form
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
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0px" left="600px" />
      <h1 className="text-g font-semibold mb-4">My Bookings</h1>

      {bookings.map((item, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row justify-between bg-[#2978B5]/8 hover:bg-[#4A9EDE]/20 rounded-lg mt-4 p-2 max-w-3xl"
        >
          <div className="flex flex-col md:flex-row">
            <img
              src={item.show.movie.poster_path}
              alt={`${item.show.movie.title} poster`}
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
              {!item.isPaid && (
                <button
                  className="bg-[#2978B5] px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer"
                  onClick={() => {
                    setPayingIndex(index);
                    setSuccessMessage("");
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
              {item.isPaid && <span className="text-green-600 font-semibold">Paid</span>}
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

      {/* Modal popup */}
      {payingIndex !== null && (
        <div
          id="modal-overlay"
          onClick={handleModalClick}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        >
          <form
            onSubmit={handlePaymentSubmit}
            className="bg-[#0B1E3A] rounded-lg p-6 w-full max-w-md mx-4 shadow-lg relative text-white"
            onClick={(e) => e.stopPropagation()} // prevent modal close when clicking inside form
            noValidate
          >
            <h2 className="text-2xl font-semibold mb-6 border-b border-[#2978B5] pb-2">
              Complete Your Payment
            </h2>

            {/* Full Name */}
            <label htmlFor="fullName" className="block mb-1 font-semibold text-[#7AA7D9]">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full mb-4 px-3 py-2 rounded-md bg-[#122A57] border ${
                errors.fullName ? "border-red-500" : "border-[#2978B5]"
              } text-white placeholder-[#5D7DB3] focus:outline-none focus:ring-2 focus:ring-[#4A9EDE]`}
              placeholder="John Doe"
              required
            />
            {errors.fullName && <p className="text-red-500 text-xs mb-3">{errors.fullName}</p>}

            {/* ID Number */}
            <label htmlFor="idNumber" className="block mb-1 font-semibold text-[#7AA7D9]">
              ID Number
            </label>
            <input
              id="idNumber"
              name="idNumber"
              type="text"
              value={formData.idNumber}
              onChange={handleInputChange}
              className={`w-full mb-4 px-3 py-2 rounded-md bg-[#122A57] border ${
                errors.idNumber ? "border-red-500" : "border-[#2978B5]"
              } text-white placeholder-[#5D7DB3] focus:outline-none focus:ring-2 focus:ring-[#4A9EDE]`}
              placeholder="123456789V"
              required
            />
            {errors.idNumber && <p className="text-red-500 text-xs mb-3">{errors.idNumber}</p>}

            {/* Address */}
            <label htmlFor="address" className="block mb-1 font-semibold text-[#7AA7D9]">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full mb-4 px-3 py-2 rounded-md bg-[#122A57] border ${
                errors.address ? "border-red-500" : "border-[#2978B5]"
              } text-white placeholder-[#5D7DB3] resize-none focus:outline-none focus:ring-2 focus:ring-[#4A9EDE]`}
              placeholder="123 Main St, City, Country"
              rows={3}
              required
            />
            {errors.address && <p className="text-red-500 text-xs mb-3">{errors.address}</p>}

            {/* Card Number */}
            <label htmlFor="cardNumber" className="block mb-1 font-semibold text-[#7AA7D9]">
              Card Number
            </label>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              inputMode="numeric"
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleInputChange}
              className={`w-full mb-4 px-3 py-2 rounded-md bg-[#122A57] border ${
                errors.cardNumber ? "border-red-500" : "border-[#2978B5]"
              } text-white placeholder-[#5D7DB3] focus:outline-none focus:ring-2 focus:ring-[#4A9EDE]`}
              required
            />
            {errors.cardNumber && <p className="text-red-500 text-xs mb-3">{errors.cardNumber}</p>}

            <div className="flex gap-4 mb-6">
              {/* Expiry */}
              <div className="flex-1">
                <label htmlFor="expiry" className="block mb-1 font-semibold text-[#7AA7D9]">
                  Expiry (MM/YY)
                </label>
                <input
                  id="expiry"
                  name="expiry"
                  type="text"
                  maxLength={5}
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md bg-[#122A57] border ${
                    errors.expiry ? "border-red-500" : "border-[#2978B5]"
                  } text-white placeholder-[#5D7DB3] focus:outline-none focus:ring-2 focus:ring-[#4A9EDE]`}
                  required
                />
                {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
              </div>

              {/* CVV */}
              <div className="flex-1">
                <label htmlFor="cvv" className="block mb-1 font-semibold text-[#7AA7D9]">
                  CVV
                </label>
                <input
                  id="cvv"
                  name="cvv"
                  type="password"
                  maxLength={3}
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md bg-[#122A57] border ${
                    errors.cvv ? "border-red-500" : "border-[#2978B5]"
                  } text-white placeholder-[#5D7DB3] focus:outline-none focus:ring-2 focus:ring-[#4A9EDE]`}
                  required
                />
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="px-5 py-2 rounded-full bg-[#4A9EDE] hover:bg-[#2978B5] font-semibold transition-colors"
                onClick={() => setPayingIndex(null)}
                disabled={isPaying}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPaying}
                className={`px-6 py-2 rounded-full font-semibold text-white ${
                  isPaying ? "bg-blue-400 cursor-not-allowed" : "bg-[#2978B5] hover:bg-[#4A9EDE]"
                } transition-colors`}
              >
                {isPaying ? "Processing..." : "Pay"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success message outside modal */}
      {successMessage && payingIndex === null && (
        <p className="mt-4 text-green-600 font-semibold text-center">{successMessage}</p>
      )}
    </div>
  );
};

export default MyBookings;

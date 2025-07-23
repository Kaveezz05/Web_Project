import React from 'react';
import formatLKR from '../../lib/formatLKR';
import { dateFormat } from '../../lib/dateFormat';

const CashierBookingCard = ({ booking }) => {
  return (
    <div className="bg-[#1C1F2E]/70 border border-[#4A90E2]/20 rounded-xl p-4 shadow-md flex justify-between">
      <div>
        <p className="font-bold">{booking.show.movie.title}</p>
        <p className="text-sm text-[#A3AED0]">Seats: {booking.bookedSeats.join(', ')}</p>
        <p className="text-sm text-[#A3AED0]">Date: {dateFormat(booking.show.showDateTime)}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-[#E3E4FA]">{formatLKR(booking.amount)}</p>
        <p className={`text-sm ${booking.isPaid ? 'text-green-400' : 'text-yellow-400'}`}>
          {booking.isPaid ? 'Paid' : 'Pending'}
        </p>
      </div>
    </div>
  );
};

export default CashierBookingCard;

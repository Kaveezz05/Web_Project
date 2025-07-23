import React from 'react';
import CashierBookingCard from './BookingCard';
import { dummyBookingData } from '../../assets/assets';

const CashierBookingList = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-[#E5E9F0] mb-4">Booking Records</h2>
      {dummyBookingData.map((booking, idx) => (
        <CashierBookingCard key={idx} booking={booking} />
      ))}
    </div>
  );
};

export default CashierBookingList;

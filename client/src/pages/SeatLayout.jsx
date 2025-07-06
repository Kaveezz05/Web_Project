import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import Loading from "../components/Loading";
import { ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";

const SeatLayout = () => {
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getShow = async () => {
      const foundShow = dummyShowsData.find((show) => show._id === id);
      if (foundShow) {
        setShow({
          movie: foundShow,
          dateTime: dummyDateTimeData,
        });
      }
    };
    getShow();
  }, [id]);

  if (!show) return <Loading />;

  return (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-20 min-h-screen bg-black text-white">
      {/* Timing Section */}
      <div className="w-full md:w-64 mb-10 md:mb-0 md:mr-10">
        <div className="bg-red-950/30 rounded-xl p-6 shadow-xl w-full max-w-xs backdrop-blur-sm ring-1 ring-red-800/40">
          <p className="text-white text-base font-semibold mb-4 border-b border-red-400 pb-2">
            Available Timings
          </p>
          <div className="space-y-2">
            {show.dateTime[date].map((item, index) => (
              <div
                key={item.time}
                onClick={() => setSelectedTime(item)}
                className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer transition-all 
                  ${
                    selectedTime?.time === item.time
                      ? "bg-red-600 text-white"
                      : "hover:bg-red-700/30 text-gray-300"
                  }`}
              >
                <ClockIcon className="w-4 h-4" />
                <p className="text-sm">{isoTimeFormat(item.time)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seat Layout Placeholder */}
      <div className="flex-1 flex justify-center items-center border border-dashed border-gray-600 rounded-lg p-10">
        <p className="text-gray-400">Seat layout coming soon...</p>
      </div>
    </div>
  );
};

export default SeatLayout;

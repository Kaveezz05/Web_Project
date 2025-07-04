import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurCircle from './BlurCircle';
import { ChevronRightIcon, ChevronsLeftIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const DateSelect = ({ dateTime, id }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const onBookHandler = () => {
    if (!selected) {
      return toast.error('Please select a date');
    }
    navigate(`/movies/${id}/${selected}`);
    scrollTo(0, 0);
  };

  return (
    <div id="dateSelect" className="pt-30 px-6 md:px-16 lg:px-36 mt-20">
      <div className="relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl overflow-hidden">
        {/* Blur Glow Circles */}
        <BlurCircle top="50px" left="-50px" size="200px" color="#ff007f" />
        <BlurCircle top="150px" right="-40px" size="160px" color="#00d9ff" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div>
            <p className="text-2xl font-semibold text-white">Choose Date</p>
            <div className="flex items-center gap-6 text-sm mt-6">
              <ChevronsLeftIcon width={28} className="text-white opacity-50" />
              <div className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
                {Object.keys(dateTime).map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelected(date)}
                    className={`flex flex-col items-center justify-center h-16 w-16 rounded-xl bg-white/10 text-white cursor-pointer relative transition-all duration-300 hover:bg-white/20 ${
                      selected === date
                        ? 'scale-105 border-2 border-darkRed text-white'
                        : 'scale-100 border border-primary/70'
                    }`}
                    style={{

                      letterSpacing: selected === date ? '0.05em' : 'normal',
                      textShadow: selected === date ? '0 0 6px rgba(255,255,255,0.8)' : 'none',
                    }}
                  >
                    <span className="text-lg font-bold">
                      {new Date(date).getDate()}
                    </span>
                    <span className="text-xs">
                      {new Date(date).toLocaleString('en-US', { month: 'short' })}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={onBookHandler}
            className="bg-primary text-white px-10 py-3 mt-6 md:mt-0 rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-md"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateSelect;

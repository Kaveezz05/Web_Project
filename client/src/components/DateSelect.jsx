import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRightIcon, ChevronsLeftIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const DateSelect = ({ dateTime = {}, id }) => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const onBookHandler = () => {
    if (!selected) {
      toast.error('Please select a date')
      return
    }
    navigate(`/movies/${id}/${selected}`)
    window.scrollTo(0, 0)
  }

  if (!dateTime || Object.keys(dateTime).length === 0) {
    return (
      <div className="pt-30 px-6 md:px-16 lg:px-36 mt-20 text-[#E5E9F0] bg-black">
        No dates available.
      </div>
    )
  }

  return (
    <div id="dateSelect" className="pt-30 px-6 md:px-16 lg:px-36 mt-20 bg-black">
      <div className="relative p-8 rounded-2xl border border-[#303D5A] bg-[#000000]/90 backdrop-blur-md shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div>
            <p className="text-2xl font-semibold text-[#2978B5]">Choose Date</p>
            <div className="flex items-center gap-6 text-sm mt-6 text-[#E5E9F0]">
              <ChevronsLeftIcon width={28} className="opacity-50" />
              <div className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
                {Object.keys(dateTime).map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelected(date)}
                    className={`flex flex-col items-center justify-center h-16 w-16 rounded-xl cursor-pointer relative transition-all duration-300
                      ${
                        selected === date
                          ? 'scale-105 border-2 border-[#2978B5] bg-[#2978B5] text-[#E5E9F0] shadow-[0_0_8px_rgba(41,120,181,0.8)]'
                          : 'scale-100 border border-[#4A9EDE]/70 bg-[#000]/10 text-[#E5E9F0] hover:bg-[#4A9EDE]/40'
                      }
                    `}
                    style={{
                      letterSpacing: selected === date ? '0.05em' : 'normal',
                      textShadow: selected === date ? '0 0 6px rgba(255,255,255,0.8)' : 'none',
                    }}
                    type="button"
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
            className="bg-[#2978B5] text-[#E5E9F0] px-10 py-3 mt-6 md:mt-0 rounded-full hover:bg-[#4A9EDE] hover:scale-105 transition-all duration-300 shadow-md"
            type="button"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default DateSelect

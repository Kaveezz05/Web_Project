import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import BlurCircle from './BlurCircle'
import { PlayCircleIcon } from 'lucide-react'

const TrailerSection = ({ trailers = [] }) => {
  const [currentTrailer, setCurrentTrailer] = useState(trailers[0] || null)

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden bg-black text-[#9CA3AF]'>
      <p className='text-[#9CA3AF] font-medium text-lg max-w-[960px] mx-auto'>Trailers</p>

      <div className='relative mt-6'>
        <BlurCircle top='-100px' right='-100px' />

        <div className="mx-auto aspect-video max-w-4xl w-full transition-opacity duration-500 ease-in-out rounded-md overflow-hidden shadow-lg">
          {currentTrailer && (
            <ReactPlayer
              key={currentTrailer.videoUrl}
              url={currentTrailer.videoUrl}
              controls
              width="100%"
              height="100%"
            />
          )}
        </div>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto'>
        {trailers.map((trailer) => (
          <div
            key={trailer.image}
            title={trailer.title || 'Trailer'}
            className={`relative cursor-pointer transition duration-300 rounded-lg overflow-hidden
              ${
                currentTrailer?.videoUrl === trailer.videoUrl
                  ? 'ring-2 ring-[#2978B5]'
                  : 'hover:opacity-100 hover:-translate-y-1'
              }`}
            onClick={() => setCurrentTrailer(trailer)}
          >
            <img
              src={trailer.image}
              alt={trailer.title || 'Trailer thumbnail'}
              className='rounded-lg w-full h-full object-cover brightness-75'
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className='absolute top-1/2 left-1/2 w-5 md:w-8 h-5 md:h-12 transform -translate-x-1/2 -translate-y-1/2 text-[#9CA3AF]'
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrailerSection

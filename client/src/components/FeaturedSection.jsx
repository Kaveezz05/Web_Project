import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'

const FeaturedSection = ({ featuredMovies = [] }) => {
  const navigate = useNavigate()

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden bg-black text-[#E5E9F0]">
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <BlurCircle top="0" right="-80px" />

        <p className="text-[#9CA3AF] font-medium text-lg">Now Showing</p>

        <button
          onClick={() => {
            navigate('/movies')
            window.scrollTo(0, 0)
          }}
          className="group flex items-center gap-2 text-sm text-[#9CA3AF]"
        >
          View All
          <ArrowRight className="group-hover:translate-x-0.5 transition-transform w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8">
        {featuredMovies.slice(0, 4).map((movie) => (
          <MovieCard key={movie._id || movie.id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate('/movies')
            window.scrollTo(0, 0)
          }}
          className="px-10 py-3 text-sm bg-[#2978B5] hover:bg-[#4A9EDE] transition rounded-md font-medium text-[#E5E9F0] cursor-pointer"
        >
          Show more
        </button>
      </div>
    </div>
  )
}

export default FeaturedSection

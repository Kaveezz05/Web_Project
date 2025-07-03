import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'

const MovieCard = ({ movie }) => {
  const navigate = useNavigate()

  return (
    <div className='flex flex-col bg-gray-900 rounded-2xl shadow-lg overflow-hidden w-64 transition-transform hover:scale-105 duration-300'>

      
      <div
        className='relative cursor-pointer h-52 w-full'
        onClick={() => {
          navigate(`/movies/${movie._id}`)
          scrollTo(0, 0)
        }}
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
          alt={movie.title}
          className='h-full w-full object-cover rounded-t-2xl'
        />

        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-2xl' />
      </div>

      <div className='p-4 flex flex-col gap-2'>

      
        <h3 className='text-white font-semibold text-lg truncate'>
          {movie.title}
        </h3>

        <p className='text-sm text-gray-400'>
          {new Date(movie.release_date).getFullYear()} ·{' '}
          {movie.genres?.slice(0, 2).map((g) => g.name).join(' | ')} ·{' '}
          {movie.runtime ? timeFormat(movie.runtime) : 'N/A'}

        </p>

      
        <div className='flex items-center justify-between mt-3'>
          <button
            onClick={() => {
              navigate(`/movies/${movie._id}`)
              scrollTo(0, 0)
            }}
            className='px-4 py-1.5 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium text-white'
          >
            Buy Ticket
          </button>

          <span className='flex items-center gap-1 text-sm text-yellow-400'>
            <StarIcon className='w-4 h-4 fill-yellow-400' />
            {movie.vote_average?.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MovieCard

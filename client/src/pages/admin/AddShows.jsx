import React, { useEffect, useState } from 'react';
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { CheckIcon, StarIcon } from 'lucide-react';
import { kConverter } from '../../lib/kConverter';

const AddShows = () => {
  const currency = "LKR";
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovies, setselectedMovies] = useState(null);
  const [dateTimeSelection, setdateTimeSelection] = useState({});
  const [dateTimeInput, setdateTimeInput] = useState("");
  const [showPrice, setshowPrice] = useState("");

  const fetchNowPlayingMovies = async () => {
    setNowPlayingMovies(dummyShowsData); 
  };

  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />
      <p className='mt-10 text-lg font-medium'>Now Playing Movies</p>
      <div className='overflow-x-auto pb-4'> 
        <div className='group flex flex-wrap gap-4 mt-4 w-max'>
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie._id}
              className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 
              hover:-translate-y-1 transition duration-300`}
              onClick={() => setselectedMovies(movie._id)}
            >
              <div className='relative rounded-lg overflow-hidden'>
                <img src={movie.poster_path} alt='' className='w-full object-cover brightness-90' />
                <div className='text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0'>
                  <p className='flex items-center gap-1 text-gray-400'>
                    <StarIcon className='w-4 h-4 text-[#2978B5] fill-[#2978B5]' />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className='text-gray-300'>{kConverter(movie.vote_count)} Votes</p>
                </div>
              </div>

              {selectedMovies === movie._id && (
                <div className='absolute top-2 right-2 flex items-center justify-center bg-[#2978B5] h-6 w-6 rounded'>
                  <CheckIcon className='w-4 h-4 text-white' strokeWidth={2.5} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  ) : <Loading />;
};

export default AddShows;

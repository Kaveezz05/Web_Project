import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    const navigate =useNavigate()
  return (
    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.png")] bg-cover 
    bg-center h-screen'>
        <img src={assets.marvelLogo} alt="" className="max-h-11 lg:h-11 mt-20"/>

        <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110'>Guardians <br/> of the Galaxy</h1>  


        <div className='flex items-center gap-4 text-gray-300'> 
            <span>Action | Adventure | Sci-Fi</span>
            <div className='flex itemems-cener gap-1'>
                <CalendarIcon className='W-4.5 H-4.5'/>2018
            </div>
             <div className='flex itemems-cener gap-1'>
                <ClockIcon className='W-4.5 H-4.5'/>2h 8m
            </div>


        </div>    
        <p className='max-w-md text-gray-300'>
          In Marvel Studios’ Guardians of the Galaxy Vol. 3 our beloved band of misfits are looking a little different these days. 
          Peter Quill, still reeling from the loss of Gamora, must rally his team around him to defend the universe and protect one of their own.
        </p>
        <button onClick={() => navigate('/movies')} className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-meduim cursor-pointer'>
            Explore Movies
            <ArrowRight className='w-5 h-5'/> 
        </button>
    </div>

    
  )
}

export default HeroSection

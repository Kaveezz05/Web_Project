import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import BlurCircle from '../../components/BlurCircle'
import Title from '../../components/admin/Title'

const AdminCalender = () => {
  const [dates, setDates] = useState([])

  useEffect(() => {
    fetch("http://localhost/vistalite/getcalendar.php")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDates(data.dates.map(d => new Date(d.created_at)))
        }
      })
      .catch(err => console.error(err))
  }, [])

  const tileClassName = ({ date }) => {
    if (dates.find(d => d.toDateString() === date.toDateString())) {
      return 'bg-blue-500 text-white font-bold rounded'
    }
    return null
  }

  return (
    <div className="relative p-10 min-h-screen bg-[#0F1A32] text-white">
      <BlurCircle top="60px" left="-100px" />
      <BlurCircle bottom="-60px" right="-100px" />
      <Title text1="Admin" text2="Calendar" />
      <div className="bg-black/40 backdrop-blur-md p-6 rounded-lg w-fit mx-auto mt-10">
        <Calendar tileClassName={tileClassName} />
      </div>
    </div>
  )
}

export default AdminCalender

import React from 'react'
import { useParams } from 'react-router-dom'
import useGameSlots from './hooks/useGameSlots';

type Props = {}

const GameDetails = (props: Props) => {
    const handleClick=(slot)=>{
        console.log(slot)
    }
    const {gameId} = useParams();
    console.log(gameId);
    const { data, isLoading, isError, error } = useGameSlots(gameId , '2026-02-24T00:00:00Z');
    console.log(data);
  return (
   <>
    <div>
      Booking Slot on 
    </div>
    <div className="flex flex-wrap gap-4 p-2">
      {data && data.map((slot) => (
          <div key={slot.id} onClick={() => handleClick(slot)} className="w-[180px] h-[200px] bg-blue-20 border  rounded-lg">
          <div><strong>Assigned:</strong> {slot.assigned}</div>
          <div><strong>Available Seats:</strong> {slot.availableSeats}</div>
          <div><strong>Capacity:</strong> {slot.capacity}</div>
          <div><strong>Start Time:</strong> {slot.startTime}</div>
          <div><strong>End Time:</strong> {new Date(slot.endTime).toLocaleTimeString()}</div>
          <div><strong>Booking Open:</strong> {slot.isBookingOpen ? "Yes" : "No"}</div>
          <button className='bg-blue-200' onClick={()=>{handleClick(slot)}}>Book</button>
        </div>
      ))}
    </div>
    </>
  )
}

export default GameDetails;
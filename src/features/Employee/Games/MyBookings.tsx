import React from 'react'
import { useParams } from 'react-router-dom'

type Props = {}

const MyBookings = (props: Props) => {
    const {userId} = useParams();
    console.log(userId);
  return (
    <div>MyBookings</div>
  )
}

export default MyBookings;
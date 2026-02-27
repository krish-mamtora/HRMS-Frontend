import { useMutation } from '@tanstack/react-query';
import React from 'react'
import api from '../../../auth/api/axios';

type Props = {}
export interface BookingRequestCreateDto {
    SlotId:number,
    BookedBy :number;
    userIds:number[],
    Status : string;
}
interface UserBookingDetail {
    userId: number;
    status: string; 
    message: string;
}
interface BookingResultDto {
    userResults: UserBookingDetail[];
    bookedUsers: number[];
    waitingUsers: number[];
}

function useCreateBooking() {
  return useMutation({
    mutationFn : async (data:BookingRequestCreateDto)=>{
        const res = await api.post("/Booking" , data);
        return res.data;
    }
  }
  )
  
}
export default useCreateBooking;

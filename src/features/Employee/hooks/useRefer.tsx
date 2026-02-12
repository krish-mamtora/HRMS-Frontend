import React from 'react'
import api from '../../auth/api/axios';
import { useQuery } from '@tanstack/react-query';

export interface ReferalCreate{
    JobId :number,
    ReffName : string ,
    ReffMail : string , 
    ReffResumeUrl : string , 
    EmpId : number , 
    Description : string ,  
}

const fetchJobs = async():Promise<ReferalCreate[]>=>{
    const response = await api.get<ReferalCreate[]>('/jobListing');
     console.log(response)
    return response.data;
}

const useRefer = () => {
   return useQuery<ReferalCreate[],Error>({
        queryKey : ['JobCreate'],
        queryFn : fetchJobs,
    });
}
export default useRefer;
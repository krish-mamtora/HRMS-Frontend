import React from 'react'
import api from '../../auth/api/axios';
import { useQuery } from '@tanstack/react-query';

export interface ReferalCreate{
    // JobId :number,
    // ReffName : string ,
    // ReffMail : string , 
    // ReffResumeUrl : string , 
    // EmpId : number , 
    // Description : string ,  
}

const SendJobMail = async():Promise<ReferalCreate[]>=>{
    const response = await api.get<ReferalCreate[]>('/send');
     console.log(response)
    return response.data;
}

const useSendMail = () => {
   return useQuery<ReferalCreate[],Error>({
        queryKey : ['SendMail'],
        queryFn : SendJobMail,
    });
}
export default useSendMail;
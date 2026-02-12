import React from 'react'
import api from '../../auth/api/axios';
import { useQuery } from '@tanstack/react-query';

type Props = {}

export interface JobReferals{
    JobId :number,
    ReffName : string ,
    ReffMail : string , 
    ReffResumeUrl : string , 
    EmpId : number , 
    Description : string ,  
}

const fetchApplicationsFromJobId = async(id:number):Promise<JobReferals[]>=>{
    
    const response = await api.get<JobReferals[]>(`/Referal/job/${id}`);
     console.log(response)
    return response.data;
}

const useApplications = () => {
    return useQuery<JobReferals[],Error>({
        queryKey : ['JobReferals'],
        queryFn : fetchApplicationsFromJobId,
    });
}
export default useApplications;
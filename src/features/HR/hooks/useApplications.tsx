import React from 'react'
import api from '../../auth/api/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type Props = {}

export interface JobReferals{
    id: number,
    jobId :number,
    reffName : string ,
    reffMail : string , 
    reffResumeUrl : string , 
    empId : number , 
    description : string ,  
    status : string,
    receiverEmails?: string[] | null;
}

const fetchApplicationsFromJobId = async(jobId:number):Promise<JobReferals[]>=>{
    
    const response = await api.get<JobReferals[]>(`/Referal/job/${jobId}`);
     console.log("response data : ",response.data)
    return response.data;
}

export const useApplications = (jobId:number) => {
    return useQuery<JobReferals[],Error>({
        queryKey : ['JobReferals' , jobId],
        queryFn :()=> fetchApplicationsFromJobId(jobId),
                   staleTime: 1000 * 60 * 5,   
            gcTime: 1000 * 60 * 10,    
            refetchOnWindowFocus: false,
            refetchOnMount: false,      
            retry: 2,
    });
}

export const useUpdateStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updatedData }: { id: number, updatedData: any }) => {
            const response = await api.put(`/Referal/${id}`, updatedData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['JobReferals'] });
        },
    });
};

import React from 'react'
import api from '../../auth/api/axios';
import { useMutation, useQuery ,useQueryClient } from '@tanstack/react-query';
import type { Job } from '../../Employee/JobListing/types';
type Props = {}
interface JobCreate {
  title: string;
  description: string;
  status : string;
  expYearsReq: number;
  role: string;
  totalPositions: number;
  jdUrl:string;
  contactMail:string
  managedBy : number;
}

const fetchJobs = async():Promise<JobCreate[]>=>{
    const response = await api.get<JobCreate[]>('/jobListing');
     console.log(response)
    return response.data;
}
const updateJob = async (job: Job): Promise<Job> => {
    const response = await api.put<Job>(`/jobListing/${job.id}`, job);
    return response.data;
}

export const useJobs = () => {
   return useQuery<JobCreate[],Error>({
        queryKey : ['JobCreate'],
        queryFn : fetchJobs,
          staleTime: 1000 * 60 * 5,   
            gcTime: 1000 * 60 * 10,    
            refetchOnWindowFocus: false,
            refetchOnMount: false,      
            retry: 2, 
    });
}
export const useUpdateJob = () => {
    const queryClient = useQueryClient();
    return useMutation({
       mutationFn: async ({ id, updatedJob }: { id: number, updatedJob: FormData }) => {
         const response = await api.put(`/jobListing/${id}`, updatedJob, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
      } ,
      onSuccess: ()=>{
        alert('Job updated!');
        queryClient.invalidateQueries({queryKey:['JobCreate']});
      },
      onError: (error) => {
        console.error("Update failed:", error);
      }
    })
}

// export default useJobs
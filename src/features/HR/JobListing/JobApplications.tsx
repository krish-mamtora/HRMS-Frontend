import React from 'react'
import { useParams } from 'react-router-dom';
import usePlans from '../hooks/usePlans';
import useApplications from '../hooks/useApplications';

export const JobApplications = () => {
    const jobId = useParams();
    console.log(jobId)

     const {data , isLoading , isError , error} = useApplications();
    
        if (isLoading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        // console.log(data);
  return (
    <>
    
    <div>JobApplications</div>

    </>
  )
}

export default JobApplications;
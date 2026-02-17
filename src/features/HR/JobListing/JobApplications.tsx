import React from 'react'
import { useParams } from 'react-router-dom';
import useApplications from '../hooks/useApplications';
import api from '../../auth/api/axios';
import { resume } from 'react-dom/server';

export const JobApplications = () => {
      const {jobId} = useParams<{jobId: string}>();

    if (!jobId) 
    {
        return <div>No Job Id Found</div>
    }

    const handleDownload = async (resumeUrl  : string)=>{
        fetch(`https://localhost:7035/api/referrals/download-resume/${resumeUrl}`)
        .then(response=>response.blob())
        .then(blob=>{
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
             a.download = resumeUrl.split('_')[1] || resumeUrl; 
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
    }

    const numJobid = Number(jobId);
    const { data, isLoading, isError, error } = useApplications(numJobid);
    console.log("Here", data)
    console.log(typeof(data));
    if (isLoading) return <div>Loading...</div>;
    if (isError || error) return <div>Error: {error?.message}</div>;

    return (
        <>
            <div>
            <div className='font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>Job Applications</div>

                <div className="mt-5 relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
                    <table className="w-full text-sm text-left rtl:text-right text-body">
                        <thead className="bg-neutral-secondary-soft border-b border-default">
                            <tr>
                                <th className="px-6 py-3 font-medium">Job Id</th>
                                <th className="px-6 py-3 font-medium">Name </th>
                                <th className="px-6 py-3 font-medium">Email </th>
                                <th className="px-6 py-3 font-medium">Resume </th>
                                <th className="px-6 py-3 font-medium">Referred By</th>
                                <th className="px-6 py-3 font-medium">Description</th>
                                   <th className="px-6 py-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((item, index) => (
                                <tr key={index} className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                                    <td className="px-6 py-4">{item.jobId}</td>
                                    <td className="px-6 py-4">{item.reffName}</td>
                                    <td className="px-6 py-4">{item.reffMail}</td>
                                    <td className="px-6 py-4 col ">
                                        <a href={item.reffResumeUrl} target='_blank' onClick={()=>{handleDownload(item.reffResumeUrl)}} className='font-medium text-fg-brand hover:underline text-blue-500 hover:text-blue-700'>View Resume</a>
                                    </td >
                                    <td className="px-6 py-4">{item.empId}</td>
                                    <td className="px-6 py-4">{item.description}</td>
                                    <td  className="px-6 py-4">
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600">Status</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default JobApplications;

import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import  {useApplications, useUpdateStatus, type JobReferals } from '../hooks/useApplications';
import api from '../../auth/api/axios';
import { resume } from 'react-dom/server';

export const JobApplications = () => {
    const {jobId} = useParams<{jobId: string}>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<JobReferals | null>(null);
    const [tempStatus, setTempStatus] = useState("");
    
    const numJobid = Number(jobId);
    const { data, isLoading, isError, error } = useApplications(numJobid);
    const updateMutation = useUpdateStatus();

    if (!jobId) 
    {
        return <div>No Job Id Found</div>
    }

    const handleDownload = async (e: React.MouseEvent, resumeUrl: string) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://localhost:7035/api/getresume/download-resume/${resumeUrl}`);
            if (!response.ok) {
                throw new Error('Could not download the file. Please check if the file exists.');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            
            const fileName = resumeUrl.includes('_')?resumeUrl.split('_').slice(1).join('_') : resumeUrl;
            a.download = fileName; 

            document.body.appendChild(a);
            a.click();
           window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Download error:", err);
            alert("Failed to download resume. Please try again.");
        }
    };

    console.log("Here", data)
    console.log(typeof(data));
    
    const handleActionClick = (application: JobReferals) => {
        setSelectedApplication(application);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedApplication(null);
    };
    const handleSaveStatus = async () => {
    if (!selectedApplication || selectedApplication.id === undefined) {
        console.error("Cannot update: Record ID is missing from data", selectedApplication);
        alert("System Error: Record ID is missing.");
        return;
    }

    const updatedPayload = {
        id: selectedApplication.id,
        jobId: selectedApplication.jobId,
        reffName: selectedApplication.reffName,
        reffMail: selectedApplication.reffMail,
        empId: selectedApplication.empId,
        description: selectedApplication.description,
        status: tempStatus, 
        receiverEmails: selectedApplication.receiverEmails || []
    };

    try {
        await updateMutation.mutateAsync({ 
            id: selectedApplication.id, 
            updatedData: updatedPayload 
        });
        handleCloseModal();
    } catch (err) {
        console.error("Update failed:", err);
    }
};

    if (isLoading) return <div>Loading...</div>;
    if (isError || error) return <div>Error: {error?.message}</div>;

    return (
        <>
            <div className='p-4'>
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
                                <th className="px-6 py-3 font-medium">Status</th>
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
                                        <a 
                                        href="#" 
                                        onClick={(e) => handleDownload(e, item.reffResumeUrl)} 
                                        className='font-medium text-blue-600 hover:underline flex items-center'
                                    >
                                        Download Resume
                                    </a>
                                    </td >
                                    <td className="px-6 py-4">{item.empId}</td>
                                    <td className="px-6 py-4">{item.description}</td>
                                    <td className="px-6 py-4">{item.status}</td>

                                    <td  className="px-6 py-4">
                                        <button onClick={() => handleActionClick(item)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Action</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && selectedApplication && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Update Application</h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Change Status</label>
                            <select 
                                className="w-full border border-gray-300 rounded-md p-2.5 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                value={tempStatus}
                                onChange={(e) => setTempStatus(e.target.value)}
                            >
                                <option value="Applied">Applied</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Selected">Selected</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={handleCloseModal} 
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveStatus}
                                disabled={updateMutation.isPending}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 shadow-sm"
                            >
                                {updateMutation.isPending ? 'Updating...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default JobApplications;
